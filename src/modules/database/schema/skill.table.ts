import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const skill = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
});
