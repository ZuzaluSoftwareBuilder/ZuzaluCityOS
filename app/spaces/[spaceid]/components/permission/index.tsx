'use client';
import { getSpaceEventsQuery } from '@/services/space';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, PermissionName } from '@/types';
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAllPermission } from '@/services/permission';

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
  const { profile, composeClient } = useCeramicContext();

  const { data: spaceData } = useQuery({
    queryKey: ['getSpaceByID', spaceId],
    queryFn: () => {
      return composeClient.executeQuery(getSpaceEventsQuery(), {
        id: spaceId,
      });
    },
    select: (data) => {
      return data?.data?.node as Space;
    },
  });

  const { data: permissionsData } = useQuery({
    queryKey: ['getAllPermission'],
    queryFn: getAllPermission,
  });

  const isOwner = useMemo(() => {
    return !!spaceData?.superAdmin?.some(
      (admin) => admin.id === profile?.author?.id,
    );
  }, [spaceData, profile]);

  const isAdmin = useMemo(() => {
    return !!spaceData?.admins?.some(
      (admin) => admin.id === profile?.author?.id,
    );
  }, [spaceData, profile]);

  const isMember = useMemo(() => {
    return !!spaceData?.members?.some(
      (member) => member.id === profile?.author?.id,
    );
  }, [spaceData, profile]);

  const checkPermission = useCallback(
    (name: PermissionName) => {
      const permissionData = permissionsData?.data?.find(
        (permission) => permission.name === name,
      );
      // 检查用户自身的权限是否有这个 id
      return true;
    },
    [isOwner, isAdmin, isMember],
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
