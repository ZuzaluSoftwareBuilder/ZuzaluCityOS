import { composeClient } from '@/constant';
import {
  CreateSpaceInput,
  Space,
  SpaceFilters,
  UpdateSpaceInput,
} from '@/models/space';
import {
  CREATE_SPACE_MUTATION,
  GET_ALL_SPACE_QUERY,
  GET_SPACE_QUERY_BY_ID,
  UPDATE_SPACE_MUTATION,
} from '@/services/graphql/space';
import { ISpaceRepository } from './type';

export class CeramicSpaceRepository implements ISpaceRepository {
  async create(data: CreateSpaceInput): Promise<Space | null> {
    try {
      const { data: responseData, errors } = await composeClient.executeQuery(
        CREATE_SPACE_MUTATION,
        {
          input: {
            content: {
              name: data.name,
              description: data.description,
              profileId: data.profileId,
              avatar: data.avatar,
              banner: data.banner,
              category: data.category,
              tagline: data.tagline,
              color: data.color,
              tags: data.tags,
              socialLinks: data.socialLinks,
              customLinks: data.customLinks,
              gated: data.gated,
            },
          },
        },
      );

      if (errors) {
        throw new Error(errors.map((e: Error) => e.message).join(', '));
      }

      const spaceData = responseData?.createZucitySpace?.document;
      // 创建后获取完整数据
      if (spaceData?.id) {
        return this.getById(spaceData.id);
      }
      return this.transformCeramicToSpace(spaceData);
    } catch (error) {
      console.error('Failed to create space in Ceramic:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateSpaceInput): Promise<Space | null> {
    try {
      const { data: responseData, errors } = await composeClient.executeQuery(
        UPDATE_SPACE_MUTATION,
        {
          input: {
            id: id,
            content: {
              name: data.name,
              description: data.description,
              avatar: data.avatar,
              banner: data.banner,
              category: data.category,
              tagline: data.tagline,
              color: data.color,
              tags: data.tags,
              socialLinks: data.socialLinks,
              customLinks: data.customLinks,
              gated: data.gated,
            },
          },
        },
      );

      if (errors) {
        throw new Error(errors.map((e: Error) => e.message).join(', '));
      }

      const spaceData = responseData?.updateZucitySpace?.document;
      // 更新后获取完整数据
      if (spaceData?.id) {
        return this.getById(spaceData.id);
      }
      return this.transformCeramicToSpace(spaceData);
    } catch (error) {
      console.error('Failed to update space in Ceramic:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Space | null> {
    try {
      // 使用包含事件的查询以获取更完整的数据
      const { data, errors } = await composeClient.executeQuery(
        GET_SPACE_QUERY_BY_ID,
        {
          id,
          userRolesFirst: 100,
          userRolesFilters: {},
        },
      );

      if (errors) {
        throw new Error(errors.map((e: Error) => e.message).join(', '));
      }

      return this.transformCeramicToSpace(data?.node);
    } catch (error) {
      console.error('Failed to get space from Ceramic:', error);
      throw error;
    }
  }

  async getAll(filters?: SpaceFilters): Promise<Space[]> {
    const variables: Record<string, any> = { first: 100 };

    // 注意：GET_ALL_SPACE_QUERY不支持过滤，如果需要过滤则需要构建自定义查询
    if (
      filters &&
      (filters.category ||
        filters.name ||
        filters.ownerId ||
        filters.tags?.length)
    ) {
      // 构建自定义过滤查询
      return this.getAllWithFilters(filters);
    }

    try {
      const { data, errors } = await composeClient.executeQuery(
        GET_ALL_SPACE_QUERY,
        variables,
      );

      if (errors) {
        throw new Error(errors.map((e: Error) => e.message).join(', '));
      }

      return (data?.zucitySpaceIndex?.edges || []).map((edge: any) =>
        this.transformCeramicToSpace(edge.node),
      );
    } catch (error) {
      console.error('Failed to get spaces from Ceramic:', error);
      throw error;
    }
  }

  // 用于处理带过滤条件的查询
  private async getAllWithFilters(filters: SpaceFilters): Promise<Space[]> {
    // 自定义查询，支持过滤
    const query = `
      query GetSpacesWithFilters($first: Int, $filters: ZucitySpaceFiltersInput) {
        zucitySpaceIndex(first: $first, filters: $filters) {
          edges {
            node {
              id
              name
              description
              profileId
              avatar
              banner
              category
              tagline
              color
              createdAt
              updatedAt
              tags {
                tag
              }
              socialLinks {
                title
                links
              }
              customLinks {
                title
                links
              }
              gated
              author {
                id
                isViewer
              }
              owner {
                id
                isViewer
              }
            }
          }
        }
      }
    `;

    const variables: Record<string, any> = { first: 100 };

    if (filters) {
      variables.filters = {};
      if (filters.category)
        variables.filters.category = { equalTo: filters.category };
      if (filters.name)
        variables.filters.name = { containsInsensitive: filters.name };
      if (filters.ownerId)
        variables.filters.owner = { equalTo: filters.ownerId };
      // 处理tags是个复杂类型，这里简化处理
    }

    try {
      const { data, errors } = await composeClient.executeQuery(
        query,
        variables,
      );

      if (errors) {
        throw new Error(errors.map((e: Error) => e.message).join(', '));
      }

      return (data?.zucitySpaceIndex?.edges || []).map((edge: any) =>
        this.transformCeramicToSpace(edge.node),
      );
    } catch (error) {
      console.error('Failed to get filtered spaces from Ceramic:', error);
      throw error;
    }
  }

  private transformCeramicToSpace(ceramicData: any): Space | null {
    if (!ceramicData) return null;

    return {
      id: ceramicData.id,
      name: ceramicData.name,
      description: ceramicData.description,
      profileId: ceramicData.profileId,
      avatar: ceramicData.avatar,
      banner: ceramicData.banner,
      category: ceramicData.category,
      tagline: ceramicData.tagline,
      color: ceramicData.color,
      tags: ceramicData.tags,
      socialLinks: ceramicData.socialLinks,
      customLinks: ceramicData.customLinks,
      customAttributes: ceramicData.customAttributes,
      gated: ceramicData.gated,
      createdAt: ceramicData.createdAt,
      updatedAt: ceramicData.updatedAt,

      // 账户相关
      author: ceramicData.author
        ? {
            id: ceramicData.author.id,
            isViewer: ceramicData.author.isViewer,
          }
        : undefined,

      owner: ceramicData.owner
        ? {
            id: ceramicData.owner.id,
            isViewer: ceramicData.owner.isViewer || false,
          }
        : undefined,

      ownerId: ceramicData.owner?.id,

      profile: ceramicData.owner?.zucityProfile
        ? {
            id: ceramicData.owner.zucityProfile.id,
            username: ceramicData.owner.zucityProfile.username,
            avatar: ceramicData.owner.zucityProfile.avatar,
          }
        : undefined,

      // 关联数据
      announcements: ceramicData.announcements,
      events: ceramicData.events,
      installedApps: ceramicData.installedApps,
      spaceGating: ceramicData.spaceGating,
      userRoles: ceramicData.userRoles,
    };
  }
}
