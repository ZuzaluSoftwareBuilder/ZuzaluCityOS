import { DatabaseType } from '../type';
import { CeramicCalendarRepository } from './ceramic';
import { SupaCalendarRepository } from './supa';
import { ICalendarRepository } from './type';

/**
 * Get calendar repository instance
 *
 * Factory method that returns the corresponding calendar repository implementation
 * based on the selected data source
 *
 * @param dataSource Data source type ('supabase' or 'ceramic')
 * @returns Calendar repository instance
 */
export function getCalendarRepository(
  dataSource: DatabaseType = 'supabase',
): ICalendarRepository {
  if (dataSource === 'supabase') {
    return new SupaCalendarRepository();
  } else {
    return new CeramicCalendarRepository();
  }
}

export * from './type';
