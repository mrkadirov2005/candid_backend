import type { CallHandler, ExecutionContext } from '@nestjs/common';
import * as fs from 'fs';
import { lastValueFrom, of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
  })),
}));

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  const mockRequest = {
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

  const getWriteMocks = (): [jest.Mock, jest.Mock] => {
    const createWriteStreamMock = fs.createWriteStream as unknown as jest.Mock;

    const requestWrite = createWriteStreamMock.mock.results[0].value.write as jest.Mock;

    const responseWrite = createWriteStreamMock.mock.results[1].value.write as jest.Mock;

    return [requestWrite, responseWrite];
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.headers = {};
    interceptor = new LoggingInterceptor();
  });

  it('should attach X-Request-Id header to response', async () => {
    const context = createMockContext();
    const next: CallHandler = { handle: () => of(null) };

    await lastValueFrom(interceptor.intercept(context, next));

    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
  });

  it('should log incoming request', async () => {
    const context = createMockContext();
    const next: CallHandler = { handle: () => of(null) };

    await lastValueFrom(interceptor.intercept(context, next));

    const [requestWrite] = getWriteMocks();
    const log = JSON.parse(requestWrite.mock.calls[0][0] as string);

    expect(log).toMatchObject({
      method: 'GET',
      path: '/test',
      request_id: expect.any(String),
    });
  });

  it('should log successful response', async () => {
    const context = createMockContext();
    const next: CallHandler = { handle: () => of({ ok: true }) };

    await lastValueFrom(interceptor.intercept(context, next));

    const [, responseWrite] = getWriteMocks();
    const log = JSON.parse(responseWrite.mock.calls[0][0] as string);

    expect(log).toMatchObject({
      status: 'success',
      statusCode: 200,
    });
  });

  it('should log failed response', async () => {
    const context = createMockContext();

    const next: CallHandler = {
      handle: () => throwError(() => ({ status: 400, message: 'Bad Request' })),
    };

    await expect(lastValueFrom(interceptor.intercept(context, next))).rejects.toBeDefined();

    const [, responseWrite] = getWriteMocks();
    const log = JSON.parse(responseWrite.mock.calls[0][0] as string);

    expect(log).toMatchObject({
      status: 'fail',
      statusCode: 400,
    });
  });
});
