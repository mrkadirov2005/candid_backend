import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '#/shared/configs';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { MessageModule } from './modules/message';
import { StudentModule } from './modules/student';
import { UniversityAdminModule } from './modules/university_admin';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    HealthModule,
    UniversityAdminModule,
    StudentModule,
    MessageModule,
  ],
})
export class AppModule {}
