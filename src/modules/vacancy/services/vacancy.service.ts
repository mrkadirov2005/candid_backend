import { Injectable } from '@nestjs/common';
import { CreateVacancyDto } from '../dtos/create-vacancy.dto';
import { UpdateVacancyDto } from '../dtos/update-vacancy.dto';
import { VacancyRepository } from '../repositories/vacancy.repository';

@Injectable()
export class VacancyService {
  constructor(private readonly vacancyRepository: VacancyRepository) {}

  async create(dto: CreateVacancyDto) {
    return this.vacancyRepository.create(dto);
  }

  async findById(id: string) {
    return this.vacancyRepository.findById(id);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.vacancyRepository.list(params);
  }

  async listAll() {
    return this.vacancyRepository.listAll();
  }

  async update(id: string, dto: UpdateVacancyDto) {
    return this.vacancyRepository.update(id, dto);
  }

  async activate(id: string) {
    return this.vacancyRepository.setExpired(id, false);
  }

  async deactivate(id: string) {
    return this.vacancyRepository.setExpired(id, true);
  }
}
