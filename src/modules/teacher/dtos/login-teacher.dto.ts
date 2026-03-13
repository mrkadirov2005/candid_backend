import { IsString, IsUUID, MaxLength } from 'class-validator';

export class LoginTeacherDto {
  @IsUUID('4')
  userId!: string;

  @IsString()
  @MaxLength(200)
  password!: string;
}
