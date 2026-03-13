import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateSkillDto {
  @IsUUID('4')
  id!: string;

  @IsString()
  @MaxLength(160)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(120)
  @IsOptional()
  type?: string;
}
