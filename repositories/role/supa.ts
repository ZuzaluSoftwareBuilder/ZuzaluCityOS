import { Result } from '@/models/base';
import { CreateUserRole, UserRole } from '@/models/role';
import { formatProfile } from '@/utils/profile';
import { supabase } from '@/utils/supabase/client';
import { BaseRoleRepository } from './type';

export class SupaRoleRepository extends BaseRoleRepository {
  async getMembers(resource: string, id: string): Promise<Result<UserRole[]>> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, role(*), profiles(*)')
      .eq('source', resource)
      .eq('space_id', id);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(data.map((role) => this.transformRole(role)));
  }

  async getOwnedRole(id: string): Promise<Result<UserRole[]>> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, role(*), profiles(*)')
      .eq('user_id', id);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(data.map((role) => this.transformRole(role)));
  }

  async getUserRole(
    id: string,
    resource: string,
    userId: string,
  ): Promise<Result<UserRole[]>> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, role(*), profiles(*)')
      .eq('source', resource)
      .eq('space_id', id)
      .eq('user_id', userId);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(data.map((role) => this.transformRole(role)));
  }

  async createRole(role: CreateUserRole): Promise<Result<UserRole>> {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        role_id: role.roleId,
        user_id: role.userId,
        space_id: role.resourceId,
        source: role.source,
      })
      .select('*, role(*), profiles(*)')
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(this.transformRole(data));
  }

  async updateRole(
    id: string,
    role: CreateUserRole,
  ): Promise<Result<UserRole>> {
    const { data, error } = await supabase
      .from('user_roles')
      .update({
        role_id: role.roleId,
      })
      .eq('id', id)
      .select('*, role(*), profiles(*)')
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(this.transformRole(data));
  }

  async deleteRole(id: string): Promise<Result<UserRole>> {
    const { error } = await supabase.from('user_roles').delete().eq('id', id);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse({});
  }

  public transformRole(data: any): UserRole {
    return {
      id: data.id,
      roleId: data.role_id,
      resourceId: data.space_id,
      source: data.source,
      userId: formatProfile(data.profiles, 'supabase'),
    };
  }
}
