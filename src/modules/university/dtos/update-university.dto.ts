import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateUniversityDto {
  @IsString()
  @MaxLength(160)
  @IsOptional()
  name?: string;

  @IsUUID('4')
  @IsOptional()
  adminId?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
