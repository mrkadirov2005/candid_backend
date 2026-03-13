import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hasher } from '#/shared/lib/hasher';
import { type UserRole } from '#/shared/types/repository';
import { EmployerRepository } from '../../employer/repositories/employer.repository';
import { StudentRepository } from '../../student/repositories/student.repository';
import { TeacherRepository } from '../../teacher/teacher.repository';
import { UniversityAdminRepository } from '../../university_admin/university_admin.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { LoginDto } from '../dtos/login.dto';

export type JwtPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly studentRepository: StudentRepository,
    private readonly universityAdminRepository: UniversityAdminRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly employerRepository: EmployerRepository,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      return null;
    }

    const roleRecord = await this.getRoleRecord(user.role, user.userId);
    if (!roleRecord || !('password' in roleRecord)) {
      return null;
    }

    const isValid = await Hasher.verify((roleRecord as { password: string }).password, dto.password);
    if (!isValid) {
      return null;
    }

    const payload: JwtPayload = {
      userId: user.userId,
      role: user.role,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async attachUserFromPayload(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token: user not found');
    }

    const roleRecord = await this.getRoleRecord(user.role, user.userId);
    if (!roleRecord) {
      throw new UnauthorizedException('Invalid token: role record not found');
    }

    const { password: _, ...safeRoleRecord } = roleRecord as { password?: string };

    return {
      userId: user.userId,
      role: user.role,
      email: user.email,
      isActive: user.isActive,
      profile: safeRoleRecord,
    };
  }

  private async getRoleRecord(role: UserRole, userId: string) {
    switch (role) {
      case 'student':
        return this.studentRepository.findByUserId(userId);
      case 'teacher':
        return this.teacherRepository.findByUserId(userId);
      case 'university_admin':
        return this.universityAdminRepository.findByUserId(userId);
      case 'employer':
        return this.employerRepository.findById(userId);
      case 'super_admin':
        return null;
      default:
        throw new Error(`Unhandled role: ${role as string}`);
    }
  }
}
