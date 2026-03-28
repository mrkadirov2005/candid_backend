import { IsString } from 'class-validator';

export class VerifyRecommendationDto {
  @IsString()
  token!: string;
}
