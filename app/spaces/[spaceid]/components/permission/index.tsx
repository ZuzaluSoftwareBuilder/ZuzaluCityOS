'use client';
import { useCeramicContext } from '@/context/CeramicContext';
import { PermissionName } from '@/types';
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAllPermission } from '@/services/permission';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';

interface SpacePermissionContextType {
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  checkPermission: (name: PermissionName) => boolean;
}

const SpacePermissionContext = createContext<
  SpacePermissionContextType | undefined
>(undefined);

export const SpacePermissionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const spaceId = useParams().spaceid;
  const { profile } = useCeramicContext();

  const { owner, roles, members } = useGetSpaceMember(spaceId as string);

  const { data: permissionsData } = useQuery({
    queryKey: ['getAllPermission'],
    queryFn: getAllPermission,
  });

  const isOwner = useMemo(() => {
    if (!owner || !profile?.author?.id) return false;
    return owner?.id === profile?.author?.id;
  }, [owner, profile]);

  const userRole = useMemo(() => {
    if (!members || !profile?.author?.id) return null;
    const userMember = members.find(
      (member) => member.userId.zucityProfile.id === profile?.author?.id,
    );

    if (!userMember) return null;

    let roleId = null;
    userMember.customAttributes.some((attr) => {
      if (!attr || !('tbd' in attr)) return false;

      try {
        const parsedAttr = JSON.parse(attr.tbd);
        if (parsedAttr.key === 'roleId' && parsedAttr.value) {
          roleId = parsedAttr.value;
          return true;
        }
        return false;
      } catch {
        return false;
      }
    });

    return roleId;
  }, [members, profile]);

  const isAdmin = useMemo(() => {
    if (!members || !profile?.author?.id || !roles?.data) return false;

    const adminRoleData = roles.data.find(
      (role) => role.role.level === 'admin',
    );

    if (!adminRoleData) return false;

    return userRole === adminRoleData.role.id;
  }, [members, profile?.author?.id, roles?.data, userRole]);

  const isMember = useMemo(() => {
    if (!members || !profile?.author?.id || !roles?.data) return false;

    const memberRoleData = roles.data.find(
      (role) => role.role.level === 'member',
    );

    if (!memberRoleData) return false;

    return userRole === memberRoleData.role.id;
  }, [members, profile?.author?.id, roles?.data, userRole]);

  const checkPermission = useCallback(
    (name: PermissionName): boolean => {
      if (isOwner) return true;
      if (!permissionsData?.data || !userRole) return false;

      const permissionData = permissionsData.data.find(
        (permission) => permission.name === name,
      );

      if (!permissionData) return false;

      const rolePermissions = roles?.data.find(
        (role) => role.role.id === userRole,
      );

      return (
        rolePermissions?.permission_ids.includes(permissionData.id) || false
      );
    },
    [isOwner, permissionsData, userRole, roles?.data],
  );

  const value = {
    isOwner,
    isAdmin,
    isMember,
    checkPermission,
  };

  return (
    <SpacePermissionContext.Provider value={value}>
      {children}
    </SpacePermissionContext.Provider>
  );
};

export const useSpacePermissions = () => {
  const context = useContext(SpacePermissionContext);
  if (context === undefined) {
    throw new Error(
      'useSpacePermissions must be used within a SpacePermissionProvider',
    );
  }
  return context;
};
