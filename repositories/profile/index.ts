import { DatabaseType } from '../type';
import { CeramicProfileRepository } from './ceramic';
import { SupaProfileRepository } from './supa';
import { IProfileRepository } from './type';
export function getProfileRepository(
  dataSource: DatabaseType = 'ceramic',
): IProfileRepository {
  if (dataSource === 'supabase') {
    return new SupaProfileRepository();
  } else {
    return new CeramicProfileRepository();
  }
}
