import { Announcement } from '@/models/announcement';
import { Result } from '@/models/base';
import { supabase } from '@/utils/supabase/client';
import {
  BaseAnnouncementRepository,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './type';

export class SupaAnnouncementRepository extends BaseAnnouncementRepository {
  async create(input: CreateAnnouncementInput): Promise<Result<Announcement>> {
    const { title, description, tags, authorId, spaceId } = input;

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title,
        description,
        tags: tags.map((tag) => ({ tag })),
        author: authorId,
        space_id: spaceId,
      })
      .select('*, profiles!announcements_author_fkey(*)')
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    const announcement = this.transformAnnouncement(data);
    if (!announcement) {
      return this.createResponse(null, new Error('Invalid announcement data'));
    }

    return this.createResponse(announcement);
  }

  async update(
    id: string,
    input: UpdateAnnouncementInput,
  ): Promise<Result<Announcement>> {
    const { title, description, tags } = input;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags.map((tag) => ({ tag }));

    const { data, error } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', id)
      .select('*, profiles!announcements_author_fkey(*)')
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    const announcement = this.transformAnnouncement(data);
    if (!announcement) {
      return this.createResponse(null, new Error('Invalid announcement data'));
    }

    return this.createResponse(announcement);
  }

  async getAnnouncementsBySpace(
    spaceId: string,
  ): Promise<Result<Announcement[]>> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*, profiles!announcements_author_fkey(*)')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: false });

    if (error) {
      return this.createResponse(null, error);
    }

    const announcements = data
      .map((item) => this.transformAnnouncement(item))
      .filter(Boolean) as Announcement[];
    return this.createResponse(announcements);
  }

  async getAnnouncement(id: string): Promise<Result<Announcement>> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*, profiles!announcements_author_fkey(*)')
      .eq('id', id)
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    const announcement = this.transformAnnouncement(data);
    if (!announcement) {
      return this.createResponse(null, new Error('Announcement not found'));
    }

    return this.createResponse(announcement);
  }

  async deleteAnnouncement(id: string): Promise<Result<boolean>> {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(true);
  }

  private transformAnnouncement(data: any): Announcement | null {
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      sourceId: `supabase:${data.id}`,
      author: {
        id: data.profiles.user_id,
        zucityProfile: {
          id: data.profiles.user_id,
          username: data.profiles.username,
          avatar: data.profiles.avatar,
          address: data.profiles.wallet_address || '',
          did: data.profiles.did || '',
        },
      },
      spaceId: data.space_id,
    };
  }
}
