import { NextRequest, NextResponse } from 'next/server';
import { DIDSession } from 'did-session';
import { composeClient } from '@/constant';
import { supabase } from './supabase/client';
import { Permission, UserRole, Space, RolePermission } from '@/types';
import { getSpaceEventsQuery } from '@/services/space';

export type SessionCheckResult = {
  isValid: boolean;
  userId?: string;
  isOwner?: boolean;
  permission?: Permission[];
  role?: RolePermission[];
  userRole?: UserRole;
  error?: string;
};

async function validateSession(request: Request): Promise<SessionCheckResult> {
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

  const userId = didSession.did._parentId;
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
    const spaceResult = await composeClient.executeQuery(
      getSpaceEventsQuery(),
      {
        id: id,
      },
    );
    const space = spaceResult.data?.node as Space;
    const isOwner = space.superAdmin?.some(
      (admin) => admin.zucityProfile.author?.id === userId,
    );
    if (isOwner) {
      return {
        isValid: true,
        userId,
        isOwner: true,
        role: rolePermissionResult as RolePermission[],
      };
    }
  }

  const [permissionResult, userRolesResult] = await Promise.all([
    supabase.from('permission').select('*'),
    composeClient.executeQuery(
      `
        query MyQuery {
          zucityUserRolesIndex(
            first: 1,
            filters: {
              where: {
                resourceId: { equalTo: "${id}" }
                source: { equalTo: "${resource}" }
                userId: { equalTo: "${userId}" }
            }
          ) {
            edges {
              node {
                roleId
                userId {
                  zucityProfile {
                    avatar
                    author {
                      id
                    }
                  }
                }
              }
            }
          }
        }
        `,
    ),
  ]);

  const userRolesData = (
    userRolesResult as any
  ).data?.zucityUserRolesIndex?.edges?.map((edge: any) => edge.node);

  const userRole = userRolesData.find(
    (item: any) => item.userId.zucityProfile.author?.id === userId,
  );

  if (!userRole) {
    return { isValid: false, error: 'User not found' };
  }

  return {
    isValid: true,
    userId: didSession?.did._parentId,
    isOwner: false,
    permission: permissionResult.data as Permission[],
    role: rolePermissionResult as RolePermission[],
    userRole,
  };
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
