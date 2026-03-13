import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { university } from '../../database/schema';

@Injectable()
export class UniversityRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateUniversityInput) {
    const [row] = await this.databaseService.db
      .insert(university)
      .values({
        name: input.name,
        adminId: input.adminId,
        location: input.location,
        isActive: input.isActive ?? true,
      })
      .returning();

    return row ?? null;
  }

  async findById(id: string) {
    const [row] = await this.databaseService.db.select().from(university).where(eq(university.id, id)).limit(1);

    return row ?? null;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(university)
      .orderBy(desc(university.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async listAll() {
    const rows = await this.databaseService.db.select().from(university);
    return rows;
  }

  async update(id: string, input: REPOSITORY_TYPE.UpdateUniversityInput) {
    const [row] = await this.databaseService.db
      .update(university)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(university.id, id))
      .returning();

    return row ?? null;
  }

  async setActive(id: string, isActive: boolean) {
    const [row] = await this.databaseService.db
      .update(university)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(university.id, id))
      .returning();

    return row ?? null;
  }
}
