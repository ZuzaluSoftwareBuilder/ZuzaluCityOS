import { DatabaseType } from '../type';
import { SupaSpaceGatingRepository } from './supa';
import { ISpaceGatingRepository } from './type';

export const getSpaceGatingRepository = (
  type: DatabaseType = 'supabase',
): ISpaceGatingRepository => {
  return new SupaSpaceGatingRepository();
};

export * from './type';
