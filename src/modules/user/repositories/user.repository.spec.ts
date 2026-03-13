import type { DatabaseService } from '../../database/database.service';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  const makeDbMock = () => {
    type ExecReturn = Promise<unknown>;

    // INSERT chain
    const insertReturning: jest.Mock<Promise<unknown[]>, []> = jest.fn();
    const insertValues = jest.fn(() => ({ returning: insertReturning }));
    const insert = jest.fn(() => ({ values: insertValues }));

    // SELECT chain
    const selectExec: jest.Mock<ExecReturn, []> = jest.fn();
    const selectWhere = jest.fn(() => ({
      limit: jest.fn((): ExecReturn => selectExec()),
    }));
    const selectFrom = jest.fn(() => ({
      where: selectWhere,
    }));
    const select = jest.fn(() => ({ from: selectFrom }));

    // UPDATE chain
    const updateReturning: jest.Mock<Promise<unknown[]>, []> = jest.fn();
    const updateWhere = jest.fn(() => ({ returning: updateReturning }));
    const updateSet = jest.fn(() => ({ where: updateWhere }));
    const update = jest.fn(() => ({ set: updateSet }));

    return {
      insert,
      insertValues,
      insertReturning,

      select,
      selectFrom,
      selectWhere,
      selectExec,

      update,
      updateSet,
      updateWhere,
      updateReturning,
    };
  };

  const makeRepo = (dbMock: ReturnType<typeof makeDbMock>) => {
    const databaseServiceMock = {
      db: {
        insert: dbMock.insert,
        select: dbMock.select,
        update: dbMock.update,
      },
    };
    return new UserRepository(databaseServiceMock as unknown as DatabaseService);
  };

  const sampleRow = {
    userId: '11111111-1111-1111-1111-111111111111',
    role: 'student',
    refreshToken: 'rt-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    isActive: true,
  };

  it('create: returns inserted row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.insertReturning.mockResolvedValueOnce([sampleRow]);

    const result = await repo.create({
      role: 'student',
      refreshToken: 'rt-1',
      isActive: true,
    });

    expect(result).toEqual(sampleRow);
  });

  it('create: returns null when returning is empty', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.insertReturning.mockResolvedValueOnce([]);

    const result = await repo.create({
      role: 'student',
    });

    expect(result).toBeNull();
  });

  it('findById: returns row when found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.selectExec.mockResolvedValueOnce([sampleRow]);

    const result = await repo.findById(sampleRow.userId);

    expect(result).toEqual(sampleRow);
  });

  it('findById: returns null when not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.selectExec.mockResolvedValueOnce([]);

    const result = await repo.findById('nonexistent-id');

    expect(result).toBeNull();
  });

  it('updateRefreshToken: returns updated row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    const updatedRow = { ...sampleRow, refreshToken: 'rt-2' };
    dbMock.updateReturning.mockResolvedValueOnce([updatedRow]);

    const result = await repo.updateRefreshToken(sampleRow.userId, 'rt-2');

    expect(result).toEqual(updatedRow);
  });

  it('updateRefreshToken: returns null when user not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.updateReturning.mockResolvedValueOnce([]);

    const result = await repo.updateRefreshToken('nonexistent-id', 'rt-2');

    expect(result).toBeNull();
  });

  it('setActive: returns updated row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    const updatedRow = { ...sampleRow, isActive: false };
    dbMock.updateReturning.mockResolvedValueOnce([updatedRow]);

    const result = await repo.setActive(sampleRow.userId, false);

    expect(result).toEqual(updatedRow);
  });

  it('setActive: returns null when user not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.updateReturning.mockResolvedValueOnce([]);

    const result = await repo.setActive('nonexistent-id', false);

    expect(result).toBeNull();
  });
});
