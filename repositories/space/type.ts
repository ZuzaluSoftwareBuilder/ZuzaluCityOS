import { Result } from '@/models/base';
import { CreateSpaceInput, Space, UpdateSpaceInput } from '@/models/space';
import { BaseRepository } from '../base/repository';

export interface ISpaceRepository {
  create(_data: CreateSpaceInput): Promise<Result<Space>>;
  update(_id: string, _data: UpdateSpaceInput): Promise<Result<Space>>;
  getById(_id: string): Promise<Result<Space>>;
  getAll(): Promise<Result<Space[]>>;
  getAllAndMembers(_roleIds: string[]): Promise<Result<Space[]>>;
  getUserOwnedSpaces(_did: string): Promise<Result<Space[]>>;
  getByIds(_ids: string[]): Promise<Result<Space[]>>;
}

export abstract class BaseSpaceRepository
  extends BaseRepository
  implements ISpaceRepository
{
  abstract create(_data: CreateSpaceInput): Promise<Result<Space>>;
  abstract update(_id: string, _data: UpdateSpaceInput): Promise<Result<Space>>;
  abstract getById(_id: string): Promise<Result<Space>>;
  abstract getAll(): Promise<Result<Space[]>>;
  abstract getAllAndMembers(_roleIds: string[]): Promise<Result<Space[]>>;
  abstract getUserOwnedSpaces(_did: string): Promise<Result<Space[]>>;
  abstract getByIds(_ids: string[]): Promise<Result<Space[]>>;
  /**
   * Transform data source format to unified Space model
   */
  protected abstract transformToSpace(_sourceData: any): Space | null;
}
