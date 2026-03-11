import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createWriteStream, existsSync, mkdirSync, type WriteStream } from 'fs';
import { join } from 'path';
import { Observable, tap } from 'rxjs';
import type { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly requestLogStream: WriteStream;
  private readonly responseLogStream: WriteStream;

  constructor() {
    const logsDir = join(process.cwd(), 'logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
    this.requestLogStream = createWriteStream(join(logsDir, 'requests.log'), { flags: 'a' });
    this.responseLogStream = createWriteStream(join(logsDir, 'responses.log'), { flags: 'a' });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<Response>();

    const requestId = (request.headers['x-request-id'] as string) || randomUUID();
    const startTime = Date.now();

    response.setHeader('X-Request-Id', requestId);

    const requestLog = {
      timestamp: new Date().toISOString(),
      request_id: requestId,
      method: request.method,
      path: request.url,
    };

    this.requestLogStream.write(JSON.stringify(requestLog) + '\n');
    this.logger.log(JSON.stringify(requestLog));

    return next.handle().pipe(
      tap({
        next: () => {
          const endTime = new Date().toISOString();
          const durationMs = Date.now() - startTime;
          const responseLog = {
            timestamp: endTime,
            request_id: requestId,
            method: request.method,
            path: request.url,
            statusCode: response.statusCode,
            duration_ms: durationMs,
            end_time: endTime,
            status: 'success',
          };
          this.responseLogStream.write(JSON.stringify(responseLog) + '\n');
          this.logger.log(JSON.stringify(responseLog));
        },
        error: (error: { status?: number; statusCode?: number; message?: string }) => {
          const endTime = new Date().toISOString();
          const durationMs = Date.now() - startTime;
          const responseLog = {
            timestamp: endTime,
            request_id: requestId,
            method: request.method,
            path: request.url,
            statusCode: error.status ?? error.statusCode ?? 500,
            duration_ms: durationMs,
            end_time: endTime,
            status: 'fail',
            error: error.message,
          };
          this.responseLogStream.write(JSON.stringify(responseLog) + '\n');
          this.logger.error(JSON.stringify(responseLog));
        },
      }),
    );
  }
}
