import { Permission, PermissionName, RolePermission } from '@/types';

type SessionData = {
  isOwner?: boolean;
  permission?: Permission[];
  role?: RolePermission[];
  operatorRole?: RolePermission;
  operatorId?: string;
};

function hasRequiredPermission(
  sessionData: SessionData,
  permissionName: PermissionName,
) {
  const { isOwner, permission, operatorRole } = sessionData;

  if (isOwner) return true;

  const permissionId =
    permission?.find((p: Permission) => p.name === permissionName)?.id || '';

  return !!operatorRole?.permission_ids.includes(permissionId);
}

export { hasRequiredPermission };
