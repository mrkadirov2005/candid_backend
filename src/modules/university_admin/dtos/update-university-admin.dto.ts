import { IsOptional, IsUUID } from 'class-validator';

export class UpdateUniversityAdminDto {
  @IsUUID('4')
  adminId!: string;

  @IsUUID('4')
  @IsOptional()
  universityId?: string;
}
