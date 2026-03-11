import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateStudentDto {
  @IsUUID('4')
  @IsOptional()
  universityId?: string;

  @IsUUID('4')
  @IsOptional()
  adminId?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
