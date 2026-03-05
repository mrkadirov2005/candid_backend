import { pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const universityAdmin = pgTable(
  'universityadmin',
  {
    adminId: uuid('admin_id').primaryKey().defaultRandom(),

    userId: uuid('user_id').notNull(),

    universityId: uuid('university_id').notNull(),

    createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
  },
  (t) => ({
    userIdUnique: uniqueIndex('universityadmin_user_id_unique').on(t.userId),
  }),
);
