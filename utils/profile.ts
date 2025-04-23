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
