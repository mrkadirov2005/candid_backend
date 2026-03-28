import { IsUUID } from 'class-validator';

export class ApproveRecommendationAdminDto {
  @IsUUID('4')
  id!: string;

  @IsUUID('4')
  universityAdminId!: string;
}
