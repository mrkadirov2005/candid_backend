import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from '../dtos/create-skill.dto';
import { UpdateSkillDto } from '../dtos/update-skill.dto';
import { SkillRepository } from '../repositories/skill.repository';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async create(dto: CreateSkillDto) {
    return this.skillRepository.create(dto);
  }

  async listAll() {
    return this.skillRepository.listAll();
  }

  async findById(id: string) {
    return this.skillRepository.findById(id);
  }

  async update(dto: UpdateSkillDto) {
    const { id, ...payload } = dto;
    return this.skillRepository.update(id, payload);
  }
}
