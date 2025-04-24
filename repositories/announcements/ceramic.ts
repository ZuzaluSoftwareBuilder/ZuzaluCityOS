import { Announcement } from '@/models/announcement';
import { Result } from '@/models/base';
import {
  CREATE_ANNOUNCEMENT_MUTATION,
  ENABLE_ANNOUNCEMENT_INDEXING_MUTATION,
  GET_SPACE_ANNOUNCEMENTS_QUERY,
  UPDATE_ANNOUNCEMENT_MUTATION,
} from '@/services/graphql/announcements';
import { executeQuery } from '@/utils/ceramic';
import { dayjs } from '@/utils/dayjs';
import {
  BaseAnnouncementRepository,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './type';

export class CeramicAnnouncementRepository extends BaseAnnouncementRepository {
  async create(input: CreateAnnouncementInput): Promise<Result<Announcement>> {
    const { title, description, tags, author, spaceId } = input;

    const now = dayjs().toISOString();

    const response = await executeQuery(CREATE_ANNOUNCEMENT_MUTATION, {
      input: {
        content: {
          title,
          description,
          tags: tags.map((tag) => ({ tag })),
          authorId: author,
          spaceId,
          createdAt: now,
          updatedAt: now,
          sourceId: `ceramic:${spaceId}`,
        },
      },
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to create announcement',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const data = response?.data?.createZucityAnnouncement?.document;
    if (!data) {
      return this.createResponse(
        null,
        new Error('Failed to create announcement: No valid data returned'),
      );
    }

    const announcement = this.transformToAnnouncement(data);
    if (!announcement) {
      return this.createResponse(
        null,
        new Error('Failed to create announcement: Data transformation error'),
      );
    }

    return this.createResponse(announcement);
  }

  async update(
    id: string,
    input: UpdateAnnouncementInput,
  ): Promise<Result<Announcement>> {
    const { title, description, tags } = input;

    const updateContent: any = {
      updatedAt: dayjs().toISOString(),
    };

    if (title !== undefined) updateContent.title = title;
    if (description !== undefined) updateContent.description = description;
    if (tags !== undefined) updateContent.tags = tags.map((tag) => ({ tag }));

    const response = await executeQuery(UPDATE_ANNOUNCEMENT_MUTATION, {
      input: {
        id,
        content: updateContent,
      },
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to update announcement',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const data = response?.data?.updateZucityAnnouncement?.document;
    if (!data) {
      return this.createResponse(
        null,
        new Error('Failed to update announcement: No valid data returned'),
      );
    }

    const announcement = this.transformToAnnouncement(data);
    if (!announcement) {
      return this.createResponse(
        null,
        new Error('Failed to update announcement: Data transformation error'),
      );
    }

    return this.createResponse(announcement);
  }

  async getAnnouncementsBySpace(
    spaceId: string,
  ): Promise<Result<Announcement[]>> {
    const response = await executeQuery(GET_SPACE_ANNOUNCEMENTS_QUERY, {
      id: spaceId,
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to get space announcements',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const nodeData = response?.data?.node as any;
    const edges = nodeData?.announcements?.edges;
    if (!edges) {
      return this.createResponse(
        null,
        new Error('No announcements found for this space'),
      );
    }

    const announcements = edges
      .map((edge: any) => this.transformToAnnouncement(edge?.node))
      .filter(Boolean);

    return this.createResponse(announcements);
  }

  async getAnnouncement(id: string): Promise<Result<Announcement>> {
    return this.createResponse(
      null,
      new Error('Method not implemented in Ceramic'),
    );
  }

  async deleteAnnouncement(id: string): Promise<Result<boolean>> {
    const response = await executeQuery(ENABLE_ANNOUNCEMENT_INDEXING_MUTATION, {
      input: {
        id,
        shouldIndex: false,
      },
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to delete announcement',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const data = response?.data?.enableIndexingZucityAnnouncement?.document;
    if (!data) {
      return this.createResponse(
        null,
        new Error('Failed to delete announcement: No valid data returned'),
      );
    }

    return this.createResponse(true);
  }

  protected transformToAnnouncement(data: any): Announcement | null {
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      author: data.author,
      spaceId: data.spaceId,
    };
  }
}
