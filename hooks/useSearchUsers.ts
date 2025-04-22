import { useRepositories } from '@/context/RepositoryContext';
import { useCallback, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';
import useDebounce from './useDebounce';

export interface SearchUser {
  id: string;
  username: string;
  avatar: string;
  address: string;
  did: string;
}

export function useSearchUsers(initialQuery = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchedUsers, setSearchedUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { chainId } = useAccount();
  const { profileRepository } = useRepositories();

  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchByWalletAddress = useCallback(
    async (address: string): Promise<SearchUser[]> => {
      try {
        const profile = await profileRepository.getProfileByAddress(
          address,
          chainId!,
        );
        if (!profile) {
          return [];
        }

        const user: SearchUser = {
          ...profile,
          avatar: profile.avatar || '/user/avatar_p.png',
        };
        return [user];
      } catch (error) {
        console.error('searchByWalletAddress error:', error);
        throw error;
      }
    },
    [chainId, profileRepository],
  );

  const searchByUsername = useCallback(
    async (username: string): Promise<SearchUser[]> => {
      try {
        const profiles = await profileRepository.getProfileByUsername(
          username,
          chainId!,
        );

        return profiles.map((profile) => ({
          ...profile,
          avatar: profile.avatar || '/user/avatar_p.png',
        }));
      } catch (error) {
        console.error('searchByUsername error:', error);
        throw error;
      }
    },
    [profileRepository],
  );

  const searchUsers = useCallback(
    async (query: string) => {
      if (!query || query.trim().length === 0) {
        setSearchedUsers([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let results: SearchUser[] = [];

        if (isAddress(query)) {
          results = await searchByWalletAddress(query);
        } else {
          results = await searchByUsername(query);
        }

        setSearchedUsers(results);
      } catch (error) {
        console.error('search user error:', error);
        setError(
          error instanceof Error ? error.message : 'error in search process',
        );
        setSearchedUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchByUsername, searchByWalletAddress],
  );

  useEffect(() => {
    if (debouncedQuery) {
      searchUsers(debouncedQuery);
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedQuery, searchUsers]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchedUsers([]);
    setError(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchedUsers,
    isLoading,
    error,
    clearSearch,
  };
}
