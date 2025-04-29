import { Result } from '@/models/base';
import {
  CreateSpaceGatingInput,
  SpaceGating,
  UpdateSpaceGatingInput,
} from '@/models/spaceGating';
import { BaseRepository } from '../base/repository';

export interface ISpaceGatingRepository {
  getBySpaceId(_spaceId: string): Promise<Result<SpaceGating | null>>;
  create(_spaceGating: CreateSpaceGatingInput): Promise<Result<SpaceGating>>;
  update(
    _id: string,
    _spaceGating: UpdateSpaceGatingInput,
  ): Promise<Result<SpaceGating>>;
  delete(_id: string): Promise<Result<boolean>>;
}

export abstract class BaseSpaceGatingRepository
  extends BaseRepository
  implements ISpaceGatingRepository
{
  abstract getBySpaceId(_spaceId: string): Promise<Result<SpaceGating | null>>;
  abstract create(
    _spaceGating: CreateSpaceGatingInput,
  ): Promise<Result<SpaceGating>>;
  abstract update(
    _id: string,
    _spaceGating: UpdateSpaceGatingInput,
  ): Promise<Result<SpaceGating>>;
  abstract delete(_id: string): Promise<Result<boolean>>;
}
