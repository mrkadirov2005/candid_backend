import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginEmployerDto {
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
