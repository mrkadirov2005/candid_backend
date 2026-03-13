import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'university_admin', 'employer', 'super_admin']);
