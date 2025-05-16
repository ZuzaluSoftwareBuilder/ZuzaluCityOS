import { Result } from '@/models/base';
import {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
} from '@/models/calendar';
import { supabase } from '@/utils/supabase/client';
import { BaseCalendarRepository } from './type';

export class SupaCalendarRepository extends BaseCalendarRepository {
  private readonly tableName = 'calendars';

  async create(data: CreateCalendarInput): Promise<Result<Calendar>> {
    try {
      const { data: createdCalendar, error } = await supabase
        .from(this.tableName)
        .insert({
          name: this.getValue(data.name),
          category: data.category || [],
          gated: data.gated,
          space_id: data.spaceId,
          role_ids: data.roleIds || null,
        })
        .select('*, space:spaces(*)')
        .single();

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedCalendar = this.transformToCalendar(createdCalendar);
      if (!transformedCalendar) {
        return this.createResponse(
          null,
          new Error('Failed to create calendar'),
        );
      }

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
      const updateData: any = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.gated !== undefined) updateData.gated = data.gated;
      if (data.roleIds !== undefined) updateData.role_ids = data.roleIds;

      const { data: updatedCalendar, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select('*, space:spaces(*)')
        .single();

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedCalendar = this.transformToCalendar(updatedCalendar);
      if (!transformedCalendar) {
        return this.createResponse(
          null,
          new Error('Failed to update calendar'),
        );
      }

      return this.createResponse(transformedCalendar);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getById(id: string): Promise<Result<Calendar>> {
    try {
      const { data: calendar, error } = await supabase
        .from(this.tableName)
        .select('*, space:spaces(*)')
        .eq('id', id)
        .single();

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedCalendar = this.transformToCalendar(calendar);
      if (!transformedCalendar) {
        return this.createResponse(null, new Error('Calendar not found'));
      }

      return this.createResponse(transformedCalendar);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getBySpaceId(spaceId: string): Promise<Result<Calendar[]>> {
    try {
      const { data: calendars, error } = await supabase
        .from(this.tableName)
        .select('*, space:spaces(*)')
        .eq('space_id', spaceId);

      if (error) {
        return this.createResponse(null, error);
      }

      const transformedCalendars = (calendars || [])
        .map((calendar) => this.transformToCalendar(calendar))
        .filter(Boolean) as Calendar[];

      return this.createResponse(transformedCalendars);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        return this.createResponse(null, error);
      }

      return this.createResponse(true);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  protected transformToCalendar(supaData: any): Calendar | null {
    if (!supaData) return null;

    return {
      id: supaData.id,
      name: supaData.name,
      category: supaData.category || [],
      gated: supaData.gated,
      spaceId: supaData.space_id,
      roleIds: supaData.role_ids,
      createdAt: supaData.created_at,
      space: supaData.space
        ? {
            id: supaData.space.id,
            name: supaData.space.name,
            description: supaData.space.description,
            avatar: supaData.space.avatar,
            banner: supaData.space.banner,
            tagline: supaData.space.tagline,
            category: supaData.space.category,
            gated: supaData.space.gated,
            createdAt: supaData.space.created_at,
            updatedAt: supaData.space.updated_at,
            owner: supaData.space.owner,
            author: supaData.space.author,
          }
        : undefined,
    };
  }
}
