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

  async getProfileByUsername(_username: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${_username}%`)
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map((profile) => ({
      ...profile,
      id: profile.user_id,
    }));
  }

  async getProfileByAddress(
    _address: string,
    _chainId: number,
  ): Promise<Nullable<Profile>> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('address', _address.toLowerCase())
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      id: data.user_id,
    };
  }
}
