import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const employer = pgTable('employers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 160 }).notNull(),
  email: varchar('email', { length: 180 }).notNull(),
  company: varchar('company', { length: 180 }).notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
