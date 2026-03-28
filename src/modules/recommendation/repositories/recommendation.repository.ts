import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { recommendation } from '../../database/schema';
import { type RecommendationStatus } from '../models/recommendation.model';

@Injectable()
export class RecommendationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateRecommendationInput) {
    const [row] = await this.databaseService.db
      .insert(recommendation)
      .values({
        studentId: input.studentId,
        universityId: input.universityId,
        universityAdminId: input.universityAdminId,
        teacherId: input.teacherId,
        status: input.status,
        content: input.content ?? null,
        isTeacherSigned: input.isTeacherSigned ?? false,
        teacherSignature: input.teacherSignature ?? null,
        verifyToken: input.verifyToken ?? null,
        verifyTokenExpiresAt: input.verifyTokenExpiresAt ?? null,
        isTerminated: input.isTerminated ?? false,
      })
      .returning();

    return row ?? null;
  }

  async findById(id: string) {
    const [row] = await this.databaseService.db
      .select()
      .from(recommendation)
      .where(eq(recommendation.id, id))
      .limit(1);

    return row ?? null;
  }

  async findByVerifyToken(token: string) {
    const [row] = await this.databaseService.db
      .select()
      .from(recommendation)
      .where(eq(recommendation.verifyToken, token))
      .limit(1);

    return row ?? null;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(recommendation)
      .orderBy(desc(recommendation.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async listAll() {
    const rows = await this.databaseService.db.select().from(recommendation);
    return rows;
  }

  async update(id: string, input: REPOSITORY_TYPE.UpdateRecommendationInput) {
    const [row] = await this.databaseService.db
      .update(recommendation)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(recommendation.id, id))
      .returning();

    return row ?? null;
  }

  async setStatus(id: string, status: RecommendationStatus) {
    const [row] = await this.databaseService.db
      .update(recommendation)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(recommendation.id, id))
      .returning();

    return row ?? null;
  }

  async setTerminated(id: string, isTerminated: boolean) {
    const [row] = await this.databaseService.db
      .update(recommendation)
      .set({
        isTerminated,
        updatedAt: new Date(),
      })
      .where(eq(recommendation.id, id))
      .returning();

    return row ?? null;
  }
}
