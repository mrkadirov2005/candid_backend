import type { DatabaseService } from '../database/database.service';
import {
  type CreateTeacherInput,
  type ListTeachersParams,
  type Teacher,
  TeacherRepository,
  type UpdateTeacherInput,
} from './teacher.repository';

describe('TeacherRepository', () => {
  let dbExecuteMock: jest.Mock;
  let databaseServiceMock: jest.Mocked<DatabaseService>;
  let repository: TeacherRepository;

  beforeEach(() => {
    dbExecuteMock = jest.fn();

    databaseServiceMock = {
      db: {
        execute: dbExecuteMock,
      },
    } as unknown as jest.Mocked<DatabaseService>;

    repository = new TeacherRepository(databaseServiceMock);
  });

  it('creates a teacher', async () => {
    const input: CreateTeacherInput = {
      userId: 'user-1',
      universityId: 'uni-1',
      specialty: 'Math',
    };

    const row: Teacher = {
      teacher_id: 'teacher-1',
      user_id: input.userId,
      university_id: input.universityId,
      is_verified: false,
      specialty: input.specialty ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    dbExecuteMock.mockResolvedValue({ rows: [row] });

    const result = await repository.create(input);

    expect(dbExecuteMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(row);
  });

  it('returns undefined when create did not insert a row', async () => {
    const input: CreateTeacherInput = {
      userId: 'user-1',
      universityId: 'uni-1',
    };

    dbExecuteMock.mockResolvedValue({ rows: [] });

    const result = await repository.create(input);

    expect(result).toBeUndefined();
  });

  it('finds a teacher by id when it exists', async () => {
    const teacherId = 'teacher-1';

    const row: Teacher = {
      teacher_id: teacherId,
      user_id: 'user-1',
      university_id: 'uni-1',
      is_verified: true,
      specialty: 'Physics',
      created_at: new Date(),
      updated_at: new Date(),
    };

    dbExecuteMock.mockResolvedValue({ rows: [row] });

    const result = await repository.findById(teacherId);

    expect(dbExecuteMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(row);
  });

  it('returns undefined when teacher is not found by id', async () => {
    dbExecuteMock.mockResolvedValue({ rows: [] });

    const result = await repository.findById('missing-id');

    expect(result).toBeUndefined();
  });

  it('lists teachers with default pagination', async () => {
    const rows: Teacher[] = [
      {
        teacher_id: 't1',
        user_id: 'u1',
        university_id: 'uni1',
        is_verified: false,
        specialty: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        teacher_id: 't2',
        user_id: 'u2',
        university_id: 'uni2',
        is_verified: true,
        specialty: 'Math',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    dbExecuteMock.mockResolvedValue({ rows });

    const params: ListTeachersParams = {};
    const result = await repository.list(params);

    expect(dbExecuteMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(rows);
  });

  it('lists teachers with custom pagination', async () => {
    dbExecuteMock.mockResolvedValue({ rows: [] });

    const params: ListTeachersParams = { limit: 10, offset: 5 };
    await repository.list(params);

    expect(dbExecuteMock).toHaveBeenCalledTimes(1);
  });

  it('updates a teacher and returns updated entity when both fields provided', async () => {
    const teacherId = 'teacher-1';
    const input: UpdateTeacherInput = {
      isVerified: true,
      specialty: 'Computer Science',
    };

    const row: Teacher = {
      teacher_id: teacherId,
      user_id: 'user-1',
      university_id: 'uni-1',
      is_verified: true,
      specialty: 'Computer Science',
      created_at: new Date(),
      updated_at: new Date(),
    };

    dbExecuteMock.mockResolvedValue({ rows: [row] });

    const result = await repository.update(teacherId, input);

    expect(dbExecuteMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(row);
  });

  it('returns undefined when updating non-existing teacher', async () => {
    const teacherId = 'missing-id';
    const input: UpdateTeacherInput = {
      isVerified: true,
    };

    dbExecuteMock.mockResolvedValue({ rows: [] });

    const result = await repository.update(teacherId, input);

    expect(result).toBeUndefined();
  });

  it('falls back to findById when no update fields are provided', async () => {
    const teacherId = 'teacher-1';

    const row: Teacher = {
      teacher_id: teacherId,
      user_id: 'user-1',
      university_id: 'uni-1',
      is_verified: false,
      specialty: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    dbExecuteMock.mockResolvedValueOnce({ rows: [row] });

    const result = await repository.update(teacherId, {});

    expect(dbExecuteMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(row);
  });
});
