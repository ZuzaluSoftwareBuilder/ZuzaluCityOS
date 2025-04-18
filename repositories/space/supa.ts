import {
  CreateSpaceInput,
  Space,
  SpaceFilters,
  UpdateSpaceInput,
} from '@/models/space';
import { supabase } from '@/utils/supabase/client';
import { ISpaceRepository } from './type';

export class SupaSpaceRepository implements ISpaceRepository {
  private readonly tableName = 'spaces';

  async create(data: CreateSpaceInput): Promise<Space | null> {
    const { data: createdSpace, error } = await supabase
      .from(this.tableName)
      .insert({
        name: data.name,
        description: data.description,
        profile_id: data.profileId,
        avatar: data.avatar,
        banner: data.banner,
        category: data.category,
        tagline: data.tagline,
        color: data.color,
        tags: data.tags,
        social_links: data.socialLinks,
        custom_links: data.customLinks,
        custom_attributes: data.customAttributes,
        gated: data.gated,
        owner_id: data.ownerId,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create space in Supabase:', error);
      throw new Error(error.message);
    }

    return this.transformSupaToSpace(createdSpace);
  }

  async update(id: string, data: UpdateSpaceInput): Promise<Space | null> {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.banner) updateData.banner = data.banner;
    if (data.category) updateData.category = data.category;
    if (data.tagline) updateData.tagline = data.tagline;
    if (data.color) updateData.color = data.color;
    if (data.tags) updateData.tags = data.tags;
    if (data.socialLinks) updateData.social_links = data.socialLinks;
    if (data.customLinks) updateData.custom_links = data.customLinks;
    if (data.customAttributes)
      updateData.custom_attributes = data.customAttributes;
    if (data.gated) updateData.gated = data.gated;

    const { data: updatedSpace, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update space in Supabase:', error);
      throw new Error(error.message);
    }

    return this.transformSupaToSpace(updatedSpace);
  }

  async getById(id: string): Promise<Space | null> {
    const { data: space, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Failed to get space from Supabase:', error);
      throw new Error(error.message);
    }

    return this.transformSupaToSpace(space);
  }

  async getAll(filters?: SpaceFilters): Promise<Space[]> {
    let query = supabase.from(this.tableName).select('*');

    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }
      // 处理tags可能需要更复杂的查询，这里简化处理
    }

    const { data: spaces, error } = await query;

    if (error) {
      console.error('Failed to get spaces from Supabase:', error);
      throw new Error(error.message);
    }

    return spaces.map((space) => this.transformSupaToSpace(space));
  }

  private transformSupaToSpace(supaData: any): Space {
    return {
      id: supaData.id,
      name: supaData.name,
      description: supaData.description,
      profileId: supaData.profile_id,
      avatar: supaData.avatar,
      banner: supaData.banner,
      category: supaData.category,
      tagline: supaData.tagline,
      color: supaData.color,
      tags: supaData.tags,
      socialLinks: supaData.social_links,
      customLinks: supaData.custom_links,
      customAttributes: supaData.custom_attributes,
      gated: supaData.gated,
      createdAt: supaData.created_at,
      updatedAt: supaData.updated_at,
      ownerId: supaData.owner_id,
    };
  }
}
