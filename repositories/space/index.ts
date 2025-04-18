import { DatabaseType } from '../type';
import { CeramicSpaceRepository } from './ceramic';
import { SupaSpaceRepository } from './supa';
import { ISpaceRepository } from './type';
/**
 * 获取空间仓储实例
 * @param dataSource 数据源类型（'supabase' 或 'ceramic'）
 * @returns 空间仓储实例
 */
export function getSpaceRepository(
  dataSource: DatabaseType = 'ceramic',
): ISpaceRepository {
  if (dataSource === 'supabase') {
    return new SupaSpaceRepository();
  } else {
    return new CeramicSpaceRepository();
  }
}
