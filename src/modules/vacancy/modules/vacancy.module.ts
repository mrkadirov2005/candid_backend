import { Module } from '@nestjs/common';
import { VacancyController } from '../controllers/vacancy.controller';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { VacancyService } from '../services/vacancy.service';

@Module({
  controllers: [VacancyController],
  providers: [VacancyRepository, VacancyService],
  exports: [VacancyRepository, VacancyService],
})
export class VacancyModule {}
