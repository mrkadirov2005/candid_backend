import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import * as fs from 'fs';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private requestLogStream: fs.WriteStream;
  private responseLogStream: fs.WriteStream;

  constructor() {
    const logDir = 'logs';

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    this.requestLogStream = fs.createWriteStream(`${logDir}/requests.log`, {
      flags: 'a',
    });

    this.responseLogStream = fs.createWriteStream(`${logDir}/responses.log`, {
      flags: 'a',
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();

    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const start = Date.now();

    const requestId = (request.headers['x-request-id'] as string | undefined) ?? randomUUID();

    response.setHeader('X-Request-Id', requestId);

    const requestLog = {
      method: request.method,
      path: request.url,
      request_id: requestId,
    };

    this.requestLogStream.write(`${JSON.stringify(requestLog)}\n`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        const responseLog = {
          method: request.method,
          path: request.url,
          statusCode: response.statusCode,
          status: 'success',
          request_id: requestId,
          duration_ms: duration,
          end_time: new Date().toISOString(),
        };

        this.responseLogStream.write(`${JSON.stringify(responseLog)}\n`);
      }),
      catchError((err: unknown) => {
        const duration = Date.now() - start;

        const error = err as { status?: number; message?: string };

        const responseLog = {
          method: request.method,
          path: request.url,
          statusCode: error.status ?? 500,
          status: 'fail',
          error: error.message ?? 'Unknown error',
          request_id: requestId,
          duration_ms: duration,
          end_time: new Date().toISOString(),
        };

        this.responseLogStream.write(`${JSON.stringify(responseLog)}\n`);

        return throwError(() => err);
      }),
    );
  }
}
