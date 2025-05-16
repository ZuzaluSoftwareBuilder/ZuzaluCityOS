import { Result } from '@/models/base';
import {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
} from '@/models/calendar';
import { executeQuery } from '@/utils/ceramic';
import { dayjs } from '@/utils/dayjs';
import { BaseCalendarRepository } from './type';

// GraphQL queries and mutations for calendar operations
const CREATE_CALENDAR_MUTATION = `
  mutation CreateSpaceCalendar($input: CreateZucitySpaceCalendarInput!) {
    createZucitySpaceCalendar(input: $input) {
      document {
        id
        name
        category {
          category
        }
        accessRule
        spaceId
        allowedRoles {
          roleId
        }
        created_at
        updated_at
        space {
          id
          name
          description
          avatar
          banner
          tagline
          category
          gated
        }
      }
    }
  }
`;

const UPDATE_CALENDAR_MUTATION = `
  mutation UpdateSpaceCalendar($input: UpdateZucitySpaceCalendarInput!) {
    updateZucitySpaceCalendar(input: $input) {
      document {
        id
        name
        category {
          category
        }
        accessRule
        spaceId
        allowedRoles {
          roleId
        }
        created_at
        updated_at
        space {
          id
          name
          description
          avatar
          banner
          tagline
          category
          gated
        }
      }
    }
  }
`;

const GET_CALENDAR_BY_ID_QUERY = `
  query GetCalendarById($id: ID!) {
    node(id: $id) {
      ... on ZucitySpaceCalendar {
        id
        name
        category {
          category
        }
        accessRule
        spaceId
        allowedRoles {
          roleId
        }
        created_at
        updated_at
        space {
          id
          name
          description
          avatar
          banner
          tagline
          category
          gated
        }
      }
    }
  }
`;

const GET_CALENDARS_BY_SPACE_QUERY = `
  query GetCalendarsBySpace($spaceId: ID!) {
    node(id: $spaceId) {
      ... on ZucitySpace {
        id
        spaceCalendar(first: 100) {
          edges {
            node {
              id
              name
              category {
                category
              }
              accessRule
              spaceId
              allowedRoles {
                roleId
              }
              created_at
              updated_at
            }
          }
        }
      }
    }
  }
`;

const DELETE_CALENDAR_MUTATION = `
  mutation DeleteCalendar($input: EnableIndexingZucitySpaceCalendarInput!) {
    enableIndexingZucitySpaceCalendar(input: $input) {
      document {
        id
      }
    }
  }
`;

