import { Injectable } from '@nestjs/common';
import { Hasher } from '#/shared/lib/hasher';
import { DatabaseService } from '../../database/database.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { LoginStudentDto } from '../dtos/login-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { StudentRepository } from '../repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly userRepository: UserRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(dto: CreateStudentDto) {
    const hashedPassword = await Hasher.hash(dto.password);
    return this.databaseService.db.transaction(async (tx) => {
      let userId = dto.userId;

      if (userId) {
        const existing = await this.userRepository.findById(userId, tx);
        if (existing) {
          if (existing.role !== 'student') {
            return null;
          }
        } else {
          const created = await this.userRepository.create({ userId, role: 'student', email: dto.email }, tx);
          if (!created) {
            return null;
          }
        }
      } else {
        const created = await this.userRepository.create({ role: 'student', email: dto.email }, tx);
        if (!created) {
          return null;
        }
        userId = created.userId;
      }

      return this.studentRepository.create(
        {
          ...dto,
          userId,
          password: hashedPassword,
        },
        tx,
      );
    });
  }

  async findById(studentId: string) {
    return this.studentRepository.findById(studentId);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.studentRepository.list(params);
  }

  async update(studentId: string, dto: UpdateStudentDto) {
    return this.studentRepository.update(studentId, dto);
  }

  async login(dto: LoginStudentDto) {
    const student = await this.studentRepository.findByUserId(dto.userId);
    if (!student) {
      return null;
    }

    const isValid = await Hasher.verify(student.password, dto.password);
    if (!isValid) {
      return null;
    }

    return student;
  }

  async profile(studentId: string) {
    return this.studentRepository.findById(studentId);
  }
}
