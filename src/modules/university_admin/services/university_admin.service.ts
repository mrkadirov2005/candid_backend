import { Injectable } from '@nestjs/common';
import { Hasher } from '#/shared/lib/hasher';
import { DatabaseService } from '../../database/database.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateUniversityAdminDto } from '../dtos/create-university-admin.dto';
import { LoginUniversityAdminDto } from '../dtos/login-university-admin.dto';
import { UpdateUniversityAdminDto } from '../dtos/update-university-admin.dto';
import { UniversityAdminRepository } from '../repositories/university_admin.repository';

@Injectable()
export class UniversityAdminService {
  constructor(
    private readonly universityAdminRepository: UniversityAdminRepository,
    private readonly userRepository: UserRepository,
    private readonly databaseService: DatabaseService,
  ) { }

  async create(dto: CreateUniversityAdminDto) {
    const hashedPassword = await Hasher.hash(dto.password);
    return this.databaseService.db.transaction(async (tx) => {
      // register the user in university_admin table
      const isCreated = await this.universityAdminRepository.create(
        {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          universityId: dto.universityId,
          userId: dto.userId,
        },
        tx
      );
      return isCreated;
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
    const admin = await this.universityAdminRepository.findByEmail(dto.email);
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
