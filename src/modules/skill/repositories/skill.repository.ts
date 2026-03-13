import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { skill } from '../../database/schema';

@Injectable()
export class SkillRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateSkillInput) {
    const [row] = await this.databaseService.db
      .insert(skill)
      .values({
        name: input.name,
        type: input.type,
      })
      .returning();

    return row ?? null;
  }

  async listAll() {
    const rows = await this.databaseService.db.select().from(skill);
    return rows;
  }

  async findById(skillId: string) {
    const [row] = await this.databaseService.db.select().from(skill).where(eq(skill.id, skillId)).limit(1);

    return row ?? null;
  }

  async update(skillId: string, input: REPOSITORY_TYPE.UpdateSkillInput) {
    const [row] = await this.databaseService.db
      .update(skill)
      .set({
        ...input,
      })
      .where(eq(skill.id, skillId))
      .returning();

    return row ?? null;
  }
}
