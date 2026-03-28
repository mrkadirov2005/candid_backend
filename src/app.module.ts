import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from '#/shared/configs';
import { AuthModule } from './modules/auth';
import { DatabaseModule } from './modules/database/database.module';
import { EmployerModule } from './modules/employer';
import { EmailModule } from './modules/email';
import { MessageModule } from './modules/message';
import { HealthModule } from './modules/health/health.module';
import { JointTablesModule } from './modules/joint_tables';
import { ProjectModule } from './modules/project';
import { RecommendationModule } from './modules/recommendation';
import { SkillModule } from './modules/skill';
import { StudentModule } from './modules/student';
import { TeacherModule } from './modules/teacher';
import { UniversityModule } from './modules/university';
import { UniversityAdminModule } from './modules/university_admin';
import { UserModule } from './modules/user';
import { VacancyModule } from './modules/vacancy';

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
    UserModule,
    UniversityModule,
    VacancyModule,
    SkillModule,
    ProjectModule,
    EmployerModule,
    JointTablesModule,
    TeacherModule,
    AuthModule,
    RecommendationModule,
    EmailModule,
    MessageModule,
  ],
})
export class AppModule {}
