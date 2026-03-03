import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '#/modules/database/database.service';
import { invitesTable, InvitesTableType } from '../entities/invites.entity';

export type CreateInviteData = Omit<InvitesTableType, 'id' | 'created_at' | 'used_at' | 'revoked_at'>;
export type UpdateInviteData = Partial<Omit<InvitesTableType, 'id' | 'created_at' | 'jti'>>;

@Injectable()
export class InvitesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getById(id: string) {
    const rows = await this.databaseService.db.select().from(invitesTable).where(eq(invitesTable.id, id)).limit(1);
    return rows[0] ?? null;
  }
  async getByJti(jti: string) {
    const rows = await this.databaseService.db.select().from(invitesTable).where(eq(invitesTable.jti, jti)).limit(1);
    return rows[0] ?? null;
  }
  async create(inviteData: CreateInviteData) {
    const [newInvite] = await this.databaseService.db
      .insert(invitesTable)
      .values({
        email: inviteData.email,
        first_name: inviteData.first_name ?? null,
        last_name: inviteData.last_name ?? null,
        role: inviteData.role,
        jti: inviteData.jti,
        expires_at: inviteData.expires_at,
        created_at: new Date(),
      })
      .returning();

    return newInvite;
  }
  async update(id: string, updateData: UpdateInviteData) {
    const [updatedInvite] = await this.databaseService.db
      .update(invitesTable)
      .set(updateData)
      .where(eq(invitesTable.id, id))
      .returning();
    return updatedInvite;
  }
}
