import { IsUUID } from 'class-validator';

export class SetProjectFlagDto {
  @IsUUID('4')
  id!: string;
}
