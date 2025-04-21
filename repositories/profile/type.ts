import { Profile, UpdateProfileInput } from '@/models/profile';
import { BaseRepository } from '../base/repository';

export interface IProfileRepository {
  update(_id: string, _data: UpdateProfileInput): Promise<Profile | null>;
}

export abstract class BaseProfileRepository
  extends BaseRepository
  implements IProfileRepository
{
  abstract update(
    _id: string,
    _data: UpdateProfileInput,
  ): Promise<Profile | null>;
}
