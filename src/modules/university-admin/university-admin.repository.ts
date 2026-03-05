import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { universityAdmin } from '../database/schema';

export type CreateUniversityAdminInput = {
  userId: string;
  universityId: string;
};

export type UpdateUniversityAdminInput = {
  universityId?: string;
};

@Injectable()
export class UniversityAdminRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CreateUniversityAdminInput) {
    const [row] = await this.databaseService.db
      .insert(universityAdmin)
      .values({
        userId: input.userId,
        universityId: input.universityId,
      })
      .returning();

    return row ?? null;
  }

  async findById(adminId: string) {
    const [row] = await this.databaseService.db
      .select()
      .from(universityAdmin)
      .where(eq(universityAdmin.adminId, adminId))
      .limit(1);

    return row ?? null;
  }

  // pagination-ready signature
  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db.select().from(universityAdmin).limit(limit).offset(offset);

    return rows;
  }

  async update(adminId: string, input: UpdateUniversityAdminInput) {
    const [row] = await this.databaseService.db
      .update(universityAdmin)
      .set({
        ...(input.universityId ? { universityId: input.universityId } : {}),
        updatedAt: new Date(),
      })
      .where(eq(universityAdmin.adminId, adminId))
      .returning();

    return row ?? null;
  }
}
