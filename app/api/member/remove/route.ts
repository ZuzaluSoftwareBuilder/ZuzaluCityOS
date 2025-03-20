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
    const { id, resource, userId } = body;

    if (!id || !resource || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const { isOwner, permission, role, operatorRole } = sessionData;

    console.log(operatorRole);

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
              id
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
    const existingRoles = (data?.zucityUserRolesIndex?.edges || []) as any[];

    if (existingRoles.length === 0) {
      return NextResponse.json(
        { error: 'User does not have a role for this resource' },
        { status: 404 },
      );
    }

    const userExistingRole = existingRoles[0];
    const roleId = userExistingRole.node.roleId;
    const userRoleId = userExistingRole.node.id;

    const removedRole = role?.find((r) => r.role.id === roleId);

    if (!removedRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (removedRole.role.level === 'owner') {
      return NextResponse.json(
        { error: 'Owner role cannot be removed' },
        { status: 400 },
      );
    }

    const needPermission =
      removedRole.role.level === 'admin'
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

    const DELETE_QUERY = `
      mutation enableIndexingZucityUserRoles($input: EnableIndexingZucityUserRolesInput!) {
        enableIndexingZucityUserRoles(input: $input) {
          document {
            id
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

    const result = await composeClient.executeQuery(DELETE_QUERY, {
      input: {
        id: userRoleId,
        shouldIndex: false,
      },
    });

    if (result.errors) {
      return NextResponse.json(
        { error: 'Failed to remove member', details: result.errors },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'Member removed' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
});
