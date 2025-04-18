import { Profile, UpdateProfileInput } from '@/models/profile';
import { Nullable } from '@/types/common';

export interface IProfileRepository {
  update(_id: string, _data: UpdateProfileInput): Promise<Nullable<Profile>>;

  getProfileByAddress(
    _address: string,
    _chainId: number,
  ): Promise<Nullable<Profile>>;

  getProfileByUsername(_username: string): Promise<Profile[]>;
}
