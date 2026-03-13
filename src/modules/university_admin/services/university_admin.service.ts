import { Injectable } from '@nestjs/common';
import { Hasher } from '#/shared/lib/hasher';
import { DatabaseService } from '../../database/database.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateUniversityAdminDto } from '../dtos/create-university-admin.dto';
import { LoginUniversityAdminDto } from '../dtos/login-university-admin.dto';
import { UpdateUniversityAdminDto } from '../dtos/update-university-admin.dto';
import { UniversityAdminRepository } from '../university_admin.repository';

@Injectable()
export class UniversityAdminService {
  constructor(
    private readonly universityAdminRepository: UniversityAdminRepository,
    private readonly userRepository: UserRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(dto: CreateUniversityAdminDto) {
    const hashedPassword = await Hasher.hash(dto.password);
    return this.databaseService.db.transaction(async (tx) => {
      let userId = dto.userId;

      if (userId) {
        const existing = await this.userRepository.findById(userId, tx);
        if (existing) {
          if (existing.role !== 'university_admin') {
            return null;
          }
        } else {
          const created = await this.userRepository.create({ userId, role: 'university_admin', email: dto.email }, tx);
          if (!created) {
            return null;
          }
        }
      } else {
        const created = await this.userRepository.create({ role: 'university_admin', email: dto.email }, tx);
        if (!created) {
          return null;
        }
        userId = created.userId;
      }

      return this.universityAdminRepository.create(
        {
          userId,
          universityId: dto.universityId,
          password: hashedPassword,
        },
        tx,
      );
    });
  }

  async findById(adminId: string) {
    return this.universityAdminRepository.findById(adminId);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.universityAdminRepository.list(params);
  }

  async update(dto: UpdateUniversityAdminDto) {
    const { adminId, ...payload } = dto;
    return this.universityAdminRepository.update(adminId, payload);
  }

  async login(dto: LoginUniversityAdminDto) {
    const admin = await this.universityAdminRepository.findByUserId(dto.userId);
    if (!admin) {
      return null;
    }

    const isValid = await Hasher.verify(admin.password, dto.password);
    if (!isValid) {
      return null;
    }

    return admin;
  }

  async profile(adminId: string) {
    return this.universityAdminRepository.findById(adminId);
  }
}
