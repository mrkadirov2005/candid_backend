import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { type EnvConfig } from '#/shared/configs';
import { EmployerModule } from '../employer';
import { StudentModule } from '../student';
import { TeacherModule } from '../teacher';
import { UniversityAdminModule } from '../university_admin';
import { UserModule } from '../user';
import { AuthController } from './controllers/auth.controller';
import { AuthUserInterceptor } from './interceptors/auth-user.interceptor';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        secret: configService.get('AUTH_JWT_ACCESS_SECRET', { infer: true }),
        signOptions: {
          expiresIn: configService.get('AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN', { infer: true }),
        },
      }),
    }),
    UserModule,
    StudentModule,
    UniversityAdminModule,
    TeacherModule,
    EmployerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthUserInterceptor,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
