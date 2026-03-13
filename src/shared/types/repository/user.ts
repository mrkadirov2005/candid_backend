export const USER_ROLES = ['student', 'teacher', 'university_admin', 'employer', 'super_admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type CreateUserInput = {
  userId?: string;
  role: UserRole;
  email: string;
  refreshToken?: string | null;
  isActive?: boolean;
};

export type UpdateUserInput = {
  role?: UserRole;
  refreshToken?: string | null;
  isActive?: boolean;
};
