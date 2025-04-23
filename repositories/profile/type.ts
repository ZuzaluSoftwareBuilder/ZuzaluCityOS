import { Profile, UpdateProfileInput } from '@/models/profile';
import { Nullable } from '@/types/common';
import { BaseRepository } from '../base/repository';

export interface IProfileRepository {
  update(_id: string, _data: UpdateProfileInput): Promise<void>;
  getProfileByAddress(
    _address: string,
    _chainId: number,
  ): Promise<Nullable<Profile>>;
  getProfileByUsername(_username: string, _chainId: number): Promise<Profile[]>;
}

export abstract class BaseProfileRepository
  extends BaseRepository
  implements IProfileRepository
{
  abstract update(_id: string, _data: UpdateProfileInput): Promise<void>;

  abstract getProfileByAddress(
    _address: string,
    _chainId: number,
  ): Promise<Nullable<Profile>>;

  abstract getProfileByUsername(
    _username: string,
    _chainId: number,
  ): Promise<Profile[]>;
}
