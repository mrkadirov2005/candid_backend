import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { student } from '../../database/schema';
import { REPOSITORY_TYPE } from '#/shared/types/repository/_';

@Injectable()
export class StudentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: REPOSITORY_TYPE.CreateStudentInput) {
    const [row] = await this.databaseService.db
      .insert(student)
      .values({
        userId: input.userId,
        universityId: input.universityId,
        adminId: input.adminId ?? null,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email ?? null,
      })
      .returning();

    return row;
  }

  async findById(studentId: string) {
    const [row] = await this.databaseService.db
      .select()
      .from(student)
      .where(eq(student.studentId, studentId))
      .limit(1);

    return row ;
  }

  async list(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.databaseService.db
      .select()
      .from(student)
      .orderBy(desc(student.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async update(studentId: string, input: REPOSITORY_TYPE.UpdateStudentInput) {
    const [row] = await this.databaseService.db
      .update(student)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(student.studentId, studentId))
      .returning();

    return row ;
  }
}
