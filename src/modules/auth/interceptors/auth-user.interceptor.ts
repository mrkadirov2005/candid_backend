import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { from, type Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { user: { userId: string } | undefined }>();
    const payload = request.user;

    if (!payload) {
      return next.handle();
    }

    return from(this.authService.attachUserFromPayload(payload)).pipe(
      switchMap((user) => {
        request.user = user;
        return next.handle();
      }),
    );
  }
}
