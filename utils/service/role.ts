import { Permission, RolePermission, PermissionName } from '@/types';

type SessionData = {
  isOwner?: boolean;
  permission?: Permission[];
  role?: RolePermission[];
  operatorRole?: RolePermission;
  operatorId?: string;
};

function hasRequiredPermission(sessionData: SessionData, roleLevel: string) {
  const { isOwner, permission, operatorRole } = sessionData;

  if (isOwner) return true;

  const requiredPermission =
    roleLevel === 'admin'
      ? PermissionName.MANAGE_ADMIN_ROLE
      : PermissionName.MANAGE_MEMBER_ROLE;

  const permissionId =
    permission?.find((p: Permission) => p.name === requiredPermission)?.id ||
    '';

  return !!operatorRole?.permission_ids.includes(permissionId);
}

export { hasRequiredPermission };
