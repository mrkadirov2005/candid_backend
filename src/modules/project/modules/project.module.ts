import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProjectController } from '../controllers/project.controller';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectService } from '../services/project.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
  exports: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
