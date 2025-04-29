import { DatabaseType } from '../type';
import { CeramicAnnouncementRepository } from './ceramic';
import { SupaAnnouncementRepository } from './supa';
import { IAnnouncementRepository } from './type';

export function getAnnouncementRepository(
  dataSource: DatabaseType = 'supabase',
): IAnnouncementRepository {
  if (dataSource === 'supabase') {
    return new SupaAnnouncementRepository();
  } else {
    return new CeramicAnnouncementRepository();
  }
}
