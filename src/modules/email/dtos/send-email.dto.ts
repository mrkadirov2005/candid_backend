import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  html!: string;

  @IsString()
  @IsOptional()
  @MaxLength(180)
  subject?: string;
}
