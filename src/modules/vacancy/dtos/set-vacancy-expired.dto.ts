import { IsUUID } from 'class-validator';

export class SetVacancyExpiredDto {
  @IsUUID('4')
  id!: string;
}
