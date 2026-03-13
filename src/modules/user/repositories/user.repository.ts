import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { users } from '../../database/schema';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateUserInput, db = this.databaseService.db) {
    const [row] = await db
      .insert(users)
      .values({
        ...(input.userId ? { userId: input.userId } : {}),
        role: input.role,
        email: input.email,
        refreshToken: input.refreshToken ?? null,
        isActive: input.isActive ?? true,
      })
      .returning();

    return row ?? null;
  }

  async findById(userId: string, db = this.databaseService.db) {
    const [row] = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

    return row ?? null;
  }

  async findByEmail(email: string) {
    const [row] = await this.databaseService.db.select().from(users).where(eq(users.email, email)).limit(1);

    return row ?? null;
  }

  async updateRefreshToken(userId: string, refreshToken?: string | null) {
    const [row] = await this.databaseService.db
      .update(users)
      .set({
        refreshToken: refreshToken ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.userId, userId))
      .returning();

    return row ?? null;
  }

  async setActive(userId: string, isActive: boolean) {
    const [row] = await this.databaseService.db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.userId, userId))
      .returning();

    return row ?? null;
  }
}
