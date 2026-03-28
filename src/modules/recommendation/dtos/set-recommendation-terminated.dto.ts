import { IsBoolean, IsUUID } from 'class-validator';

export class SetRecommendationTerminatedDto {
  @IsUUID('4')
  id!: string;

  @IsBoolean()
  isTerminated!: boolean;
}
