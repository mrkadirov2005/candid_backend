import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const messageStatusEnum = pgEnum('message_status', ['sending', 'unread', 'read']);

export const message = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').notNull(),
  receiverId: uuid('receiver_id').notNull(),
  message: text('message').notNull(),
  status: messageStatusEnum('status').notNull().default('sending'),
  isDeleted: boolean('is_deleted').notNull().default(false),
  isEmailed: boolean('is_emailed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
