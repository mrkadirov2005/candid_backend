import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const recommendationStatusEnum = pgEnum('recommendation_status', [
  'pending',
  'preparing',
  'submitting',
  'done',
]);

export const recommendation = pgTable('recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull(),
  universityId: uuid('university_id').notNull(),
  universityAdminId: uuid('university_admin_id').notNull(),
  teacherId: uuid('teacher_id').notNull(),
  status: recommendationStatusEnum('status').notNull().default('pending'),
  content: varchar('content', { length: 1000 }),
  isTeacherSigned: boolean('is_teacher_signed').notNull().default(false),
  teacherSignature: text('teacher_signature'),
  verifyToken: varchar('verify_token', { length: 120 }),
  verifyTokenExpiresAt: timestamp('verify_token_expires_at', { withTimezone: true }),
  isTerminated: boolean('is_terminated').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
