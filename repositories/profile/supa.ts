import { Profile, UpdateProfileInput } from '@/models/profile';
import { Nullable } from '@/types/common';
import { getDidByAddress } from '@/utils/did';
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
      did: getDidByAddress(profile.address, _chainId),
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
      did: getDidByAddress(data.address, _chainId),
    };
  }
}
