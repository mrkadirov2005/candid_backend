export type CreateEmployerInput = {
  id?: string;
  name: string;
  email: string;
  company: string;
  password: string;
};

export type UpdateEmployerInput = {
  name?: string;
  email?: string;
  company?: string;
  password?: string;
};
