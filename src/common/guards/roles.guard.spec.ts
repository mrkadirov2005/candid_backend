import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { DatabaseService } from '#/modules/database/database.service';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const createMockReflector = (metadata: unknown) => ({
    getAllAndOverride: jest.fn().mockReturnValue(metadata),
  });

  const createMockDbService = (rows: unknown[] = []) => ({
    db: {
      execute: jest.fn().mockResolvedValue({ rows }),
    },
  });

  const createMockContext = (user?: { userId: string; role: string }): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as unknown as ExecutionContext;

  it('should allow access when no roles metadata is set', async () => {
    const reflector = createMockReflector(undefined);
    const dbService = createMockDbService();
    const guard = new RolesGuard(
      reflector as unknown as Reflector,
      dbService as unknown as DatabaseService,
    );

    const result = await guard.canActivate(createMockContext());
    expect(result).toBe(true);
  });

  it('should deny access when user has no role', async () => {
    const reflector = createMockReflector({ table: 'student', roles: ['student'] });
    const dbService = createMockDbService();
    const guard = new RolesGuard(
      reflector as unknown as Reflector,
      dbService as unknown as DatabaseService,
    );

    await expect(guard.canActivate(createMockContext())).rejects.toThrow(ForbiddenException);
  });

  it('should deny access when user role does not match required roles', async () => {
    const reflector = createMockReflector({ table: 'student', roles: ['admin'] });
    const dbService = createMockDbService();
    const guard = new RolesGuard(
      reflector as unknown as Reflector,
      dbService as unknown as DatabaseService,
    );

    const context = createMockContext({ userId: 'test-id', role: 'student' });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should deny access when user is not found in database table', async () => {
    const reflector = createMockReflector({ table: 'student', roles: ['student'] });
    const dbService = createMockDbService([]);
    const guard = new RolesGuard(
      reflector as unknown as Reflector,
      dbService as unknown as DatabaseService,
    );

    const context = createMockContext({ userId: 'test-id', role: 'student' });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow access when role matches and user exists in table', async () => {
    const reflector = createMockReflector({ table: 'student', roles: ['student'] });
    const dbService = createMockDbService([{ '?column?': 1 }]);
    const guard = new RolesGuard(
      reflector as unknown as Reflector,
      dbService as unknown as DatabaseService,
    );

    const context = createMockContext({ userId: 'test-id', role: 'student' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(dbService.db.execute).toHaveBeenCalled();
  });

  it('should deny access for invalid table name', async () => {
    const reflector = createMockReflector({ table: 'malicious_table', roles: ['student'] });
    const dbService = createMockDbService();
    const guard = new RolesGuard(
      reflector as unknown as Reflector,
      dbService as unknown as DatabaseService,
    );

    const context = createMockContext({ userId: 'test-id', role: 'student' });
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    expect(dbService.db.execute).not.toHaveBeenCalled();
  });
});
