import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { USER_ROLES } from '#/shared/types/repository';

export class CreateUserDto {
  @IsIn(USER_ROLES)
  role!: (typeof USER_ROLES)[number];

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
