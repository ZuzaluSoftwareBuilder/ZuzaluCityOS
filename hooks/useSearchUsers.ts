import { useState, useEffect, useCallback } from 'react';
import useDebounce from './useDebounce';
import { useCeramicContext } from '@/context/CeramicContext';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { GET_PROFILE_BY_NAME_QUERY } from '@/services/graphql/profile';
import { IProfile } from '@/types';

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
  const { composeClient } = useCeramicContext();
  const { chainId } = useAccount();

  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchByWalletAddress = useCallback(
    async (address: string): Promise<SearchUser[]> => {
      const normalizedAddress = address.startsWith('0x')
        ? address.toLowerCase()
        : `0x${address}`.toLowerCase();
      const currentChainId = chainId || 1;
      const did = `did:pkh:eip155:${currentChainId}:${normalizedAddress}`;
      console.log('did', did);

      // TODO did search not done
      const query = `
        query GetProfilesForDIDSearch {
          zucityProfileIndex(
            first: 1,
            filters: {
              where: {
                author: { id: { equalTo: "${did}" } }
              }
            }
          ) {
            edges {
              node {
                id
                username
                avatar
                author {
                  id
                }
              }
            }
          }
        }
      `;

      const response: any = await composeClient.executeQuery(query);

      if (response.errors) {
        throw new Error(response.errors[0].message || '查询用户失败');
      }

      if (response.data?.zucityProfileIndex?.edges?.length > 0) {
        const filteredProfiles = response.data.zucityProfileIndex.edges
          .filter((edge: any) => edge.node.author?.id === did)
          .map((edge: any) => {
            const authorId = edge.node.author?.id || '';
            const extractedAddress = authorId.includes(':')
              ? authorId.split(':')[4] || normalizedAddress
              : normalizedAddress;

            return {
              id: edge.node.id,
              username: edge.node.username || '',
              avatar: edge.node.avatar || '/user/avatar_p.png',
              address: extractedAddress,
            };
          });

        return filteredProfiles;
      }

      return [];
    },
    [chainId, composeClient],
  );

  const searchByUsername = useCallback(
    async (username: string): Promise<SearchUser[]> => {
      const response = await composeClient.executeQuery<IProfile>(
        GET_PROFILE_BY_NAME_QUERY,
        {
          username,
        },
      );

      if (response.errors) {
        throw new Error(response.errors[0].message || '搜索用户失败');
      }

      if ('zucityProfileIndex' in response.data!) {
        const profileData: IProfile = response.data as IProfile;
        return profileData.zucityProfileIndex.edges.map((edge: any) => {
          const authorId = edge.node.author?.id || '';
          const address = authorId.includes(':')
            ? authorId.split(':')[4] || authorId
            : authorId;

          return {
            id: edge.node.id,
            username: edge.node.username || '',
            avatar: edge.node.avatar || '/user/avatar_p.png',
            address,
            did: authorId,
          };
        });
      }

      return [];
    },
    [composeClient],
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
