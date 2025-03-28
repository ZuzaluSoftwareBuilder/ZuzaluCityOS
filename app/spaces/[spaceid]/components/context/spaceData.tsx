'use client';
import { Space } from '@/types';
import React, { createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_QUERY_BY_ID } from '@/services/graphql/space';

interface SpaceDataContextType {
  isSpaceDataLoading: boolean;
  spaceData?: Space;
  refreshSpaceData: () => void;
}

const SpaceDataContext = createContext<SpaceDataContextType | undefined>(
  undefined,
);

export const SpaceDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const spaceId = useParams().spaceid;

  const { data, isLoading, refetch } = useGraphQL(
    ['GET_SPACE_QUERY', spaceId],
    GET_SPACE_QUERY_BY_ID,
    {
      id: spaceId as string,
    },
    {
      select: (data) => {
        return data?.data.node as Space;
      },
    },
  );

  const value = {
    isSpaceDataLoading: isLoading,
    spaceData: data,
    refreshSpaceData: refetch,
  };

  return (
    <SpaceDataContext.Provider value={value}>
      {children}
    </SpaceDataContext.Provider>
  );
};

export const useSpaceData = () => {
  const context = useContext(SpaceDataContext);
  if (context === undefined) {
    throw new Error('useSpaceData must be used within a SpaceDataProvider');
  }
  return context;
};
