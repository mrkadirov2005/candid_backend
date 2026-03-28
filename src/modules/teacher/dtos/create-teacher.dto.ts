import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTeacherDto {
  @IsUUID('4')
  universityId!: string;

  @IsString()
  @MaxLength(100)
  name!: string;

  @IsUUID('4')
  @IsOptional()
  userId?: string;

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsString()
  @MaxLength(160)
  @IsOptional()
  specialty?: string | null;

  @IsString()
  @MaxLength(200)
  password!: string;
}
