import { type VacancyMode, type VacancyType } from '#/modules/vacancy/models/vacancy.model';

export type CreateVacancyInput = {
  employerId: string;
  description: string;
  company: string;
  location: string;
  mode: VacancyMode;
  type: VacancyType;
  salary: number;
  isExpired?: boolean;
  startDate: string;
  endDate: string;
};

export type UpdateVacancyInput = {
  employerId?: string;
  description?: string;
  company?: string;
  location?: string;
  mode?: VacancyMode;
  type?: VacancyType;
  salary?: number;
  isExpired?: boolean;
  startDate?: string;
  endDate?: string;
};
