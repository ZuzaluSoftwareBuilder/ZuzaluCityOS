import { composeClient } from '@/constant';
import { Profile, UpdateProfileInput } from '@/models/profile';
import {
  GET_PROFILE_BY_DID_QUERY,
  GET_PROFILE_BY_NAME_QUERY,
} from '@/services/graphql/profile';
import { Nullable } from '@/types/common';
import { getDidByAddress } from '@/utils/did';
import { formatProfile } from '@/utils/profile';
import { BaseProfileRepository } from './type';

export class CeramicProfileRepository extends BaseProfileRepository {
  async update(_id: string, _data: UpdateProfileInput): Promise<void> {
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
    return formatProfile(profile, 'ceramic');
  }

  async getProfileByUsername(
    _username: string,
    _chainId: number,
  ): Promise<Profile[]> {
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
      return formatProfile(profile, 'ceramic');
    });
  }
}
