import { IsBoolean, IsUUID } from 'class-validator';

export class SetMessageDeletedDto {
  @IsUUID('4')
  id!: string;

  @IsBoolean()
  isDeleted!: boolean;
}
