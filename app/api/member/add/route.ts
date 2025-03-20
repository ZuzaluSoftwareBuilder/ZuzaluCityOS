import { NextResponse } from 'next/server';
import { withSessionValidation } from '@/utils/authMiddleware';
import { PermissionName } from '@/types';
import { dayjs } from '@/utils/dayjs';
import { composeClient } from '@/constant';
import utc from 'dayjs/plugin/utc';

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

    const { isOwner, permission, role, userRole } = sessionData;

    const userCurrentRole = role?.find((r) => r.role.id === userRole?.roleId);
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
      addedRole.permission_ids.includes(
        permission?.find((p) => p.name === needPermission)?.id || '',
      );

    if (!hasPermission) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // 检查用户是否已有相同角色
    const CHECK_EXISTING_ROLE_QUERY = `
      query GetUserRole($userId: ID, $resourceId: ID) {
        zucityUserRolesIndex(
          filters: { 
            where: { 
              userId: { equalTo: $userId },
              resourceId: { equalTo: $resourceId }
            }
          }
        ) {
          edges {
            node {
              id
              customAttributes {
                tbd
              }
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
      },
    );

    if (existingRoleResult.errors) {
      return NextResponse.json(
        {
          error: 'Error checking existing roles',
          details: existingRoleResult.errors,
        },
        { status: 500 },
      );
    }

    // 使用更保守的类型处理
    type RoleEdge = {
      node: {
        id: string;
        customAttributes: Array<{ tbd: string }>;
      };
    };

    // 使用类型断言处理查询结果
    const data = existingRoleResult.data as any;
    const existingRoles =
      (data?.zucityUserRolesIndex?.edges as RoleEdge[]) || [];
    const hasExistingRole = existingRoles.some((edge: RoleEdge) => {
      const attributes = edge.node.customAttributes || [];
      return attributes.some((attr: { tbd: string }) => {
        try {
          const parsed = JSON.parse(attr.tbd);
          return parsed.key === 'roleId' && parsed.value === roleId;
        } catch (e) {
          return false;
        }
      });
    });

    if (hasExistingRole) {
      return NextResponse.json(
        { error: 'User already has this role for this resource' },
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
            customAttributes {
              tbd
            }
            roleId
          }
        }
      }
      `;

    const result = await composeClient.executeQuery(Create_QUERY, {
      input: {
        content: {
          userId,
          resourceId: id,
          source: resource,
          customAttributes: [
            {
              tbd: JSON.stringify({
                key: 'roleId',
                value: roleId,
              }),
            },
          ],
          created_at: dayjs().utc().toISOString(),
          updated_at: dayjs().utc().toISOString(),
          roleId: roleId, // 使用传入的roleId，而非硬编码值
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
