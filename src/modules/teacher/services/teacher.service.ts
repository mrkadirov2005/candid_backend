import { Injectable } from '@nestjs/common';
import { Hasher } from '#/shared/lib/hasher';
import { DatabaseService } from '../../database/database.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateTeacherDto } from '../dtos/create-teacher.dto';
import { LoginTeacherDto } from '../dtos/login-teacher.dto';
import { UpdateTeacherDto } from '../dtos/update-teacher.dto';
import { TeacherRepository } from '../teacher.repository';

type CreateTeacherWithUserInput = {
  userId?: string;
  universityId: string;
  specialty?: string | null;
  password: string;
  email: string;
};

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly userRepository: UserRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(input: CreateTeacherWithUserInput) {
    const hashedPassword = await Hasher.hash(input.password);
    return this.databaseService.db.transaction(async (tx) => {
      let userId = input.userId;

      if (userId) {
        const existing = await this.userRepository.findById(userId, tx);
        if (existing) {
          if (existing.role !== 'teacher') {
            return null;
          }
        } else {
          const created = await this.userRepository.create({ userId, role: 'teacher', email: input.email }, tx);
          if (!created) {
            return null;
          }
        }
      } else {
        const created = await this.userRepository.create({ role: 'teacher', email: input.email }, tx);
        if (!created) {
          return null;
        }
        userId = created.userId;
      }

      return this.teacherRepository.create(
        {
          userId,
          universityId: input.universityId,
          specialty: input.specialty,
          password: hashedPassword,
        },
        tx,
      );
    });
  }

  async createFromDto(dto: CreateTeacherDto) {
    return this.create(dto);
  }

  async findById(teacherId: string) {
    return this.teacherRepository.findById(teacherId);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.teacherRepository.list(params);
  }

  async update(dto: UpdateTeacherDto) {
    const { id, ...payload } = dto;
    return this.teacherRepository.update(id, payload);
  }

  async login(dto: LoginTeacherDto) {
    const teacher = await this.teacherRepository.findByUserId(dto.userId);
    if (!teacher) {
      return null;
    }

    const isValid = await Hasher.verify(teacher.password, dto.password);
    if (!isValid) {
      return null;
    }

    return teacher;
  }

  async profile(teacherId: string) {
    return this.teacherRepository.findById(teacherId);
  }
}
