import { Profile, UpdateProfileInput } from '@/models/profile';
import { Nullable } from '@/types/common';
import { supabase } from '@/utils/supabase/client';
import { BaseProfileRepository } from './type';

export class SupaProfileRepository extends BaseProfileRepository {
  async update(_id: string, _data: UpdateProfileInput): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(_data)
      .eq('user_id', _id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getProfileByUsername(
    _username: string,
    _chainId: number,
  ): Promise<Profile[]> {
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
      did: profile.user_id,
      username: profile.username ?? '',
      avatar: profile.avatar ?? undefined,
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

    if (!data) return null;
    return {
      ...data,
      id: data.user_id,
      did: data.user_id,
      username: data.username ?? '',
      avatar: data.avatar ?? undefined,
    };
  }
}
