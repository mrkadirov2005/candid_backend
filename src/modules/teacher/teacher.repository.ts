import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';

export interface Teacher extends Record<string, unknown> {
  teacher_id: string;
  user_id: string;
  university_id: string;
  is_verified: boolean;
  specialty: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTeacherInput {
  userId: string;
  universityId: string;
  specialty?: string | null;
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

  async create(input: CreateTeacherInput): Promise<Teacher | undefined> {
    const { userId, universityId, specialty = null } = input;

    const result = await this.databaseService.db.execute<Teacher>(
      sql`
        INSERT INTO teachers (user_id, university_id, specialty)
        VALUES (${userId}, ${universityId}, ${specialty})
        RETURNING teacher_id,
                  user_id,
                  university_id,
                  is_verified,
                  specialty,
                  created_at,
                  updated_at
      `,
    );

    const row = result.rows[0];
    return row;
  }

  async findById(id: string): Promise<Teacher | undefined> {
    const result = await this.databaseService.db.execute<Teacher>(
      sql`
        SELECT teacher_id,
               user_id,
               university_id,
               is_verified,
               specialty,
               created_at,
               updated_at
        FROM teachers
        WHERE teacher_id = ${id}
      `,
    );

    const row = result.rows[0];
    return row;
  }

  async list(params: ListTeachersParams = {}): Promise<Teacher[]> {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    const result = await this.databaseService.db.execute<Teacher>(
      sql`
        SELECT teacher_id,
               user_id,
               university_id,
               is_verified,
               specialty,
               created_at,
               updated_at
        FROM teachers
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
    );

    return result.rows;
  }

  async update(id: string, input: UpdateTeacherInput): Promise<Teacher | undefined> {
    if (input.isVerified === undefined && input.specialty === undefined) {
      return this.findById(id);
    }

    let result: { rows: Teacher[] };

    if (input.isVerified !== undefined && input.specialty !== undefined) {
      result = await this.databaseService.db.execute<Teacher>(
        sql`
          UPDATE teachers
          SET is_verified = ${input.isVerified},
              specialty = ${input.specialty},
              updated_at = NOW()
          WHERE teacher_id = ${id}
          RETURNING teacher_id,
                    user_id,
                    university_id,
                    is_verified,
                    specialty,
                    created_at,
                    updated_at
        `,
      );
    } else if (input.isVerified !== undefined) {
      result = await this.databaseService.db.execute<Teacher>(
        sql`
          UPDATE teachers
          SET is_verified = ${input.isVerified},
              updated_at = NOW()
          WHERE teacher_id = ${id}
          RETURNING teacher_id,
                    user_id,
                    university_id,
                    is_verified,
                    specialty,
                    created_at,
                    updated_at
        `,
      );
    } else {
      result = await this.databaseService.db.execute<Teacher>(
        sql`
          UPDATE teachers
          SET specialty = ${input.specialty},
              updated_at = NOW()
          WHERE teacher_id = ${id}
          RETURNING teacher_id,
                    user_id,
                    university_id,
                    is_verified,
                    specialty,
                    created_at,
                    updated_at
        `,
      );
    }

    const row = result.rows[0] as Teacher | undefined;
    return row;
  }
}
