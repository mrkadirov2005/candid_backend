import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthConfig } from '#/shared/configs/auth.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthConfig.AuthTokenStrategyKey) {}
