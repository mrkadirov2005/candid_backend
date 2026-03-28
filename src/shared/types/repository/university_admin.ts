export type CreateUniversityAdminInput = {
  userId: string;
  universityId: string;
  password: string;
  email: string;
};

export type UpdateUniversityAdminInput = {
  universityId?: string;
};
