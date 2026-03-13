export type CreateProjectInput = {
  title: string;
  description: string;
  studentId: string;
  teacherId: string;
  universityId: string;
  isApproved?: boolean;
  isActive?: boolean;
};

export type UpdateProjectInput = {
  title?: string;
  description?: string;
  studentId?: string;
  teacherId?: string;
  universityId?: string;
  isApproved?: boolean;
  isActive?: boolean;
};
