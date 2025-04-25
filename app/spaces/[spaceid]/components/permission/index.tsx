'use client';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { getAllPermission } from '@/services/permission';
import { PermissionName } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useMemo } from 'react';

interface SpacePermissionContextType {
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isLoading: boolean;
  checkPermission: (_name: PermissionName) => boolean;
}

const SpacePermissionContext = createContext<
  SpacePermissionContextType | undefined
>(undefined);

export const SpacePermissionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const spaceId = useParams().spaceid;
  const { profile } = useAbstractAuthContext();
  // TODO wait supabase update, confirm did of permission
  const userId = profile?.did;

  const { owner, roles, members, isLoading } = useGetSpaceMember(
    spaceId as string,
  );

  const { data: permissionsData } = useQuery({
    queryKey: ['getAllPermission'],
    queryFn: getAllPermission,
  });

  const isOwner = useMemo(() => {
    if (!owner || !userId) return false;
    return owner?.id === userId;
  }, [owner, userId]);

  const userRoleId = useMemo(() => {
    if (!members || !userId) return null;
    const userMember = members.find((member) => member.userId?.id === userId);

    if (!userMember) return null;

    return userMember.roleId;
  }, [members, userId]);

  const isAdmin = useMemo(() => {
    if (!members || !userId || !roles?.data) return false;

    const adminRoleData = roles.data.find(
      (role) => role.role.level === 'admin',
    );

    if (!adminRoleData) return false;

    return userRoleId === adminRoleData.role.id;
  }, [members, userId, roles?.data, userRoleId]);

  const isMember = useMemo(() => {
    if (!members || !userId || !roles?.data) return false;

    const memberRoleData = roles.data.find(
      (role) => role.role.level === 'member',
    );

    if (!memberRoleData) return false;

    return userRoleId === memberRoleData.role.id;
  }, [members, userId, roles?.data, userRoleId]);

  const checkPermission = useCallback(
    (name: PermissionName): boolean => {
      if (isOwner) return true;
      if (!permissionsData?.data || !userRoleId) return false;

      const permissionData = permissionsData.data.find(
        (permission) => permission.name === name,
      );

      if (!permissionData) return false;

      const rolePermissions = roles?.data.find(
        (role) => role.role.id === userRoleId,
      );

      return (
        rolePermissions?.permission_ids.includes(permissionData.id) || false
      );
    },
    [isOwner, permissionsData, userRoleId, roles?.data],
  );

  const value = {
    isOwner,
    isAdmin,
    isMember,
    isLoading,
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
