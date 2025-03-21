import { NextResponse } from 'next/server';
import { withSessionValidation } from '@/utils/authMiddleware';
import { PermissionName } from '@/types';
import { dayjs } from '@/utils/dayjs';
import { composeClient } from '@/constant';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { CHECK_EXISTING_ROLE_QUERY, UPDATE_ROLE_QUERY } from '@/services/graphql/role';

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

    const newRole = role?.find((r) => r.role.id === roleId);
    if (!newRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    if (newRole.role.level === 'owner') {
      return NextResponse.json(
        { error: 'Cannot update to owner role' },
        { status: 400 },
      );
    }

    const needPermission =
      newRole.role.level === 'admin'
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
    const currentRoleId = userExistingRole.node.roleId;
    const userRoleDocId = userExistingRole.node.id;

    if (currentRoleId === roleId) {
      return NextResponse.json(
        { message: 'Role is already set to the requested role' },
        { status: 200 },
      );
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return NextResponse.json(
        { error: 'Error getting private key' },
        { status: 500 },
      );
    }

    const result = await composeClient.executeQuery(UPDATE_ROLE_QUERY, {
      input: {
        id: userRoleDocId,
        content: {
          roleId,
          updated_at: dayjs().utc().toISOString(),
        },
      },
    });

    if (result.errors) {
      return NextResponse.json(
        { error: 'Failed to update member role', details: result.errors },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: 'Member role updated' },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
});
