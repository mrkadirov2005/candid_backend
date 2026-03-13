import { pgEnum, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const jointSkillEntityEnum = pgEnum('joint_skill_entity_type', ['project', 'student', 'vacancy', 'employer']);

export const jointSkills = pgTable(
  'joint_skills',
  {
    skillId: uuid('skill_id').notNull(),
    entityType: jointSkillEntityEnum('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.skillId, t.entityType, t.entityId] }),
  }),
);
