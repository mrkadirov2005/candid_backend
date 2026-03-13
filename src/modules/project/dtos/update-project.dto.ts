import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateProjectDto {
  @IsUUID('4')
  id!: string;

  @IsString()
  @MaxLength(160)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4')
  @IsOptional()
  studentId?: string;

  @IsUUID('4')
  @IsOptional()
  teacherId?: string;

  @IsUUID('4')
  @IsOptional()
  universityId?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
