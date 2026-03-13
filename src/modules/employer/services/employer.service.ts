import { Injectable } from '@nestjs/common';
import { Hasher } from '#/shared/lib/hasher';
import { DatabaseService } from '../../database/database.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateEmployerDto } from '../dtos/create-employer.dto';
import { LoginEmployerDto } from '../dtos/login-employer.dto';
import { UpdateEmployerDto } from '../dtos/update-employer.dto';
import { EmployerRepository } from '../repositories/employer.repository';

@Injectable()
export class EmployerService {
  constructor(
    private readonly employerRepository: EmployerRepository,
    private readonly userRepository: UserRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(dto: CreateEmployerDto) {
    const password = await Hasher.hash(dto.password);
    return this.databaseService.db.transaction(async (tx) => {
      const user = await this.userRepository.create({ role: 'employer', email: dto.email }, tx);
      if (!user) {
        return null;
      }

      return this.employerRepository.create(
        {
          ...dto,
          password,
          id: user.userId,
        },
        tx,
      );
    });
  }

  async register(dto: CreateEmployerDto) {
    return this.create(dto);
  }

  async login(dto: LoginEmployerDto) {
    const employer = await this.employerRepository.findByEmail(dto.email);
    if (!employer) {
      return null;
    }

    const isValid = await Hasher.verify(employer.password, dto.password);
    if (!isValid) {
      return null;
    }

    return employer;
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.employerRepository.list(params);
  }

  async listAll() {
    return this.employerRepository.listAll();
  }

  async update(dto: UpdateEmployerDto) {
    const { id, ...payload } = dto;

    if (payload.password) {
      payload.password = await Hasher.hash(payload.password);
    }

    return this.employerRepository.update(id, payload);
  }

  async profile(id: string) {
    return this.employerRepository.findById(id);
  }

  async findById(id: string) {
    return this.employerRepository.findById(id);
  }
}
