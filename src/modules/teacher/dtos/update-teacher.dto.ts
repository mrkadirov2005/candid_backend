import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateTeacherDto {
  @IsUUID('4')
  id!: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsString()
  @MaxLength(160)
  @IsOptional()
  specialty?: string | null;
}
