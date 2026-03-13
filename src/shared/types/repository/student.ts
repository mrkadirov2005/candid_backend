export type StudentType = {
  userId: string;
  universityId: string;
};

export type CreateStudentInput = {
  userId: string;
  universityId: string;
  adminId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateStudentInput = {
  universityId?: string;
  adminId?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string | null;
};
