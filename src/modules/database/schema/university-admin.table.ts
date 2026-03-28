import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { email } from 'zod';

export const universityAdmin = pgTable(
  'universityadmin',
  {
    adminId: uuid('admin_id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    userId: uuid('user_id'),
    universityId: uuid('university_id'),
    email: text('email').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
  },
  (t) => ({
    userIdUnique: uniqueIndex('universityadmin_user_id_unique').on(t.userId),
  }),
);
