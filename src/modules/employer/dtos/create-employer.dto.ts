import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateEmployerDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsEmail()
  @MaxLength(180)
  email!: string;

  @IsString()
  @MaxLength(180)
  company!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
