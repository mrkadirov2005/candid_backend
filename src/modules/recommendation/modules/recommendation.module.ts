import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RecommendationController } from '../controllers/recommendation.controller';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { RecommendationService } from '../services/recommendation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RecommendationController],
  providers: [RecommendationRepository, RecommendationService],
  exports: [RecommendationRepository, RecommendationService],
})
export class RecommendationModule {}
