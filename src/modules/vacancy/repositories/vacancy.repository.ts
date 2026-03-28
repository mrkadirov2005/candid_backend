import { Injectable } from '@nestjs/common';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { VacancyModel } from '../models/vacancy.model';

@Injectable()
export class VacancyRepository {
  private readonly vacancyModel: typeof VacancyModel = VacancyModel;

  async create(input: REPOSITORY_TYPE.CreateVacancyInput) {
    const row = await this.vacancyModel.create({
      employerId: input.employerId,
      description: input.description,
      company: input.company,
      location: input.location,
      mode: input.mode,
      type: input.type,
      salary: input.salary,
      isExpired: input.isExpired ?? false,
      startDate: input.startDate,
      endDate: input.endDate,
    });

    return row ?? null;
  }

  async findById(id: string) {
    const row = await this.vacancyModel.findByPk(id);
    return row ?? null;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.vacancyModel.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return rows;
  }

  async listAll() {
    const rows = await this.vacancyModel.findAll();
    return rows;
  }

  async update(id: string, input: REPOSITORY_TYPE.UpdateVacancyInput) {
    const [_, rows] = await this.vacancyModel.update(input, {
      where: { id },
      returning: true,
    });

    return rows?.[0] ?? null;
  }

  async setExpired(id: string, isExpired: boolean) {
    const [_, rows] = await this.vacancyModel.update(
      { isExpired },
      {
        where: { id },
        returning: true,
      },
    );

    return rows?.[0] ?? null;
  }
}
