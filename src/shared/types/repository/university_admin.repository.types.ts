export type CreateUniversityAdminInput = {
  userId: string;
  universityId: string;
  password: string;
};

export type UpdateUniversityAdminInput = {
  universityId?: string;
};
