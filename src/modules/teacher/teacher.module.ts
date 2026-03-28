import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user';
import { TeacherController } from './controllers/teacher.controller';
import { TeacherService } from './services/teacher.service';
import { TeacherRepository } from './repository/teacher.repository';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [TeacherController],
  providers: [TeacherRepository, TeacherService],
  exports: [TeacherRepository, TeacherService],
})
export class TeacherModule {}
