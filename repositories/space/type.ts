import { Result } from '@/models/base';
import { CreateSpaceInput, Space, UpdateSpaceInput } from '@/models/space';
import { BaseRepository } from '../base/repository';

export interface ISpaceRepository {
  create(data: CreateSpaceInput): Promise<Result<Space>>;
  update(id: string, data: UpdateSpaceInput): Promise<Result<Space>>;
  getById(id: string): Promise<Result<Space>>;
  getAll(): Promise<Result<Space[]>>;
}

export abstract class BaseSpaceRepository
  extends BaseRepository
  implements ISpaceRepository
{
  abstract create(data: CreateSpaceInput): Promise<Result<Space>>;
  abstract update(id: string, data: UpdateSpaceInput): Promise<Result<Space>>;
  abstract getById(id: string): Promise<Result<Space>>;
  abstract getAll(): Promise<Result<Space[]>>;

  /**
   * Transform data source format to unified Space model
   */
  protected abstract transformToSpace(sourceData: any): Space | null;
}
