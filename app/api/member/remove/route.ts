import { NextResponse } from 'next/server';
import { withSessionValidation } from '@/utils/authMiddleware';
import { PermissionName } from '@/types';
import { dayjs } from '@/utils/dayjs';
import utc from 'dayjs/plugin/utc';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import {
  CHECK_EXISTING_ROLE_QUERY,
  DELETE_ROLE_QUERY,
} from '@/services/graphql/role';

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

    const existingRoleResult = await executeQuery(CHECK_EXISTING_ROLE_QUERY, {
      userId,
      resourceId: id,
      resource,
    });

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

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return NextResponse.json(
        { error: 'Error getting private key' },
        { status: 500 },
      );
    }

    const result = await executeQuery(DELETE_ROLE_QUERY, {
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
