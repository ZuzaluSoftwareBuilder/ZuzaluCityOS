import { withSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';
import { supabase } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

export const GET = withSessionValidation(async (request, sessionData) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const resource = url.searchParams.get('resource');

    if (!id || !resource) {
      return createErrorResponse(
        'Missing required parameters: id and resource are required',
        400
      );
    }

    // Verify permission
    if (!hasRequiredPermission(sessionData, PermissionName.INVITE_USERS)) {
      return createErrorResponse('Permission denied', 403);
    }

    // Query assignable roles
    const { data: roles, error } = await supabase
      .from('role_permission')
      .select(
        `
        *,
        role(
          id,
          name,
          level
        )
        `
      )
      .or(
        `and(resource.eq.${resource},resource_id.eq.${id}),and(resource.is.null,resource_id.is.null)`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Role permission query error:', error);
      return createErrorResponse('Failed to get assignable roles', 500);
    }

    // Filter roles based on the current user's role level
    const { operatorRole, isOwner } = sessionData;

    const assignableRoles = roles.filter(rolePermission => {
      const roleLevel = rolePermission.role.level;

      // If user is owner, they can assign all roles except owner
      if (isOwner) {
        return roleLevel !== 'owner';
      }

      // If user is admin, they can assign all roles except owner and admin
      if (operatorRole?.role.level === 'admin') {
        return !['owner', 'admin'].includes(roleLevel);
      }

      // Other users cannot assign roles
      return false;
    });

    return createSuccessResponse(assignableRoles);
  } catch (error: any) {
    console.error('Failed to get assignable roles:', error);
    return createErrorResponse(
      'Internal server error',
      500
    );
  }
}); 