import { IsString, IsUUID, MaxLength } from 'class-validator';

export class LoginUniversityAdminDto {
  @IsUUID('4')
  userId!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
