import { Result } from '@/models/base';
import { CreateSpaceInput, Space, UpdateSpaceInput } from '@/models/space';
import { supabase } from '@/utils/supabase/client';
import { BaseSpaceRepository } from './type';

export class SupaSpaceRepository extends BaseSpaceRepository {
  private readonly tableName = 'spaces';

  async create(data: CreateSpaceInput): Promise<Result<Space>> {
    try {
      const { data: createdSpace, error } = await supabase
        .from(this.tableName)
        .insert({
          name: this.getValue(data.name),
          description: this.getValue(data.description),
          avatar: this.getValue(data.avatar),
          banner: this.getValue(data.banner),
          category: this.getValue(data.category),
          tagline: this.getValue(data.tagline),
          color: this.getValue(data.color),
          tags: this.getValue(data.tags),
          social_links: this.getValue(data.socialLinks),
          custom_links: this.getValue(data.customLinks),
          gated: this.getBooleanValue(data.gated),
          author: this.getValue(data.author),
          owner: this.getValue(data.owner),
        })
        .select(
          `
          *,
          owner_profile:profiles!fk_spaces_owner(user_id, username, avatar),
          author_profile:profiles!fk_spaces_author(user_id, username, avatar)
        `,
        )
        .single();

      if (error) {
        return this.createResponse(null, error);
      }

      const space = this.transformToSpace(createdSpace);
      if (!space) {
        return this.createResponse(null, new Error('Invalid space data'));
      }
      return this.createResponse(space);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async update(id: string, data: UpdateSpaceInput): Promise<Result<Space>> {
    try {
      const updateData: any = {};

      if (data.name !== undefined) updateData.name = this.getValue(data.name);
      if (data.description !== undefined)
        updateData.description = this.getValue(data.description);
      if (data.avatar !== undefined)
        updateData.avatar = this.getValue(data.avatar);
      if (data.banner !== undefined)
        updateData.banner = this.getValue(data.banner);
      if (data.category !== undefined)
        updateData.category = this.getValue(data.category);
      if (data.tagline !== undefined)
        updateData.tagline = this.getValue(data.tagline);
      if (data.color !== undefined)
        updateData.color = this.getValue(data.color);
      if (data.tags !== undefined) updateData.tags = this.getValue(data.tags);
      if (data.socialLinks !== undefined)
        updateData.social_links = this.getValue(data.socialLinks);
      if (data.customLinks !== undefined)
        updateData.custom_links = this.getValue(data.customLinks);
      if (data.gated !== undefined)
        updateData.gated = this.getBooleanValue(data.gated);

      const { data: updatedSpace, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select(
          `
          *,
          owner_profile:profiles!fk_spaces_owner(user_id, username, avatar),
          author_profile:profiles!fk_spaces_author(user_id, username, avatar)
        `,
        )
        .single();

      if (error) {
        return this.createResponse(null, error);
      }

      const space = this.transformToSpace(updatedSpace);
      if (!space) {
        return this.createResponse(null, new Error('Invalid space data'));
      }
      return this.createResponse(space);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getById(id: string): Promise<Result<Space>> {
    try {
      const { data: space, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          owner_profile:profiles!fk_spaces_owner(user_id, username, avatar),
          author_profile:profiles!fk_spaces_author(user_id, username, avatar)
        `,
        )
        .eq('id', id)
        .single();

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedSpace = this.transformToSpace(space);
      if (!transformedSpace) {
        return this.createResponse(null, new Error('Space not found'));
      }
      return this.createResponse(transformedSpace);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getAll(): Promise<Result<Space[]>> {
    try {
      let query = supabase.from(this.tableName).select(`
        *,
        owner_profile:profiles!fk_spaces_owner(user_id, username, avatar),
        author_profile:profiles!fk_spaces_author(user_id, username, avatar)
      `);
      const { data: spaces, error } = await query;
      if (error) {
        return this.createResponse(null, error);
      }
      const transformedSpaces = (spaces || [])
        .map((space) => this.transformToSpace(space))
        .filter(Boolean) as Space[];

      return this.createResponse(transformedSpaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getUserOwnedSpaces(did: string): Promise<Result<Space[]>> {
    try {
      const { data: spaces, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('owner', did);

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedSpaces = (spaces || [])
        .map((space) => this.transformToSpace(space))
        .filter(Boolean) as Space[];

      return this.createResponse(transformedSpaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getByIds(ids: string[]): Promise<Result<Space[]>> {
    try {
      const { data: spaces, error } = await supabase
        .from(this.tableName)
        .select('*')
        .in('id', ids);

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedSpaces = (spaces || [])
        .map((space) => this.transformToSpace(space))
        .filter(Boolean) as Space[];

      return this.createResponse(transformedSpaces);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  protected transformToSpace(supaData: any): Space | null {
    if (!supaData) return null;

    return {
      id: supaData.id,
      name: supaData.name,
      description: supaData.description,
      avatar: supaData.avatar,
      banner: supaData.banner,
      category: supaData.category,
      tagline: supaData.tagline,
      color: supaData.color,
      tags: supaData.tags || [],
      socialLinks: supaData.social_links || [],
      customLinks: supaData.custom_links || [],
      gated: supaData.gated,
      createdAt: supaData.created_at,
      updatedAt: supaData.updated_at,
      author: supaData['owner_profile'],
      owner: supaData['author_profile'],
      announcements: { edges: [] },
      events: { edges: [] },
      installedApps: { edges: [] },
      spaceGating: { edges: [] },
      userRoles: { edges: [] },
    };
  }
}
