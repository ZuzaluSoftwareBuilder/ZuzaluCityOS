import { NextRequest, NextResponse } from 'next/server';
import { DIDSession } from 'did-session';
import { supabase } from './supabase/client';
import { Permission, UserRole, Space, RolePermission } from '@/types';
import { CHECK_EXISTING_ROLE_QUERY } from '@/services/graphql/role';
import { GET_SPACE_QUERY_BY_ID } from '@/services/graphql/space';
import { executeQuery } from './ceramic';

export type SessionCheckResult = {
  isValid: boolean;
  operatorId?: string;
  isOwner?: boolean;
  permission?: Permission[];
  role?: RolePermission[];
  operatorRole?: RolePermission;
  error?: string;
};

export type BasicSessionCheckResult = {
  isValid: boolean;
  operatorId?: string;
  error?: string;
};

async function validateSession(request: Request): Promise<SessionCheckResult> {
  try {
    const sessionStr = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');

    let didSession;
    if (sessionStr) {
      try {
        didSession = (await DIDSession.fromSession(sessionStr)) as any;
      } catch (error) {
        return { isValid: false, error: 'Invalid DID session format' };
      }
    }

    if (didSession && didSession.isExpired) {
      return { isValid: false, error: 'Unauthorized: DID session expired' };
    }

    const body = await request.json();
    const { id, resource } = body;

    if (!id || !resource) {
      return {
        isValid: false,
        error: 'Missing required parameters: id and resource are required',
      };
    }

    const operatorId = didSession.did._parentId;
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
      const spaceResult = await executeQuery(GET_SPACE_QUERY_BY_ID, {
        id,
      });

      const space = spaceResult.data?.node as Space;
      const isOwner = space.owner?.zucityProfile.author?.id === operatorId;
      if (isOwner) {
        return {
          isValid: true,
          operatorId,
          isOwner: true,
          role: rolePermissionResult as RolePermission[],
        };
      }
    }

    const [permissionResult, userRolesResult] = await Promise.all([
      supabase.from('permission').select('*'),
      executeQuery(CHECK_EXISTING_ROLE_QUERY, {
        userId: operatorId,
        resourceId: id,
        resource: resource,
      }),
    ]);

    const userRolesData =
      userRolesResult.data?.zucityUserRolesIndex?.edges?.map(
        (edge) => edge?.node,
      ) as UserRole[];

    const operatorRole = userRolesData.find(
      (item) => item.userId.zucityProfile.author?.id === operatorId,
    );

    if (!operatorRole) {
      return { isValid: false, error: 'Operator not found' };
    }

    return {
      isValid: true,
      operatorId,
      isOwner: false,
      permission: permissionResult.data as Permission[],
      role: rolePermissionResult as RolePermission[],
      operatorRole: rolePermissionResult?.find(
        (role) => role.role.id === operatorRole.roleId,
      ),
    };
  } catch (error) {
    console.error('Error validating session:', error);
    return { isValid: false, error: 'Session validation failed' };
  }
}

async function validateBasicSession(
  request: Request,
): Promise<BasicSessionCheckResult> {
  try {
    const sessionStr = request.headers
      .get('Authorization')
      ?.replace('Bearer ', '');

    if (!sessionStr) {
      return { isValid: false, error: 'No session provided' };
    }

    let didSession;
    try {
      didSession = (await DIDSession.fromSession(sessionStr)) as any;
    } catch (error) {
      return { isValid: false, error: 'Invalid DID session format' };
    }

    if (didSession.isExpired) {
      return { isValid: false, error: 'Unauthorized: DID session expired' };
    }

    const operatorId = didSession.did._parentId;
    if (!operatorId) {
      return { isValid: false, error: 'No operator ID found in session' };
    }

    return {
      isValid: true,
      operatorId,
    };
  } catch (error) {
    console.error('Error validating basic session:', error);
    return { isValid: false, error: 'Session validation failed' };
  }
}

export function withSessionValidation(
  handler: (
    request: NextRequest,
    sessionData: Omit<SessionCheckResult, 'isValid' | 'error'>,
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

export function withBasicSessionValidation(
  handler: (
    request: NextRequest,
    sessionData: Omit<BasicSessionCheckResult, 'isValid' | 'error'>,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest) => {
    const clonedRequest = request.clone();
    const sessionCheck = await validateBasicSession(clonedRequest);
    const { isValid, error, ...rest } = sessionCheck;

    if (!isValid) {
      return NextResponse.json({ error }, { status: 401 });
    }

    return handler(request, { ...rest });
  };
}
