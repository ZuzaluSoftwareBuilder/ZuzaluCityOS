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
  userId: {
    zucityProfile: Profile;
  };
}

export type CreateUserRole = Omit<UserRole, 'userId'> & {
  userId: string;
};
