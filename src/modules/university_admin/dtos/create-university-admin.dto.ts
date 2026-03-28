import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateUniversityAdminDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsUUID('4')
  universityId?: string;

  @IsUUID('4')
  @IsOptional()
  userId?: string;

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
