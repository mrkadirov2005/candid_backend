import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user';
import { UniversityAdminController } from './controllers/universtity_admin.controller';
import { UniversityAdminService } from './services/university_admin.service';
import { UniversityAdminRepository } from './repositories/university_admin.repository';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [UniversityAdminController],
  providers: [UniversityAdminRepository, UniversityAdminService],
  exports: [UniversityAdminRepository, UniversityAdminService],
})
export class UniversityAdminModule {}
