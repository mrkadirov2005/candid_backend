import { SetMetadata } from '@nestjs/common';

export interface RolesMetadata {
  table: string;
  roles: string[];
}

export const ROLES_KEY = 'roles';

export const Roles = (metadata: RolesMetadata) => SetMetadata(ROLES_KEY, metadata);
