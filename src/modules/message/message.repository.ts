import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { CreateMessageInput, UpdateMessageInput } from '#/shared/types/repository/message.repository.types';
import { DatabaseService } from '../database/database.service';
import { message } from '../database/schema';

@Injectable()
export class MessageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CreateMessageInput) {
    const [row] = await this.databaseService.db
      .insert(message)
      .values({
        senderUserId: input.senderUserId,
        receiverUserId: input.receiverUserId,
        content: input.content,
        contextType: input.contextType ?? null,
        contextId: input.contextId ?? null,
        attachmentLinks: input.attachmentLinks ?? null,
      })
      .returning();

    return row;
  }

  async findById(messageId: string) {
    const [row] = await this.databaseService.db.select().from(message).where(eq(message.messageId, messageId)).limit(1);

    return row;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db.select().from(message).limit(limit).offset(offset);

    return rows;
  }

  async update(messageId: string, input: UpdateMessageInput) {
    const [row] = await this.databaseService.db
      .update(message)
      .set({
        ...(input.content !== undefined ? { content: input.content } : {}),
        ...(input.contextType !== undefined ? { contextType: input.contextType } : {}),
        ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
        ...(input.attachmentLinks !== undefined ? { attachmentLinks: input.attachmentLinks } : {}),
        updatedAt: new Date(),
      })
      .where(eq(message.messageId, messageId))
      .returning();

    return row;
  }
}
