import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';
import { DatabaseService } from '../../database/database.service';
import { message } from '../../database/schema';
import { type MessageStatus } from '../models/message.model';

@Injectable()
export class MessageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateMessageInput) {
    const [row] = await this.databaseService.db
      .insert(message)
      .values({
        senderId: input.senderId,
        receiverId: input.receiverId,
        message: input.message,
        status: input.status,
        isDeleted: input.isDeleted ?? false,
        isEmailed: input.isEmailed ?? false,
      })
      .returning();

    return row ?? null;
  }

  async findById(id: string) {
    const [row] = await this.databaseService.db
      .select()
      .from(message)
      .where(eq(message.id, id))
      .limit(1);

    return row ?? null;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(message)
      .orderBy(desc(message.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async listAll() {
    const rows = await this.databaseService.db.select().from(message);
    return rows;
  }

  async update(id: string, input: REPOSITORY_TYPE.UpdateMessageInput) {
    const [row] = await this.databaseService.db
      .update(message)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(message.id, id))
      .returning();

    return row ?? null;
  }

  async setStatus(id: string, status: MessageStatus) {
    const [row] = await this.databaseService.db
      .update(message)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(message.id, id))
      .returning();

    return row ?? null;
  }

  async setDeleted(id: string, isDeleted: boolean) {
    const [row] = await this.databaseService.db
      .update(message)
      .set({
        isDeleted,
        updatedAt: new Date(),
      })
      .where(eq(message.id, id))
      .returning();

    return row ?? null;
  }

  async setEmailed(id: string, isEmailed: boolean) {
    const [row] = await this.databaseService.db
      .update(message)
      .set({
        isEmailed,
        updatedAt: new Date(),
      })
      .where(eq(message.id, id))
      .returning();

    return row ?? null;
  }
}
