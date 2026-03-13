import { Injectable } from '@nestjs/common';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { jointSkills } from '../../database/schema';

@Injectable()
export class JointSkillsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async assignSkill(input: REPOSITORY_TYPE.AssignJointSkillInput) {
    const [row] = await this.databaseService.db
      .insert(jointSkills)
      .values({
        skillId: input.skillId,
        entityType: input.entityType,
        entityId: input.entityId,
      })
      .onConflictDoNothing()
      .returning();

    return row ?? null;
  }
}
