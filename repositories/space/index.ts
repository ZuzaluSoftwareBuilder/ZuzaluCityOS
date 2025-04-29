import { DatabaseType } from '../type';
import { CeramicSpaceRepository } from './ceramic';
import { SupaSpaceRepository } from './supa';
import { ISpaceRepository } from './type';

/**
 * Get space repository instance
 *
 * Factory method that returns the corresponding space repository implementation
 * based on the selected data source
 *
 * @param dataSource Data source type ('supabase' or 'ceramic')
 * @returns Space repository instance
 *
 */
export function getSpaceRepository(
  dataSource: DatabaseType = 'supabase',
): ISpaceRepository {
  if (dataSource === 'supabase') {
    return new SupaSpaceRepository();
  } else {
    return new CeramicSpaceRepository();
  }
}
