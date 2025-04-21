import { composeClient } from '@/constant';
import { Profile, UpdateProfileInput } from '@/models/profile';
import { BaseProfileRepository } from './type';

export class CeramicProfileRepository extends BaseProfileRepository {
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
}
