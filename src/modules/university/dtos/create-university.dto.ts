import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsUUID('4')
  adminId!: string;

  @IsString()
  location!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
