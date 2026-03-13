import { Injectable } from '@nestjs/common';
import { CreateUniversityDto } from '../dtos/create-university.dto';
import { UpdateUniversityDto } from '../dtos/update-university.dto';
import { UniversityRepository } from '../repositories/university.repository';

@Injectable()
export class UniversityService {
  constructor(private readonly universityRepository: UniversityRepository) {}

  async create(dto: CreateUniversityDto) {
    return this.universityRepository.create(dto);
  }

  async findById(id: string) {
    return this.universityRepository.findById(id);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.universityRepository.list(params);
  }

  async listAll() {
    return this.universityRepository.listAll();
  }

  async update(id: string, dto: UpdateUniversityDto) {
    return this.universityRepository.update(id, dto);
  }

  async activate(id: string) {
    return this.universityRepository.setActive(id, true);
  }

  async deactivate(id: string) {
    return this.universityRepository.setActive(id, false);
  }
}
