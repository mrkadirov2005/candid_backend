import { boolean, date, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const vacancyTypeEnum = pgEnum('vacancy_type', ['internship', 'job']);
export const vacancyModeEnum = pgEnum('vacancy_mode', ['online', 'offline', 'hybrid']);

export const vacancy = pgTable('vacancies', {
  id: uuid('id').primaryKey().defaultRandom(),
  employerId: uuid('employer_id').notNull(),
  description: text('description').notNull(),
  company: varchar('company', { length: 160 }).notNull(),
  location: varchar('location', { length: 160 }).notNull(),
  mode: vacancyModeEnum('mode').notNull(),
  type: vacancyTypeEnum('type').notNull(),
  salary: integer('salary').notNull(),
  isExpired: boolean('is_expired').notNull().default(false),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
