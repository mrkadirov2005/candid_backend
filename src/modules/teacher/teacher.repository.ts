import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { teacher } from '../database/schema';

export interface Teacher extends Record<string, unknown> {
  teacherId: string;
  userId: string;
  universityId: string;
  isVerified: boolean;
  specialty: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeacherInput {
  userId: string;
  universityId: string;
  specialty?: string | null;
  password: string;
}

export interface ListTeachersParams {
  limit?: number;
  offset?: number;
}

export interface UpdateTeacherInput {
  isVerified?: boolean;
  specialty?: string | null;
}

@Injectable()
export class TeacherRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CreateTeacherInput, db = this.databaseService.db): Promise<Teacher | undefined> {
    const { userId, universityId, specialty = null } = input;

    const [row] = await db
      .insert(teacher)
      .values({
        userId,
        universityId,
        specialty,
        password: input.password,
      })
      .returning();

    return row;
  }

  async findById(id: string): Promise<Teacher | undefined> {
    const [row] = await this.databaseService.db.select().from(teacher).where(eq(teacher.teacherId, id)).limit(1);

    return row;
  }

  async findByUserId(userId: string): Promise<Teacher | undefined> {
    const [row] = await this.databaseService.db.select().from(teacher).where(eq(teacher.userId, userId)).limit(1);

    return row;
  }

  async list(params: ListTeachersParams = {}): Promise<Teacher[]> {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(teacher)
      .orderBy(desc(teacher.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async update(id: string, input: UpdateTeacherInput): Promise<Teacher | undefined> {
    const updates: UpdateTeacherInput & { updatedAt?: Date } = {};

    if (input.isVerified !== undefined) {
      updates.isVerified = input.isVerified;
    }

    if (input.specialty !== undefined) {
      updates.specialty = input.specialty;
    }

    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }

    updates.updatedAt = new Date();

    const [row] = await this.databaseService.db.update(teacher).set(updates).where(eq(teacher.teacherId, id)).returning();

    return row;
  }
}
