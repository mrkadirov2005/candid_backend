import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type EnvConfig } from '#/shared/configs';
import { AuthConfig } from '#/shared/configs/auth.config';
import { type JwtPayload } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthConfig.AuthTokenStrategyKey) {
  constructor(configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AUTH_JWT_ACCESS_SECRET', { infer: true }),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
