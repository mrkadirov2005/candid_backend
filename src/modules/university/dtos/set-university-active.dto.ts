import { IsUUID } from 'class-validator';

export class SetUniversityActiveDto {
  @IsUUID('4')
  id!: string;
}
