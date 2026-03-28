export type CreateUniversityAdminInput = {
  userId?: string;
  universityId?: string;
  password: string;
  email: string;
  name: string;
};

export type UpdateUniversityAdminInput = {
  universityId?: string;
};
