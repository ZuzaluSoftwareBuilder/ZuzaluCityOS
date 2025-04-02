import { GET_PROFILE_BY_DID_QUERY } from '@/services/graphql/profile';
import { composeClient } from '@/constant';
import { Profile } from '@/types';

export const getProfileIdByDid = async (did: string) => {
  try {
    const result = await composeClient.executeQuery(GET_PROFILE_BY_DID_QUERY, { did });
    return result.data?.node?.zucityProfile as Profile || null;
  } catch (error) {
    console.error(`Failed to get profile ID for DID ${did}:`, error);
    return null;
  }
};