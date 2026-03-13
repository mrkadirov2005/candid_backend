import { IsDateString, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { VacancyMode, VacancyType } from '../models/vacancy.model';

export class CreateVacancyDto {
  @IsUUID('4')
  employerId!: string;

  @IsString()
  description!: string;

  @IsString()
  company!: string;

  @IsString()
  location!: string;

  @IsEnum(VacancyMode)
  mode!: VacancyMode;

  @IsEnum(VacancyType)
  type!: VacancyType;

  @IsNumber()
  salary!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
