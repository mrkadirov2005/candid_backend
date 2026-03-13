export type CreateUniversityInput = {
  name: string;
  adminId: string;
  location: string;
  isActive?: boolean;
};

export type UpdateUniversityInput = {
  name?: string;
  adminId?: string;
  location?: string;
  isActive?: boolean;
};
