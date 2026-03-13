import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { project } from '../../database/schema';

@Injectable()
export class ProjectRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateProjectInput) {
    const [row] = await this.databaseService.db
      .insert(project)
      .values({
        title: input.title,
        description: input.description,
        studentId: input.studentId,
        teacherId: input.teacherId,
        universityId: input.universityId,
        isApproved: input.isApproved ?? false,
        isActive: input.isActive ?? true,
      })
      .returning();

    return row ?? null;
  }

  async findById(id: string) {
    const [row] = await this.databaseService.db.select().from(project).where(eq(project.id, id)).limit(1);

    return row ?? null;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(project)
      .orderBy(desc(project.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async listAll() {
    const rows = await this.databaseService.db.select().from(project);
    return rows;
  }

  async update(id: string, input: REPOSITORY_TYPE.UpdateProjectInput) {
    const [row] = await this.databaseService.db
      .update(project)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(project.id, id))
      .returning();

    return row ?? null;
  }

  async setApproved(id: string, isApproved: boolean) {
    const [row] = await this.databaseService.db
      .update(project)
      .set({
        isApproved,
        updatedAt: new Date(),
      })
      .where(eq(project.id, id))
      .returning();

    return row ?? null;
  }

  async setActive(id: string, isActive: boolean) {
    const [row] = await this.databaseService.db
      .update(project)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(project.id, id))
      .returning();

    return row ?? null;
  }
}
