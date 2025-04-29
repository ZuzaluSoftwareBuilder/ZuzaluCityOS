'use client';
import { useRepositories } from '@/context/RepositoryContext';
import { Space } from '@/models/space';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { createContext, useContext } from 'react';

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
  const spaceId = useParams().spaceid as string;
  const { spaceRepository } = useRepositories();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['GET_SPACE_QUERY_BY_ID', spaceId],
    queryFn: () => spaceRepository.getById(spaceId),
    select: (data) => {
      if (!data?.data) {
        return undefined;
      }
      return data.data;
    },
    enabled: !!spaceId,
  });
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
