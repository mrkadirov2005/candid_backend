import { IsEmail, IsIn, IsString } from 'class-validator';
import { USER_ROLES, type UserRole } from '#/shared/types/repository';

export class SendInviteDto {
  @IsEmail()
  email!: string;

  @IsIn(USER_ROLES)
  role!: UserRole;

  @IsString()
  universityId?: String

  @IsString()
  adminId?: string


}
