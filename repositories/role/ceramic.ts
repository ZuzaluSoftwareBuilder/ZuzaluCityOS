import { Result } from '@/models/base';
import { UserRole } from '@/models/role';
import { GET_MEMBERS_QUERY } from '@/services/graphql/role';
import { executeQuery } from '@/utils/ceramic';
import { BaseRoleRepository } from './type';

export class CeramicRoleRepository extends BaseRoleRepository {
  async getMembers(resource: string, id: string): Promise<Result<UserRole[]>> {
    const response = await executeQuery(GET_MEMBERS_QUERY, {
      source: resource,
      resourceId: id,
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to get members',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    if (!result?.data?.zucityUserRolesIndex?.edges) {
      return this.createResponse(null, new Error('No members found'));
    }

    return this.createResponse(
      result.data.zucityUserRolesIndex.edges.map((edge) => edge?.node),
    );
  }
}
