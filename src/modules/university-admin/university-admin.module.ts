import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UniversityAdminRepository } from './university-admin.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UniversityAdminRepository],
  exports: [UniversityAdminRepository],
})
export class UniversityAdminModule {}
