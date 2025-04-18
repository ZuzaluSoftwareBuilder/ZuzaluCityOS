import { Profile, UpdateProfileInput } from '@/models/profile';
import { Nullable } from '@/types/common';
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

  async getProfileByUsername(_username: string): Promise<Nullable<Profile>> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', _username)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return data;
  }

  async getProfileById(_id: string): Promise<Nullable<Profile>> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', _id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return data;
  }
}