export class CeramicCalendarRepository extends BaseCalendarRepository {
  async create(data: CreateCalendarInput): Promise<Result<Calendar>> {
    try {
      const now = dayjs().toISOString();

      // Transform category array to Ceramic format
      const categoryObjects = data.category.map((cat) => ({ category: cat }));

      // Transform roleIds to Ceramic format if they exist
      const roleObjects = data.roleIds
        ? data.roleIds.map((roleId) => ({ roleId }))
        : [];

      const response = await executeQuery(CREATE_CALENDAR_MUTATION, {
        input: {
          content: {
            name: data.name,
            category: categoryObjects,
            accessRule: data.gated ? 'Gated App' : 'Open',
            spaceId: data.spaceId,
            allowedRoles: roleObjects,
            created_at: now,
            updated_at: now,
          },
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to create calendar',
      );
      if (result.error) {
        return this.createResponse(null, result.error);
      }

      const calendarData = response?.data?.createZucitySpaceCalendar?.document;
      if (!calendarData) {
        return this.createResponse(
          null,
          new Error('Failed to create calendar: No valid data returned'),
        );
      }

      const transformedCalendar = this.transformToCalendar(calendarData);
      return this.createResponse(transformedCalendar);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async update(
    id: string,
    data: UpdateCalendarInput,
  ): Promise<Result<Calendar>> {
    try {
      const updateContent: any = {
        updated_at: dayjs().toISOString(),
      };

      if (data.name !== undefined) updateContent.name = data.name;

      if (data.category !== undefined) {
        updateContent.category = data.category.map((cat) => ({
          category: cat,
        }));
      }

      if (data.gated !== undefined) {
        updateContent.accessRule = data.gated ? 'Gated App' : 'Open';
      }

      if (data.roleIds !== undefined) {
        updateContent.allowedRoles = data.roleIds
          ? data.roleIds.map((roleId) => ({ roleId }))
          : [];
      }

      const response = await executeQuery(UPDATE_CALENDAR_MUTATION, {
        input: {
          id,
          content: updateContent,
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to update calendar',
      );
      if (result.error) {
        return this.createResponse(null, result.error);
      }

      const calendarData = response?.data?.updateZucitySpaceCalendar?.document;
      if (!calendarData) {
        return this.createResponse(
          null,
          new Error('Failed to update calendar: No valid data returned'),
        );
      }

      const transformedCalendar = this.transformToCalendar(calendarData);
      return this.createResponse(transformedCalendar);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getById(id: string): Promise<Result<Calendar>> {
    try {
      const response = await executeQuery(GET_CALENDAR_BY_ID_QUERY, { id });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get calendar',
      );
      if (result.error) {
        return this.createResponse(null, result.error);
      }

      const calendarData = response?.data?.node;
      if (!calendarData) {
        return this.createResponse(null, new Error('Calendar not found'));
      }

      const transformedCalendar = this.transformToCalendar(calendarData);
      return this.createResponse(transformedCalendar);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getBySpaceId(spaceId: string): Promise<Result<Calendar[]>> {
    try {
      const response = await executeQuery(GET_CALENDARS_BY_SPACE_QUERY, {
        spaceId,
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get calendars by space',
      );
      if (result.error) {
        return this.createResponse(null, result.error);
      }

      const spaceData = response?.data?.node;
      if (!spaceData) {
        return this.createResponse(null, new Error('Space not found'));
      }

      const edges = spaceData.spaceCalendar?.edges || [];
      const calendars = edges
        .map((edge: any) => this.transformToCalendar(edge.node))
        .filter(Boolean) as Calendar[];

      return this.createResponse(calendars);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const response = await executeQuery(DELETE_CALENDAR_MUTATION, {
        input: {
          id,
          shouldIndex: false,
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to delete calendar',
      );
      if (result.error) {
        return this.createResponse(null, result.error);
      }

      const data = response?.data?.enableIndexingZucitySpaceCalendar?.document;
      if (!data) {
        return this.createResponse(
          null,
          new Error('Failed to delete calendar: No valid data returned'),
        );
      }

      return this.createResponse(true);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  protected transformToCalendar(ceramicData: any): Calendar | null {
    if (!ceramicData) return null;

    // Extract role IDs from allowedRoles array
    const roleIds = ceramicData.allowedRoles
      ? ceramicData.allowedRoles.map((role: any) => role.roleId)
      : null;

    // Extract categories from category array
    const categories = ceramicData.category
      ? ceramicData.category.map((cat: any) => cat.category)
      : [];

    return {
      id: ceramicData.id,
      name: ceramicData.name,
      category: categories,
      gated: ceramicData.accessRule === 'Gated App',
      spaceId: ceramicData.spaceId,
      roleIds: roleIds,
      createdAt: ceramicData.created_at,
      space: ceramicData.space
        ? {
            id: ceramicData.space.id,
            name: ceramicData.space.name,
            description: ceramicData.space.description,
            avatar: ceramicData.space.avatar,
            banner: ceramicData.space.banner,
            tagline: ceramicData.space.tagline,
            category: ceramicData.space.category,
            gated: ceramicData.space.gated,
            createdAt: ceramicData.space.created_at,
            updatedAt: ceramicData.space.updated_at,
          }
        : undefined,
    };
  }
}
