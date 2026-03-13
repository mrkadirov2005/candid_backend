import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../../user';
import { StudentController } from '../controllers/student.controller';
import { StudentRepository } from '../repositories/student.repository';
import { StudentService } from '../services/student.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StudentController],
  providers: [StudentRepository, StudentService],
  exports: [StudentRepository, StudentService],
})
export class StudentModule {}
