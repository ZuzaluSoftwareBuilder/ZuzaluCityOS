'use client';

import { RolePermission } from '@/models/role';
import { getAllPermission } from '@/services/permission';
import { Skeleton, Switch } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface PermissionItemProps {
  title: string;
  checked?: boolean;
  className?: string;
}

const PermissionItem = ({ title, checked, className }: PermissionItemProps) => {
  return (
    <div
      className={`flex w-full flex-col justify-center gap-1 border-b border-white/10 pb-2.5 ${className}`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-[5px]">
        <div className="flex w-full flex-row items-center justify-between">
          <span className="text-base font-semibold leading-[1.4] text-white">
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

export const PermissionListSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      <Skeleton className="h-4 w-32 rounded-md" />
      <div className="flex w-full flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`flex w-full flex-col justify-center gap-1 border-b border-white/10 pb-2.5 ${
              index === 5 ? 'border-b-0' : ''
            }`}
          >
            <div className="flex w-full flex-col items-center justify-center gap-[5px]">
              <div className="flex w-full flex-row items-center justify-between">
                <Skeleton className="h-6 w-48 rounded-md bg-white/10" />
                <Skeleton className="h-5 w-10 rounded-md bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
    <div className="mt-5 flex w-full flex-col gap-10">
      {isLoading || roleDataLoading ? (
        <PermissionListSkeleton />
      ) : groupedPermissions && Object.keys(groupedPermissions).length > 0 ? (
        Object.entries(groupedPermissions).map(([resource, permissions]) => {
          const permissionArray = Array.isArray(permissions) ? permissions : [];
          return (
            <div key={resource} className="flex w-full flex-col gap-5">
              <span className="w-full text-sm font-semibold leading-[1.2em] text-white/60">
                {resource}
              </span>
              <div className="flex w-full flex-col gap-2.5">
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
