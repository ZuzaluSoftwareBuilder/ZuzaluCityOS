import { NextResponse } from 'next/server';
import { withSessionValidation } from '@/utils/authMiddleware';
import { PermissionName } from '@/types';
import { dayjs } from '@/utils/dayjs';
import { ceramic, composeClient } from '@/constant';
import utc from 'dayjs/plugin/utc';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { base64ToUint8Array } from '@/utils';
import { supabase } from '@/utils/supabase/client';

dayjs.extend(utc);

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const { id, resource, roleId, userId } = body;

    if (!id || !resource || !roleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { isOwner, permission, role, operatorRole } = sessionData;

    const addedRole = role?.find((r) => r.role.id === roleId);
    if (!addedRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (addedRole.role.level === 'owner') {
      return NextResponse.json(
        { error: 'Owner role cannot be added' },
        { status: 400 },
      );
    }

    const needPermission =
      addedRole.role.level === 'admin'
        ? PermissionName.MANAGE_ADMIN_ROLE
        : PermissionName.MANAGE_MEMBER_ROLE;

    const hasPermission =
      isOwner ||
      operatorRole?.permission_ids.includes(
        permission?.find((p) => p.name === needPermission)?.id || '',
      );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const CHECK_EXISTING_ROLE_QUERY = `
      query GetUserRole($userId: String, $resourceId: String, $resource: String) {
        zucityUserRolesIndex(
          first: 1,        
          filters: { 
            where: { 
              userId: { equalTo: $userId },
              resourceId: { equalTo: $resourceId },
              source: { equalTo: $resource }
            }
          }
        ) {
          edges {
            node {
              roleId
            }
          }
        }
      }
    `;

    const existingRoleResult = await composeClient.executeQuery(
      CHECK_EXISTING_ROLE_QUERY,
      {
        userId,
        resourceId: id,
        resource,
      },
    );

    const data = existingRoleResult.data as any;
    const existingRoles = (data?.zucityUserRolesIndex?.edges as []) || [];

    if (existingRoles.length > 0) {
      return NextResponse.json(
        { error: 'User already has role for this resource' },
        { status: 409 },
      );
    }

    const Create_QUERY = `
      mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {
        createZucityUserRoles(
          input: $input
        ) {
          document {
            userId {
              id
            }
            created_at
            updated_at
            resourceId
            source
            roleId
          }
        }
      }
      `;
    const { data: spaceAgentData, error: spaceAgentError } = await supabase
      .from('spaceAgent')
      .select('agentKey')
      .eq('spaceId', id)
      .single();
    if (spaceAgentError) {
      console.error('Error getting private key:', spaceAgentError);
      return new NextResponse('Error getting private key', { status: 500 });
    }
    const seed = base64ToUint8Array(spaceAgentData.agentKey);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    await did.authenticate();
    ceramic.did = did;
    composeClient.setDID(did);
    const result = await composeClient.executeQuery(Create_QUERY, {
      input: {
        content: {
          userId,
          resourceId: id,
          source: resource,
          created_at: dayjs().utc().toISOString(),
          updated_at: dayjs().utc().toISOString(),
          roleId,
        },
      },
    });

    if (result.errors) {
      return NextResponse.json(
        { error: 'Failed to add member', details: result.errors },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'Member added' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
});
