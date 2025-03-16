'use client';

import { useMemo } from 'react';
import { Switch } from '@heroui/react';
import { getAllPermission } from '@/services/permission';
import { useQuery } from '@tanstack/react-query';
import { RolePermission } from '@/types';

interface PermissionItemProps {
  title: string;
  checked?: boolean;
  className?: string;
}

const PermissionItem = ({ title, checked, className }: PermissionItemProps) => {
  return (
    <div
      className={`flex flex-col justify-center gap-1 w-full pb-2.5 border-b border-white/10 ${className}`}
    >
      <div className="flex flex-col justify-center items-center w-full gap-[5px]">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="text-white font-semibold text-base leading-[1.4]">
            {title}
          </span>
          <Switch
            size="sm"
            color="success"
            isSelected={checked}
            isDisabled
            checked={checked}
          />
        </div>
      </div>
    </div>
  );
};

interface PermissionProps {
  roleData: RolePermission[];
  roleDataLoading: boolean;
  roleName: string;
}

const formatString = (str: string) => {
  return str
    .replace(/[._]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const PermissionList = ({
  roleData,
  roleDataLoading,
  roleName,
}: PermissionProps) => {
  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ['getAllPermission'],
    queryFn: getAllPermission,
  });

  const groupedPermissions = useMemo(() => {
    const acc: Record<string, any[]> = {};
    const role = roleData.find((role) => role.role.name === roleName);
    const isOwnerPermission = role?.role.level === 'owner';
    permissionsData?.data?.forEach((permission) => {
      const formattedResource = formatString(permission.resource);
      const formattedName = formatString(permission.name);

      if (!acc[formattedResource]) {
        acc[formattedResource] = [];
      }

      acc[formattedResource].push({
        id: permission.id,
        title: formattedName,
        checked: isOwnerPermission
          ? true
          : role?.permission_ids.includes(permission.id),
        originalData: permission,
      });
    });

    return acc;
  }, [permissionsData?.data, roleData, roleName]);

  return (
    <div className="flex flex-col gap-5 w-full mt-5">
      {isLoading || roleDataLoading ? (
        <div className="text-white text-center py-4">加载权限中...</div>
      ) : groupedPermissions && Object.keys(groupedPermissions).length > 0 ? (
        Object.entries(groupedPermissions).map(([resource, permissions]) => {
          const permissionArray = Array.isArray(permissions) ? permissions : [];
          return (
            <div key={resource} className="flex flex-col gap-5 w-full">
              <span className="text-white/60 font-semibold text-sm leading-[1.2em] w-full">
                {resource}
              </span>
              <div className="flex flex-col gap-2.5 w-full">
                {permissionArray.map((permission, index) => (
                  <PermissionItem
                    key={permission.id}
                    title={permission.title}
                    checked={permission.checked}
                    className={
                      index === permissionArray.length - 1 ? 'border-b-0' : ''
                    }
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : null}
    </div>
  );
};

export default PermissionList;
