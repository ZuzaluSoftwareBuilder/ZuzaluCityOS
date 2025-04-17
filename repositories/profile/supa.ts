import { Profile, UpdateProfileInput } from '@/models/profile';
import { supabase } from '@/utils/supabase/client';
import { IProfileRepository } from './type';

export class SupaProfileRepository implements IProfileRepository {
  async update(
    _id: string,
    _data: UpdateProfileInput,
  ): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(_data)
      .eq('user_id', _id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
