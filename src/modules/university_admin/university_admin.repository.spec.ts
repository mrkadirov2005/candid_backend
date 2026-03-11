import type { DatabaseService } from '../database/database.service';
import { UniversityAdminRepository } from './university_admin.repository';

describe('UniversityAdminRepository', () => {
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

    const selectWhere = jest.fn(() => ({
      limit: jest.fn((): ExecReturn => selectExec()),
    }));

    const selectFrom = jest.fn(() => ({
      where: selectWhere,
      limit: selectLimit,
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

    return new UniversityAdminRepository(databaseServiceMock as unknown as DatabaseService);
  };

  it('create: returns inserted row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    const inserted = {
      adminId: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      universityId: '33333333-3333-3333-3333-333333333333',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.insertReturning.mockResolvedValueOnce([inserted]);

    const res = await repo.create({
      userId: inserted.userId,
      universityId: inserted.universityId,
    });

    expect(res).toEqual(inserted);
  });

  it('create: returns undefined if returning is empty', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    dbMock.insertReturning.mockResolvedValueOnce([]);

    const res = await repo.create({
      userId: '22222222-2222-2222-2222-222222222222',
      universityId: '33333333-3333-3333-3333-333333333333',
    });

    expect(res).toBeUndefined();
  });

  it('findById: returns row when found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    const row = {
      adminId: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      universityId: '33333333-3333-3333-3333-333333333333',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.selectExec.mockResolvedValueOnce([row]);

    const res = await repo.findById(row.adminId);

    expect(res).toEqual(row);
  });

  it('findById: returns undefined when not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    dbMock.selectExec.mockResolvedValueOnce([]);

    const res = await repo.findById('11111111-1111-1111-1111-111111111111');

    expect(res).toBeUndefined();
  });

  it('list: returns rows', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    const rows = [
      {
        adminId: '11111111-1111-1111-1111-111111111111',
        userId: '22222222-2222-2222-2222-222222222222',
        universityId: '33333333-3333-3333-3333-333333333333',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    dbMock.selectExec.mockResolvedValueOnce(rows);

    const res = await repo.list({ limit: 10, offset: 0 });

    expect(res).toEqual(rows);
  });

  it('update: returns updated row when found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    const updated = {
      adminId: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      universityId: '99999999-9999-9999-9999-999999999999',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.updateReturning.mockResolvedValueOnce([updated]);

    const res = await repo.update(updated.adminId, {
      universityId: updated.universityId,
    });

    expect(res).toEqual(updated);
  });

  it('update: returns undefined when not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    dbMock.updateReturning.mockResolvedValueOnce([]);

    const res = await repo.update('11111111-1111-1111-1111-111111111111', {
      universityId: '33333333-3333-3333-3333-333333333333',
    });

    expect(res).toBeUndefined();
  });
});
