import { DatabaseType } from '../type';
import { SupaRoleRepository } from './supa';
import { IRoleRepository } from './type';

export const getRoleRepository = (
  type: DatabaseType = 'supabase',
): IRoleRepository => {
  return new SupaRoleRepository();
};

export * from './type';
