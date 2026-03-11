export type STUDENT_TYPE = {
  userId: string;
  universityId: string;
};

export type CreateStudentInput = {
  userId: string;
  universityId: string;
  adminId?: string | null;
  firstName: string;
  lastName: string;
  email?: string | null;
};

export type UpdateStudentInput = {
  universityId?: string;
  adminId?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string | null;
};