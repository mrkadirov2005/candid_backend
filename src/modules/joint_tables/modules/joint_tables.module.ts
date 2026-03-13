import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployerModule } from '../../employer';
import { ProjectModule } from '../../project';
import { SkillModule } from '../../skill';
import { StudentModule } from '../../student';
import { VacancyModule } from '../../vacancy';
import { JointSkillsController } from '../controllers/joint_skills.controller';
import { JointSkillsRepository } from '../repositories/joint_skills.repository';
import { JointSkillsService } from '../services/joint_skills.service';

@Module({
  imports: [DatabaseModule, SkillModule, StudentModule, VacancyModule, ProjectModule, EmployerModule],
  controllers: [JointSkillsController],
  providers: [JointSkillsRepository, JointSkillsService],
})
export class JointTablesModule {}
