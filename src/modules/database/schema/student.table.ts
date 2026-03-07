import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const student = pgTable(
  'student',
  {
    studentId: uuid('student_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    universityId: uuid('university_id').notNull(),
    adminId: uuid('admin_id'),
    firstName: varchar('first_name', { length: 50 }).notNull(),
    lastName: varchar('last_name', { length: 50 }).notNull(),
    email: text('email'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdUnique: uniqueIndex('student_user_id_unique').on(t.userId),
    universityIdIdx: index('student_university_id_idx').on(t.universityId),
  }),
);
