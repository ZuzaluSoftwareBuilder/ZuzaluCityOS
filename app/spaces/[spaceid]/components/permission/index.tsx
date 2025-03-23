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
  const userId = profile?.author?.id;

  const { owner, roles, members } = useGetSpaceMember(spaceId as string);

  const { data: permissionsData } = useQuery({
    queryKey: ['getAllPermission'],
    queryFn: getAllPermission,
  });

  const isOwner = useMemo(() => {
    if (!owner || !userId) return false;
    return owner?.author?.id === userId;
  }, [owner, userId]);

  const userRole = useMemo(() => {
    if (!members || !userId) return null;
    const userMember = members.find(
      (member) => member.userId.zucityProfile?.id === userId,
    );

    if (!userMember) return null;

    return userMember.roleId;
  }, [members, userId]);

  const isAdmin = useMemo(() => {
    if (!members || !userId || !roles?.data) return false;

    const adminRoleData = roles.data.find(
      (role) => role.role.level === 'admin',
    );

    if (!adminRoleData) return false;

    return userRole === adminRoleData.role.id;
  }, [members, userId, roles?.data, userRole]);

  const isMember = useMemo(() => {
    if (!members || !userId || !roles?.data) return false;

    const memberRoleData = roles.data.find(
      (role) => role.role.level === 'member',
    );

    if (!memberRoleData) return false;

    return userRole === memberRoleData.role.id;
  }, [members, userId, roles?.data, userRole]);

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
