import { IsUUID } from 'class-validator';

export class SetActiveDto {
  @IsUUID('4')
  userId!: string;
}
