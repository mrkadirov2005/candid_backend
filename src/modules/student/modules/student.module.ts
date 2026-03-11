import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StudentRepository } from '../repositories/student.repository';
import { StudentService } from '../services/student.service';
import { StudentController } from '../controllers/student.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [StudentController],
  providers: [StudentRepository, StudentService],
  exports: [StudentRepository, StudentService],
})
export class StudentModule {}
