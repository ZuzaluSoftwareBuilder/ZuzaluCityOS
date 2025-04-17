import { getProfileRepository } from '@/repositories/profile';
import { IProfileRepository } from '@/repositories/profile/type';
import React, { createContext, useContext, useMemo } from 'react';

interface RepositoryContextValue {
  profileRepository: IProfileRepository;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const profileRepository = useMemo(() => getProfileRepository('supabase'), []);

  const value = {
    profileRepository,
  };

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepositories = (): RepositoryContextValue => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return context;
};
