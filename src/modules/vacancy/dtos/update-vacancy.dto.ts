import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { VacancyMode, VacancyType } from '../models/vacancy.model';

export class UpdateVacancyDto {
  @IsUUID('4')
  @IsOptional()
  employerId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(VacancyMode)
  @IsOptional()
  mode?: VacancyMode;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(VacancyType)
  @IsOptional()
  type?: VacancyType;

  @IsNumber()
  @IsOptional()
  salary?: number;
}
