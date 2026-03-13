import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { employer } from '../../database/schema';

@Injectable()
export class EmployerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateEmployerInput, db = this.databaseService.db) {
    const [row] = await db
      .insert(employer)
      .values({
        ...(input.id ? { id: input.id } : {}),
        name: input.name,
        email: input.email,
        company: input.company,
        password: input.password,
      })
      .returning();

    return row ?? null;
  }

  async findById(id: string) {
    const [row] = await this.databaseService.db.select().from(employer).where(eq(employer.id, id)).limit(1);
    return row ?? null;
  }

  async findByEmail(email: string) {
    const [row] = await this.databaseService.db.select().from(employer).where(eq(employer.email, email)).limit(1);
    return row ?? null;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(employer)
      .orderBy(desc(employer.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async listAll() {
    const rows = await this.databaseService.db.select().from(employer);
    return rows;
  }

  async update(id: string, input: REPOSITORY_TYPE.UpdateEmployerInput) {
    const [row] = await this.databaseService.db
      .update(employer)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(employer.id, id))
      .returning();

    return row ?? null;
  }
}
