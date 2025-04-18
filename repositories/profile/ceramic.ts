import { composeClient } from '@/constant';
import { Profile, UpdateProfileInput } from '@/models/profile';
import {
  GET_PROFILE_BY_DID_QUERY,
  GET_PROFILE_BY_NAME_QUERY,
} from '@/services/graphql/profile';
import { Nullable } from '@/types/common';
import { getDidByAddress } from '@/utils/did';
import { getWalletAddressFromProfile } from '@/utils/profile';
import { IProfileRepository } from './type';

export class CeramicProfileRepository implements IProfileRepository {
  async update(
    _id: string,
    _data: UpdateProfileInput,
  ): Promise<Profile | null> {
    const { error } = await composeClient.executeQuery(`
        mutation {
          updateZucityProfile(input: {
            id: "${_id}",
            content: {
              username: "${_data.username}",
              avatar: "${_data.avatar}"
            }
          }) {
            document {
              username
            }
          }
        }
      `);

    if (error) {
      throw new Error(error.message);
    }

    return null;
  }

  async getProfileByAddress(
    _address: string,
    _chainId: number,
  ): Promise<Nullable<Profile>> {
    const did = getDidByAddress(_address, _chainId);
    const { data, error } = await composeClient.executeQuery(
      GET_PROFILE_BY_DID_QUERY,
      { did },
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.node?.zucityProfile) {
      return null;
    }

    const profile = data.node.zucityProfile;
    return {
      id: profile.author?.id,
      username: profile.username,
      avatar: profile.avatar || '',
      address: getWalletAddressFromProfile(profile),
    };
  }

  async getProfileByUsername(_username: string): Promise<Profile[]> {
    const { data, error } = await composeClient.executeQuery(
      GET_PROFILE_BY_NAME_QUERY,
      { username: _username },
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.zucityProfileIndex?.edges?.length) {
      return [];
    }

    return data.zucityProfileIndex.edges.map((edge: any) => {
      const profile = edge.node;
      return {
        id: profile.author?.id,
        username: profile.username,
        avatar: profile.avatar || '',
        address: getWalletAddressFromProfile(profile),
      };
    });
  }
}
