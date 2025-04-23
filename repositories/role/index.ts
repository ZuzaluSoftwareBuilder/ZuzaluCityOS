import { DatabaseType } from '../type';
import { CeramicRoleRepository } from './ceramic';
import { SupaRoleRepository } from './supa';
import { IRoleRepository } from './type';

export const getRoleRepository = (type: DatabaseType): IRoleRepository => {
  if (type === 'ceramic') {
    return new CeramicRoleRepository();
  }
  return new SupaRoleRepository();
};

export * from './type';
