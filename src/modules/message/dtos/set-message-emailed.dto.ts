import { IsBoolean, IsUUID } from 'class-validator';

export class SetMessageEmailedDto {
  @IsUUID('4')
  id!: string;

  @IsBoolean()
  isEmailed!: boolean;
}
