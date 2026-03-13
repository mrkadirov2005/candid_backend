import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../../user';
import { EmployerController } from '../controllers/employer.controller';
import { EmployerRepository } from '../repositories/employer.repository';
import { EmployerService } from '../services/employer.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [EmployerController],
  providers: [EmployerRepository, EmployerService],
  exports: [EmployerRepository, EmployerService],
})
export class EmployerModule {}
