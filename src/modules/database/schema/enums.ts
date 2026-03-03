import { pgEnum } from 'drizzle-orm/pg-core';

const USER_ROLE_VALUES = ['admin', 'hr', 'instructor', 'student'] as const;
export type UserRole = (typeof USER_ROLE_VALUES)[number];
export const userRoleEnum = pgEnum('user_role', USER_ROLE_VALUES);
