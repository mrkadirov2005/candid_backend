import { IsString, IsUUID, MaxLength } from 'class-validator';

export class LoginUniversityAdminDto {
  @IsString()
  email!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
