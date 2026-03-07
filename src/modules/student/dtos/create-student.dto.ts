import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStudentDto {
  @IsUUID('4')
    userId!: string;

  @IsUUID('4')
  universityId!: string;

  @IsUUID('4')
  @IsOptional()
  adminId?: string;

  @IsString()
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MaxLength(50)
  lastName!: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
