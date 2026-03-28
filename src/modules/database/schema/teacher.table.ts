import { boolean, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { email } from 'zod';

export const teacher = pgTable(
  'teachers',
  {
    teacherId: uuid('teacher_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    universityId: uuid('university_id').notNull(),
    isVerified: boolean('is_verified').notNull().default(false),
    specialty: text('specialty'),
    email: text('email').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdUnique: uniqueIndex('teachers_user_id_unique').on(t.userId),
    universityIdIdx: index('teachers_university_id_idx').on(t.universityId),
  }),
);
