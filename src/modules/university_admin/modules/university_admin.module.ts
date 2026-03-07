import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UniversityAdminRepository } from '../repositories/university_admin.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UniversityAdminRepository],
  exports: [UniversityAdminRepository],
})
export class UniversityAdminModule {}
