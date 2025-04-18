import { composeClient } from '@/constant';
import { Profile, UpdateProfileInput } from '@/models/profile';
import {
  GET_PROFILE_BY_DID_QUERY,
  GET_PROFILE_BY_NAME_QUERY,
} from '@/services/graphql/profile';
import { Nullable } from '@/types/common';
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

  async getProfileById(_id: string): Promise<Nullable<Profile>> {
    const { data, error } = await composeClient.executeQuery(
      GET_PROFILE_BY_DID_QUERY,
      { did: _id },
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.node?.zucityProfile) {
      return null;
    }

    const profile = data.node.zucityProfile;
    return {
      id: profile.id,
      username: profile.username,
      avatar: profile.avatar || '',
      address: getWalletAddressFromProfile(profile),
    };
  }

  async getProfileByUsername(_username: string): Promise<Nullable<Profile>> {
    const { data, error } = await composeClient.executeQuery(
      GET_PROFILE_BY_NAME_QUERY,
      { username: _username },
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.zucityProfileIndex?.edges?.length) {
      return null;
    }

    const profile = data.zucityProfileIndex.edges[0].node;
    return {
      id: profile.id,
      username: profile.username,
      avatar: profile.avatar || '',
      address: getWalletAddressFromProfile(profile),
    };
  }
}
