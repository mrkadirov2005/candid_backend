import { IsEmail, IsString, IsUUID, MaxLength } from 'class-validator';

export class LoginTeacherDto {
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
