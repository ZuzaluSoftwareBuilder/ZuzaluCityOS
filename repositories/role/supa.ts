import { Result } from '@/models/base';
import { UserRole } from '@/models/role';
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

  private transformRole(role: any): UserRole {
    return {
      roleId: role.role_id,
      userId: role.user_id,
    };
  }
}
