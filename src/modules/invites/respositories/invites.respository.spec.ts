import type { DatabaseService } from '#/modules/database/database.service';
import { invitesTable } from '#/modules/database/schema';
import { type CreateInviteData, InvitesRepository, type UpdateInviteData } from './invites.respository';

type DbMock = {
  select: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
};

describe('InvitesRepository', () => {
  let db: DbMock;
  let repo: InvitesRepository;

  beforeEach(() => {
    db = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    };
    const databaseService = { db } as unknown as DatabaseService;
    repo = new InvitesRepository(databaseService);
    jest.clearAllMocks();
  });

  const mockSelect = (rows: unknown[]) => {
    const limit = jest.fn().mockResolvedValue(rows);
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    db.select.mockReturnValue({ from });
    return { from, where, limit };
  };

  const mockUpdate = (rows: unknown[]) => {
    const returning = jest.fn().mockResolvedValue(rows);
    const where = jest.fn().mockReturnValue({ returning });
    const set = jest.fn().mockReturnValue({ where });
    db.update.mockReturnValue({ set });
    return { set, where, returning };
  };

  const mockInsert = (rows: unknown[]) => {
    const returning = jest.fn().mockResolvedValue(rows);
    const values = jest.fn().mockReturnValue({ returning });
    db.insert.mockReturnValue({ values });
    return { values, returning };
  };

  describe('getById', () => {
    it('returns invite when found', async () => {
      mockSelect([{ id: 'id-1', jti: 'jti-123' }]);

      const result = await repo.getById('id-1');

      expect(result).toEqual({ id: 'id-1', jti: 'jti-123' });
    });

    it('returns null when not found', async () => {
      mockSelect([]);

      await expect(repo.getById('missing')).resolves.toBeNull();
    });

    it('queries correct table with limit 1', async () => {
      const { from, limit } = mockSelect([]);

      await repo.getById('id-1');

      expect(from).toHaveBeenCalledWith(invitesTable);
      expect(limit).toHaveBeenCalledWith(1);
    });

    it('propagates db error', async () => {
      const limit = jest.fn().mockRejectedValue(new Error('select failed'));
      const where = jest.fn().mockReturnValue({ limit });
      const from = jest.fn().mockReturnValue({ where });
      db.select.mockReturnValue({ from });

      await expect(repo.getById('id-1')).rejects.toThrow('select failed');
    });
  });

  describe('getByJti', () => {
    it('returns invite when found', async () => {
      mockSelect([{ id: 'id-1', jti: 'jti-123' }]);

      const result = await repo.getByJti('jti-123');

      expect(result).toEqual({ id: 'id-1', jti: 'jti-123' });
    });

    it('returns null when not found', async () => {
      mockSelect([]);

      await expect(repo.getByJti('missing-jti')).resolves.toBeNull();
    });

    it('queries correct table with limit 1', async () => {
      const { from, limit } = mockSelect([]);

      await repo.getByJti('jti-123');

      expect(from).toHaveBeenCalledWith(invitesTable);
      expect(limit).toHaveBeenCalledWith(1);
    });

    it('propagates db error', async () => {
      const limit = jest.fn().mockRejectedValue(new Error('select failed'));
      const where = jest.fn().mockReturnValue({ limit });
      const from = jest.fn().mockReturnValue({ where });
      db.select.mockReturnValue({ from });

      await expect(repo.getByJti('jti-123')).rejects.toThrow('select failed');
    });
  });

  describe('create', () => {
    const inviteData: CreateInviteData = {
      email: 'a@b.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
      jti: 'jti-123',
      expires_at: new Date('2030-01-01T00:00:00.000Z'),
    };

    it('inserts invite and returns result', async () => {
      mockInsert([{ id: 'id-1', jti: 'jti-123' }]);

      const result = await repo.create(inviteData);

      expect(db.insert).toHaveBeenCalledWith(invitesTable);
      expect(result).toEqual({ id: 'id-1', jti: 'jti-123' });
    });

    it('passes correct fields including jti and created_at', async () => {
      const { values } = mockInsert([{ id: 'id-1' }]);

      await repo.create(inviteData);

      expect(values).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'a@b.com',
          jti: 'jti-123',
          role: 'admin',
          created_at: expect.any(Date),
        }),
      );
    });

    it('sets null for optional first/last name when null', async () => {
      const { values } = mockInsert([{ id: 'id-1' }]);

      await repo.create({ ...inviteData, first_name: null, last_name: null });

      expect(values).toHaveBeenCalledWith(expect.objectContaining({ first_name: null, last_name: null }));
    });

    it('propagates db error', async () => {
      const returning = jest.fn().mockRejectedValue(new Error('insert failed'));
      const values = jest.fn().mockReturnValue({ returning });
      db.insert.mockReturnValue({ values });

      await expect(repo.create(inviteData)).rejects.toThrow('insert failed');
    });
  });

  describe('update', () => {
    it('updates fields and returns result', async () => {
      const { set } = mockUpdate([{ id: 'id-1', email: 'new@b.com' }]);

      const updateData: UpdateInviteData = { email: 'new@b.com' };
      const result = await repo.update('id-1', updateData);

      expect(db.update).toHaveBeenCalledWith(invitesTable);
      expect(set).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: 'id-1', email: 'new@b.com' });
    });

    it('returns undefined when no rows affected', async () => {
      mockUpdate([]);

      await expect(repo.update('missing', { email: 'x@y.com' })).resolves.toBeUndefined();
    });

    it('propagates db error', async () => {
      const returning = jest.fn().mockRejectedValue(new Error('update failed'));
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });
      db.update.mockReturnValue({ set });

      await expect(repo.update('id-1', { email: 'x@y.com' })).rejects.toThrow('update failed');
    });
  });
});
