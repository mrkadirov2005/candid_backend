import type { DatabaseService } from '../../database/database.service';
import { StudentRepository } from './student.repository';

describe('StudentRepository', () => {
  const makeDbMock = () => {
    type ExecReturn = Promise<unknown>;

    // INSERT chain
    const insertReturning: jest.Mock<Promise<unknown[]>, []> = jest.fn();
    const insertValues = jest.fn(() => ({ returning: insertReturning }));
    const insert = jest.fn(() => ({ values: insertValues }));

    // SELECT chain
    const selectExec: jest.Mock<ExecReturn, []> = jest.fn();

    const selectOffset = jest.fn((): ExecReturn => selectExec());
    const selectLimit = jest.fn(() => ({ offset: selectOffset }));
    const selectOrderBy = jest.fn(() => ({ limit: selectLimit }));

    const selectWhere = jest.fn(() => ({
      limit: jest.fn((): ExecReturn => selectExec()),
    }));

    const selectFrom = jest.fn(() => ({
      where: selectWhere,
      orderBy: selectOrderBy,
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
      selectOrderBy,
      selectLimit,
      selectOffset,
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
    return new StudentRepository(databaseServiceMock as unknown as DatabaseService);
  };

  const sampleRow = {
    studentId: '11111111-1111-1111-1111-111111111111',
    userId: '22222222-2222-2222-2222-222222222222',
    universityId: '33333333-3333-3333-3333-333333333333',
    adminId: null,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  it('create: returns inserted row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.insertReturning.mockResolvedValueOnce([sampleRow]);

    const result = await repo.create({
      userId: sampleRow.userId,
      universityId: sampleRow.universityId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });

    expect(result).toEqual(sampleRow);
  });

  it('create: returns null when returning is empty', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.insertReturning.mockResolvedValueOnce([]);

    const result = await repo.create({
      userId: sampleRow.userId,
      universityId: sampleRow.universityId,
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result).toBeUndefined();
  });

  it('findById: returns row when found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.selectExec.mockResolvedValueOnce([sampleRow]);

    const result = await repo.findById(sampleRow.studentId);

    expect(result).toEqual(sampleRow);
  });

  it('findById: returns null when not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.selectExec.mockResolvedValueOnce([]);

    const result = await repo.findById('nonexistent-id');

    expect(result).toBeUndefined();
  });

  it('list: returns rows', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.selectExec.mockResolvedValueOnce([sampleRow]);

    const result = await repo.list({ limit: 10, offset: 0 });

    expect(result).toEqual([sampleRow]);
  });

  it('list: returns empty array when no rows', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.selectExec.mockResolvedValueOnce([]);

    const result = await repo.list();

    expect(result).toEqual([]);
  });

  it('update: returns updated row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    const updatedRow = { ...sampleRow, firstName: 'Jane' };
    dbMock.updateReturning.mockResolvedValueOnce([updatedRow]);

    const result = await repo.update(sampleRow.studentId, { firstName: 'Jane' });

    expect(result).toEqual(updatedRow);
  });

  it('update: returns null when student not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);
    dbMock.updateReturning.mockResolvedValueOnce([]);

    const result = await repo.update('nonexistent-id', { firstName: 'Jane' });

    expect(result).toBeUndefined();
  });
});
