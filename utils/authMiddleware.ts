import supabaseAdmin from '@/app/api/utils/supabase';
import { getRoleRepository } from '@/repositories/role';
import { getSpaceRepository } from '@/repositories/space';
import { Permission, RolePermission } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase/client';

export type SessionCheckResult = {
  isValid: boolean;
  operatorId?: string;
  isOwner?: boolean;
  permission?: Permission[];
  role?: RolePermission[];
  operatorRole?: RolePermission;
  error?: string;
};

async function validateSession(request: Request): Promise<SessionCheckResult> {
  try {
    const sessionStr = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');

    const { data: user } = await supabaseAdmin.auth.getUser(sessionStr);

    if (!user) {
      return { isValid: false, error: 'Unauthorized: user not found' };
    }

    const body = await request.json();
    const { id, resource = 'space' } = body;

    if (!id || !resource) {
      return {
        isValid: false,
        error: 'Missing required parameters: id and resource are required',
      };
    }

    const operatorId = user.user?.id;
    const { data: rolePermissionResult } = await supabase
      .from('role_permission')
      .select(
        `
          *,
          role(
            id,
            name,
            level
          )
        `,
      )
      .or(
        `and(resource.eq.${resource},resource_id.eq.${id}),and(resource.is.null,resource_id.is.null)`,
      );
    if (resource === 'space') {
      const spaceResult = await getSpaceRepository().getById(id);

      const space = spaceResult.data;
      const isOwner = space?.owner?.id === operatorId;
      if (isOwner) {
        return {
          isValid: true,
          operatorId,
          isOwner: true,
          role: rolePermissionResult as unknown as RolePermission[],
        };
      }
    }

    const [permissionResult, userRolesResult] = await Promise.all([
      supabase.from('permission').select('*'),
      getRoleRepository().getUserRole(id, resource, operatorId!),
    ]);

    const userRolesData = userRolesResult.data || [];

    const operatorRole = userRolesData.find(
      (item) => item.userId.id === operatorId,
    );

    if (!operatorRole) {
      return { isValid: false, error: 'Operator not found' };
    }

    return {
      isValid: true,
      operatorId,
      isOwner: false,
      permission: permissionResult.data as Permission[],
      role: rolePermissionResult as unknown as RolePermission[],
      operatorRole: rolePermissionResult?.find(
        (role) => role.role?.id === operatorRole.roleId,
      ) as unknown as RolePermission,
    };
  } catch (error) {
    console.error('Error validating session:', error);
    return { isValid: false, error: 'Session validation failed' };
  }
}

export function withSessionValidation(
  handler: (
    _request: NextRequest,
    _sessionData: Omit<SessionCheckResult, 'isValid' | 'error'>,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest) => {
    const clonedRequest = request.clone();
    const sessionCheck = await validateSession(clonedRequest);
    const { isValid, error, ...rest } = sessionCheck;

    if (!isValid) {
      return NextResponse.json({ error }, { status: 401 });
    }
    return handler(request, { ...rest });
  };
}
