import { composeClient } from '@/constant';
import { Result } from '@/models/base';
import { CreateSpaceInput, Space, UpdateSpaceInput } from '@/models/space';
import {
  CREATE_SPACE_MUTATION,
  GET_ALL_SPACE_AND_MEMBER_QUERY,
  GET_ALL_SPACE_QUERY,
  GET_SPACE_QUERY_BY_ID,
  UPDATE_SPACE_MUTATION,
} from '@/services/graphql/space';
import { executeQuery } from '@/utils/ceramic';
import { BaseSpaceRepository } from './type';

export class CeramicSpaceRepository extends BaseSpaceRepository {
  async create(data: CreateSpaceInput): Promise<Result<Space>> {
    try {
      const response = await composeClient.executeQuery(CREATE_SPACE_MUTATION, {
        input: {
          content: {
            name: this.getValue(data.name),
            description: this.getValue(data.description),
            avatar: this.getValue(data.avatar),
            banner: this.getValue(data.banner),
            category: this.getValue(data.category),
            tagline: this.getValue(data.tagline),
            color: this.getValue(data.color),
            tags: data.tags,
            socialLinks: data.socialLinks,
            customLinks: data.customLinks,
            gated: this.getBooleanValue(data.gated),
            owner: this.getValue(data.owner),
          },
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to create space',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const spaceData = response.data?.createZucitySpace?.document;
      if (!spaceData) {
        return this.createResponse(
          null,
          new Error('Failed to create space: No valid data returned'),
        );
      }

      const space = this.transformToSpace(spaceData);
      if (!space) {
        return this.createResponse(
          null,
          new Error('Failed to create space: Data transformation error'),
        );
      }

      return this.createResponse(space);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async update(id: string, data: UpdateSpaceInput): Promise<Result<Space>> {
    try {
      const content: Record<string, any> = {};

      if (data.name !== undefined) content.name = this.getValue(data.name);
      if (data.description !== undefined)
        content.description = this.getValue(data.description);
      if (data.avatar !== undefined)
        content.avatar = this.getValue(data.avatar);
      if (data.banner !== undefined)
        content.banner = this.getValue(data.banner);
      if (data.category !== undefined)
        content.category = this.getValue(data.category);
      if (data.tagline !== undefined)
        content.tagline = this.getValue(data.tagline);
      if (data.color !== undefined) content.color = this.getValue(data.color);
      if (data.tags !== undefined) content.tags = data.tags;
      if (data.socialLinks !== undefined)
        content.socialLinks = data.socialLinks;
      if (data.customLinks !== undefined)
        content.customLinks = data.customLinks;
      if (data.gated !== undefined) content.gated = data.gated;

      const response = await composeClient.executeQuery(UPDATE_SPACE_MUTATION, {
        input: {
          id: id,
          content,
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to update space',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const spaceData = response.data?.updateZucitySpace?.document;
      if (!spaceData) {
        return this.createResponse(
          null,
          new Error('Failed to update space: No valid data returned'),
        );
      }

      const space = this.transformToSpace(spaceData);
      if (!space) {
        return this.createResponse(
          null,
          new Error('Failed to update space: Data transformation error'),
        );
      }

      return this.createResponse(space);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getById(id: string): Promise<Result<Space>> {
    try {
      const response = await executeQuery(GET_SPACE_QUERY_BY_ID, {
        id,
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get space details',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const spaceData = response.data?.node;
      if (!spaceData) {
        return this.createResponse(
          null,
          new Error('Failed to get space details: No valid data returned'),
        );
      }

      const space = this.transformToSpace(spaceData);
      if (!space) {
        return this.createResponse(
          null,
          new Error('Failed to get space details: Data transformation error'),
        );
      }

      return this.createResponse(space);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getAll(): Promise<Result<Space[]>> {
    try {
      const variables: Record<string, any> = { first: 100 };
      const response = await composeClient.executeQuery(
        GET_ALL_SPACE_QUERY,
        variables,
      );

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get space list',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const edges = response.data?.zucitySpaceIndex?.edges || [];
      const spaces = edges
        .map((edge: any) => this.transformToSpace(edge.node))
        .filter(Boolean) as Space[];

      return this.createResponse(spaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getAllAndMembers(roleIds: string[]): Promise<Result<Space[]>> {
    try {
      const variables: Record<string, any> = {
        first: 100,
        userRolesFilters: {
          where: {
            roleId: {
              in: roleIds,
            },
          },
        },
      };
      const response = await composeClient.executeQuery(
        GET_ALL_SPACE_AND_MEMBER_QUERY,
        variables,
      );

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get space list',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const edges = response.data?.zucitySpaceIndex?.edges || [];
      const spaces = edges
        .map((edge: any) => this.transformToSpace(edge.node))
        .filter(Boolean) as Space[];

      return this.createResponse(spaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getUserOwnedSpaces(userId: string): Promise<Result<Space[]>> {
    try {
      const variables: Record<string, any> = {
        first: 100,
        filters: {
          where: {
            owner: {
              equalTo: userId,
            },
          },
        },
      };

      const response = await composeClient.executeQuery(
        GET_ALL_SPACE_QUERY,
        variables,
      );

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get user owned spaces',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const edges = response.data?.zucitySpaceIndex?.edges || [];
      const spaces = edges
        .map((edge: any) => this.transformToSpace(edge.node))
        .filter(Boolean) as Space[];

      return this.createResponse(spaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getByIds(ids: string[]): Promise<Result<Space[]>> {
    try {
      const variables: Record<string, any> = {
        filters: {
          where: {
            id: {
              in: ids,
            },
          },
        },
      };

      const response = await composeClient.executeQuery(
        GET_ALL_SPACE_QUERY,
        variables,
      );

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get spaces by ids',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const edges = response.data?.zucitySpaceIndex?.edges || [];
      const spaces = edges
        .map((edge: any) => this.transformToSpace(edge.node))
        .filter(Boolean) as Space[];

      return this.createResponse(spaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  protected transformToSpace(ceramicData: any): Space | null {
    if (!ceramicData) return null;

    return {
      id: ceramicData.id,
      name: ceramicData.name,
      description: ceramicData.description,
      avatar: ceramicData.avatar,
      banner: ceramicData.banner,
      category: ceramicData.category,
      tagline: ceramicData.tagline,
      color: ceramicData.color,
      tags: ceramicData.tags || [],
      socialLinks: ceramicData.socialLinks || [],
      customLinks: ceramicData.customLinks || [],
      gated: ceramicData.gated,
      createdAt: ceramicData.createdAt,
      updatedAt: ceramicData.updatedAt,

      // Account related
      owner: ceramicData.owner,
      author: ceramicData.author,

      // Related data
      announcements:
        ceramicData.announcements?.edges?.map((edge: any) => edge.node) || [],
      events: ceramicData.events?.edges?.map((edge: any) => edge.node) || [],
      installedApps:
        ceramicData.installedApps?.edges?.map((edge: any) => edge.node) || [],
      spaceGating: ceramicData.spaceGating || [],
      userRoles:
        ceramicData.userRoles?.edges?.map((edge: any) => edge.node) || [],
    };
  }
}
