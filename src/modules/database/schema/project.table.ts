import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const project = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 160 }).notNull(),
  description: text('description').notNull(),
  studentId: uuid('student_id').notNull(),
  teacherId: uuid('teacher_id').notNull(),
  universityId: uuid('university_id').notNull(),
  isApproved: boolean('is_approved').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
