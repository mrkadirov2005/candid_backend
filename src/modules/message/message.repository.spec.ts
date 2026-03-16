import type { DatabaseService } from '../database/database.service';
import { MessageRepository } from './message.repository';

describe('MessageRepository', () => {
  const makeDbMock = () => {
    type ExecReturn = Promise<unknown>;

    const insertReturning: jest.Mock<Promise<unknown[]>, []> = jest.fn();
    const insertValues = jest.fn(() => ({ returning: insertReturning }));
    const insert = jest.fn(() => ({ values: insertValues }));

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

    return new MessageRepository(databaseServiceMock as unknown as DatabaseService);
  };

  it('create: returns inserted row', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    const inserted = {
      messageId: '11111111-1111-1111-1111-111111111111',
      senderUserId: '22222222-2222-2222-2222-222222222222',
      receiverUserId: '33333333-3333-3333-3333-333333333333',
      content: 'Hello',
      contextType: 'chat',
      contextId: '44444444-4444-4444-4444-444444444444',
      attachmentLinks: ['https://example.com/file1'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.insertReturning.mockResolvedValueOnce([inserted]);

    const res = await repo.create({
      senderUserId: inserted.senderUserId,
      receiverUserId: inserted.receiverUserId,
      content: inserted.content,
      contextType: inserted.contextType,
      contextId: inserted.contextId,
      attachmentLinks: inserted.attachmentLinks,
    });

    expect(res).toEqual(inserted);
  });

  it('findById: returns row when found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    const row = {
      messageId: '11111111-1111-1111-1111-111111111111',
      senderUserId: '22222222-2222-2222-2222-222222222222',
      receiverUserId: '33333333-3333-3333-3333-333333333333',
      content: 'Hello',
      contextType: 'chat',
      contextId: '44444444-4444-4444-4444-444444444444',
      attachmentLinks: ['https://example.com/file1'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.selectExec.mockResolvedValueOnce([row]);

    const res = await repo.findById(row.messageId);

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
        messageId: '11111111-1111-1111-1111-111111111111',
        senderUserId: '22222222-2222-2222-2222-222222222222',
        receiverUserId: '33333333-3333-3333-3333-333333333333',
        content: 'Hello',
        contextType: 'chat',
        contextId: '44444444-4444-4444-4444-444444444444',
        attachmentLinks: ['https://example.com/file1'],
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
      messageId: '11111111-1111-1111-1111-111111111111',
      senderUserId: '22222222-2222-2222-2222-222222222222',
      receiverUserId: '33333333-3333-3333-3333-333333333333',
      content: 'Updated content',
      contextType: 'chat',
      contextId: '44444444-4444-4444-4444-444444444444',
      attachmentLinks: ['https://example.com/file2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.updateReturning.mockResolvedValueOnce([updated]);

    const res = await repo.update(updated.messageId, {
      content: updated.content,
      contextType: updated.contextType,
      contextId: updated.contextId,
      attachmentLinks: updated.attachmentLinks,
    });

    expect(res).toEqual(updated);
  });

  it('update: returns undefined when not found', async () => {
    const dbMock = makeDbMock();
    const repo = makeRepo(dbMock);

    dbMock.updateReturning.mockResolvedValueOnce([]);

    const res = await repo.update('11111111-1111-1111-1111-111111111111', {
      content: 'Updated',
    });

    expect(res).toBeUndefined();
  });
});
