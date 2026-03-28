import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type {
  CreateUniversityAdminInput,
  UpdateUniversityAdminInput,
} from '#/shared/types/repository/university_admin.repository.types';
import { DatabaseService } from '../../database/database.service';
import { universityAdmin } from '../../database/schema';

@Injectable()
export class UniversityAdminRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(input: CreateUniversityAdminInput, db = this.databaseService.db) {
    const [row] = await db
      .insert(universityAdmin)
      .values({
        userId: input.userId,
        email: input.email,
        universityId: input.universityId,
        password: input.password,
        name: input.name,
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

  async findByEmail(email: string) {
    const [row] = await this.databaseService.db
      .select()
      .from(universityAdmin)
      .where(eq(universityAdmin.email, email))
      .limit(1);

    return row ?? null;
  }

  async findByUserId(userId: string) {
    const [row] = await this.databaseService.db.select().from(universityAdmin).where(eq(universityAdmin.userId, userId)).limit(1);

    return row ?? null;
  }

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
