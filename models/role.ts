import { Profile } from './profile';

export interface Role {
  id: string;
  name: string;
  level: string;
  is_vanity: boolean;
  resource_id: string;
}

export interface RolePermission {
  id: string;
  role: Role;
  permission_ids: string[];
}

export interface UserRole {
  id: string;
  roleId: string;
  resourceId: string;
  source: string;
  userId: Profile;
}

export type CreateUserRole = Omit<UserRole, 'userId' | 'id'> & {
  userId: string;
};

export type UpdateUserRole = Pick<UserRole, 'roleId'>;
