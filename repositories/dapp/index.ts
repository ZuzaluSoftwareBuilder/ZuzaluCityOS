import { DatabaseType } from '../type';
import { CeramicDappRepository } from './ceramic';
import { SupaDappRepository } from './supa';
import { IDappRepository } from './type';

export function getDappRepository(
  dataSource: DatabaseType = 'supabase',
): IDappRepository {
  if (dataSource === 'supabase') {
    return new SupaDappRepository();
  } else {
    return new CeramicDappRepository();
  }
}
