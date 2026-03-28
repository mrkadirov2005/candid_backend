import type { DatabaseService } from '../../database/database.service';
import {
  type CreateTeacherInput,
  type ListTeachersParams,
  type Teacher,
  TeacherRepository,
  type UpdateTeacherInput,
} from './teacher.repository';

describe('TeacherRepository', () => {
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
    return new TeacherRepository(databaseServiceMock as unknown as DatabaseService);
  };

  it('creates a teacher', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const input: CreateTeacherInput = {
      userId: 'user-1',
      universityId: 'uni-1',
      specialty: 'Math',
      password: 'hashed-pass',
      email: 'teacher@example.com'
    };

    const row: Teacher = {
      teacherId: 'teacher-1',
      userId: input.userId,
      universityId: input.universityId,
      isVerified: false,
      specialty: input.specialty ?? null,
      password: input.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.insertReturning.mockResolvedValueOnce([row]);

    const result = await repository.create(input);

    expect(result).toEqual(row);
  });

  it('returns undefined when create did not insert a row', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const input: CreateTeacherInput = {
      userId: 'user-1',
      universityId: 'uni-1',
      password: 'hashed-pass',
      email: 'teacher@example.com'
    };

    dbMock.insertReturning.mockResolvedValueOnce([]);

    const result = await repository.create(input);

    expect(result).toBeUndefined();
  });

  it('finds a teacher by id when it exists', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const teacherId = 'teacher-1';

    const row: Teacher = {
      teacherId,
      userId: 'user-1',
      universityId: 'uni-1',
      isVerified: true,
      specialty: 'Physics',
      password: 'hashed-pass',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.selectExec.mockResolvedValueOnce([row]);

    const result = await repository.findById(teacherId);

    expect(result).toEqual(row);
  });

  it('returns undefined when teacher is not found by id', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    dbMock.selectExec.mockResolvedValueOnce([]);

    const result = await repository.findById('missing-id');

    expect(result).toBeUndefined();
  });

  it('lists teachers with default pagination', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const rows: Teacher[] = [
      {
        teacherId: 't1',
        userId: 'u1',
        universityId: 'uni1',
        isVerified: false,
        specialty: null,
        password: 'p1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        teacherId: 't2',
        userId: 'u2',
        universityId: 'uni2',
        isVerified: true,
        specialty: 'Math',
        password: 'p2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    dbMock.selectExec.mockResolvedValueOnce(rows);

    const params: ListTeachersParams = {};
    const result = await repository.list(params);

    expect(result).toEqual(rows);
  });

  it('lists teachers with custom pagination', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    dbMock.selectExec.mockResolvedValueOnce([]);

    const params: ListTeachersParams = { limit: 10, offset: 5 };
    const result = await repository.list(params);
    expect(result).toEqual([]);
  });

  it('updates a teacher and returns updated entity when both fields provided', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const teacherId = 'teacher-1';
    const input: UpdateTeacherInput = {
      isVerified: true,
      specialty: 'Computer Science',
    };

    const row: Teacher = {
      teacherId,
      userId: 'user-1',
      universityId: 'uni-1',
      isVerified: true,
      specialty: 'Computer Science',
      password: 'hashed-pass',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.updateReturning.mockResolvedValueOnce([row]);

    const result = await repository.update(teacherId, input);

    expect(result).toEqual(row);
  });

  it('returns undefined when updating non-existing teacher', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const teacherId = 'missing-id';
    const input: UpdateTeacherInput = {
      isVerified: true,
    };

    dbMock.updateReturning.mockResolvedValueOnce([]);

    const result = await repository.update(teacherId, input);

    expect(result).toBeUndefined();
  });

  it('falls back to findById when no update fields are provided', async () => {
    const dbMock = makeDbMock();
    const repository = makeRepo(dbMock);

    const teacherId = 'teacher-1';

    const row: Teacher = {
      teacherId,
      userId: 'user-1',
      universityId: 'uni-1',
      isVerified: false,
      specialty: null,
      password: 'hashed-pass',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dbMock.selectExec.mockResolvedValueOnce([row]);

    const result = await repository.update(teacherId, {});

    expect(result).toEqual(row);
  });
});
