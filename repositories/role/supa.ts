import { Result } from '@/models/base';
import { UserRole } from '@/models/role';
import { formatProfile } from '@/utils/profile';
import { supabase } from '@/utils/supabase/client';
import { BaseRoleRepository } from './type';

export class SupaRoleRepository extends BaseRoleRepository {
  async getMembers(resource: string, id: string): Promise<Result<UserRole[]>> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, role(*)')
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
      .select('*, role(*)')
      .eq('user_id', id);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(data.map((role) => this.transformRole(role)));
  }

  private transformRole(data: any): UserRole {
    return {
      roleId: data.role_id,
      resourceId: data.space_id,
      source: data.source,
      userId: {
        zucityProfile: formatProfile(data.role, 'supabase'),
      },
    };
  }
}
