import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hasher } from '#/shared/lib/hasher';
import { type UserRole } from '#/shared/types/repository';
import { EmployerRepository } from '../../employer/repositories/employer.repository';
import { StudentService } from '../../student/services/student.service';
import { StudentRepository } from '../../student/repositories/student.repository';
import { TeacherRepository } from '../../teacher/repository/teacher.repository';
import { UniversityAdminRepository } from '../../university_admin/repositories/university_admin.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateStudentDto } from '../../student/dtos/create-student.dto';
import { LoginDto } from '../dtos/login.dto';
import { SendInviteDto } from '../dtos/send-invite.dto';
import { EmailService } from '../../email/services/email.service';
import { ConfigService } from '@nestjs/config';
import { type EnvConfig } from '#/shared/configs';
import { GetInviteHtml } from '#/modules/email/templates/invite.html';

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
    private readonly studentService: StudentService,
    private readonly universityAdminRepository: UniversityAdminRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly employerRepository: EmployerRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) { }

  async sendInvite(dto: SendInviteDto) {

    const user = await this.userRepository.findByEmail(dto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const createdUser = await this.userRepository.create({
      email: dto.email,
      role: dto.role,

    });

    const payload = {
      email: dto.email,
      role: dto.role,
      userId: createdUser.userId,
      universityId: dto.universityId,
      adminId: dto.adminId
    };
    // first of all we have to create a user with in the users table and then send the user_id in the frontend also

    const token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    const frontendUrl = this.configService.get('FRONTEND_BASE_URL', { infer: true });
    const inviteLink = `${frontendUrl}/auth/accept_invite?token=${token}`;

    const htmlContent = GetInviteHtml(dto, inviteLink);

    const result = await this.emailService.sendEmail({
      email: dto.email,
      subject: 'Platform Invitation',
      html: htmlContent,
    });

    if (!result.success) {
      throw new BadRequestException('Failed to send invitation email');
    }

    return { success: true, message: 'Invitation sent successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      userId: user.userId,
      role: user.role,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, role: user.role, email: user.email };
  }

  async registerStudent(dto: CreateStudentDto) {
    const created = await this.studentService.create(dto);
    if (!created) {
      throw new BadRequestException('Unable to register student');
    }
    return created;
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
