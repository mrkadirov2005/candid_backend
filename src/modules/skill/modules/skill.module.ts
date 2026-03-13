import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SkillController } from '../controllers/skill.controller';
import { SkillRepository } from '../repositories/skill.repository';
import { SkillService } from '../services/skill.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SkillController],
  providers: [SkillRepository, SkillService],
  exports: [SkillRepository, SkillService],
})
export class SkillModule {}
