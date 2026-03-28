import { IsString, IsUUID, MaxLength } from 'class-validator';

export class ApproveRecommendationTeacherDto {
  @IsUUID('4')
  id!: string;

  @IsUUID('4')
  teacherId!: string;

  @IsString()
  @MaxLength(1000)
  content!: string;

  @IsString()
  teacherSignature!: string;
}
