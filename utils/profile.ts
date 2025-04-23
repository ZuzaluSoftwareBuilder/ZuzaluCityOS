import { DatabaseType } from '@/repositories/type';
import { Profile } from '@/types';
import { Nullable } from '@/types/common';
import { getWalletAddressFromDid } from '@/utils/did';

export const getWalletAddressFromProfile = (profile?: Nullable<Profile>) => {
  if (!profile) return '';
  // comes from supabase
  if (profile.address) return profile.address;
  // fallback to read ceramic did
  if (!profile.author?.id) return '';
  return getWalletAddressFromDid(profile.author?.id);
};

export const formatProfile = (profile: any, type: DatabaseType): Profile => {
  if (type === 'supabase') {
    return {
      ...profile,
      id: profile?.user_id,
      did: profile?.user_id,
    };
  }
  return {
    id: profile?.id,
    username: profile?.username,
    avatar: profile?.avatar || '',
    address: getWalletAddressFromProfile(profile),
    did: profile?.author?.id,
  };
};
