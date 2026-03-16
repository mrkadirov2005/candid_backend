import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const message = pgTable('message', {
  messageId: uuid('message_id').primaryKey().defaultRandom(),
  senderUserId: uuid('sender_user_id').notNull(),
  receiverUserId: uuid('receiver_user_id').notNull(),
  content: text('content').notNull(),
  contextType: text('context_type'),
  contextId: uuid('context_id'),
  attachmentLinks: jsonb('attachment_links').$type<string[] | null>(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
});
