import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TeacherRepository } from './teacher.repository';

@Module({
  imports: [DatabaseModule],
  providers: [TeacherRepository],
  exports: [TeacherRepository],
})
export class TeacherModule {}
