import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  description!: string;

  @IsUUID('4')
  studentId!: string;

  @IsUUID('4')
  teacherId!: string;

  @IsUUID('4')
  universityId!: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
