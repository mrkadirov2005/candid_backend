import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(dto: CreateProjectDto) {
    return this.projectRepository.create(dto);
  }

  async findById(id: string) {
    return this.projectRepository.findById(id);
  }

  async list(params?: { limit?: number; offset?: number }) {
    return this.projectRepository.list(params);
  }

  async listAll() {
    return this.projectRepository.listAll();
  }

  async update(dto: UpdateProjectDto) {
    const { id, ...payload } = dto;
    return this.projectRepository.update(id, payload);
  }

  async verify(id: string) {
    return this.projectRepository.setApproved(id, true);
  }

  async unverify(id: string) {
    return this.projectRepository.setApproved(id, false);
  }

  async requestVerify(id: string) {
    return this.projectRepository.setApproved(id, false);
  }

  async deactivate(id: string) {
    return this.projectRepository.setActive(id, false);
  }
}
