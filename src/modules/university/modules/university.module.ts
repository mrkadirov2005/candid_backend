import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UniversityController } from '../controllers/university.controller';
import { UniversityRepository } from '../repositories/university.repository';
import { UniversityService } from '../services/university.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UniversityController],
  providers: [UniversityRepository, UniversityService],
  exports: [UniversityRepository, UniversityService],
})
export class UniversityModule {}
