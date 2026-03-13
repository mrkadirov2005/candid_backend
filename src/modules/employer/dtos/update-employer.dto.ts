import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateEmployerDto {
  @IsUUID('4')
  id!: string;

  @IsString()
  @MaxLength(160)
  @IsOptional()
  name?: string;

  @IsEmail()
  @MaxLength(180)
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(180)
  @IsOptional()
  company?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  password?: string;
}
