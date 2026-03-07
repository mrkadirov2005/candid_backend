import { of, throwError } from 'rxjs';
import type { CallHandler, ExecutionContext } from '@nestjs/common';

const mockWrite = jest.fn();

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn().mockReturnValue({ write: mockWrite }),
}));

import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  const mockRequest: { method: string; url: string; headers: Record<string, string> } = {
    method: 'GET',
    url: '/test',
    headers: {},
  };

  const mockResponse = {
    statusCode: 200,
    setHeader: jest.fn(),
  };

  const createMockContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    mockWrite.mockClear();
    mockResponse.setHeader.mockClear();
    mockRequest.headers = {};
    interceptor = new LoggingInterceptor();
  });

  it('should attach X-Request-Id header to response', (done) => {
    const context = createMockContext();
    const next: CallHandler = { handle: () => of(null) };

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
        done();
      },
    });
  });

  it('should reuse existing X-Request-Id from request headers', (done) => {
    const existingId = '11111111-1111-1111-1111-111111111111';
    mockRequest.headers = { 'x-request-id': existingId };
    const context = createMockContext();
    const next: CallHandler = { handle: () => of(null) };

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-Id', existingId);
        done();
      },
    });
  });

  it('should log incoming request to request log file', (done) => {
    const context = createMockContext();
    const next: CallHandler = { handle: () => of(null) };

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        const requestLogCall = mockWrite.mock.calls[0][0] as string;
        const parsed = JSON.parse(requestLogCall.trim());
        expect(parsed).toMatchObject({
          method: 'GET',
          path: '/test',
          request_id: expect.any(String),
        });
        done();
      },
    });
  });

  it('should log successful response to response log file', (done) => {
    const context = createMockContext();
    const next: CallHandler = { handle: () => of({ data: 'ok' }) };

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        const responseLogCall = mockWrite.mock.calls[1][0] as string;
        const parsed = JSON.parse(responseLogCall.trim());
        expect(parsed).toMatchObject({
          method: 'GET',
          path: '/test',
          statusCode: 200,
          status: 'success',
          request_id: expect.any(String),
          duration_ms: expect.any(Number),
          end_time: expect.any(String),
        });
        done();
      },
    });
  });

  it('should log failed response to response log file', (done) => {
    const context = createMockContext();
    const error = { status: 400, message: 'Bad Request' };
    const next: CallHandler = { handle: () => throwError(() => error) };

    interceptor.intercept(context, next).subscribe({
      error: () => {
        const responseLogCall = mockWrite.mock.calls[1][0] as string;
        const parsed = JSON.parse(responseLogCall.trim());
        expect(parsed).toMatchObject({
          method: 'GET',
          path: '/test',
          statusCode: 400,
          status: 'fail',
          error: 'Bad Request',
          request_id: expect.any(String),
          duration_ms: expect.any(Number),
          end_time: expect.any(String),
        });
        done();
      },
    });
  });
});
