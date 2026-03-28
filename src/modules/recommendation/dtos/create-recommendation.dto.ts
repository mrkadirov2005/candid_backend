import { IsUUID } from 'class-validator';

export class CreateRecommendationDto {
  @IsUUID('4')
  studentId!: string;

  @IsUUID('4')
  universityId!: string;

  @IsUUID('4')
  universityAdminId!: string;

  @IsUUID('4')
  teacherId!: string;
}
