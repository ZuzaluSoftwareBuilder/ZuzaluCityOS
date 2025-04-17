import { CeramicProfileRepository } from './ceramic';
import { SupaProfileRepository } from './supa';
import { IProfileRepository } from './type';

export function getProfileRepository(
  dataSource: 'supabase' | 'ceramic',
): IProfileRepository {
  if (dataSource === 'supabase') {
    return new SupaProfileRepository();
  } else {
    return new CeramicProfileRepository();
  }
}
