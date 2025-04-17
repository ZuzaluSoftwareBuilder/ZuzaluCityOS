import { Profile, UpdateProfileInput } from '@/models/profile';

export interface IProfileRepository {
  update(_id: string, _data: UpdateProfileInput): Promise<Profile | null>;
}
