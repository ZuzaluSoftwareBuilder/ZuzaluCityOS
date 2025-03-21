import { useState, useEffect, useCallback } from 'react';
import useDebounce from './useDebounce';
import { useCeramicContext } from '@/context/CeramicContext';
import { useAccount } from 'wagmi';

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
  const { chainId, chain } = useAccount();

  const debouncedQuery = useDebounce(searchQuery, 300);

  const isWalletAddress = (query: string): boolean => {
    return /^(0x)?[0-9a-fA-F]{1,40}$/.test(query);
  };

  const searchByWalletAddress = async (address: string): Promise<SearchUser[]> => {
    const normalizedAddress = address.startsWith('0x') ? address.toLowerCase() : `0x${address}`.toLowerCase();
    const currentChainId = chainId || 1;
    const did = `did:pkh:eip155:${currentChainId}:${normalizedAddress}`;
    console.log('did', did);

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
          const extractedAddress = authorId.includes(':') ?
            authorId.split(':')[4] || normalizedAddress : normalizedAddress;

          return {
            id: edge.node.id,
            username: edge.node.username || '',
            avatar: edge.node.avatar || '/user/avatar_p.png',
            address: extractedAddress
          };
        });

      return filteredProfiles;
    }

    return [];
  };

  const searchByUsername = async (username: string): Promise<SearchUser[]> => {

    const query = `
      query SearchByExactUsername {
        zucityProfileIndex(
          first: 20,
          filters: { 
            where: { 
              username: { equalTo: "${username}" }
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
      throw new Error(response.errors[0].message || '搜索用户失败');
    }

    if (response.data?.zucityProfileIndex?.edges?.length > 0) {
      return response.data.zucityProfileIndex.edges.map((edge: any) => {
        console.log('edge', edge);
        const authorId = edge.node.author?.id || '';
        const address = authorId.includes(':') ?
          authorId.split(':')[4] || authorId : authorId;

        return {
          id: edge.node.id,
          username: edge.node.username || '',
          avatar: edge.node.avatar || '/user/avatar_p.png',
          address,
          did: authorId
        };
      });
    }

    return [];
  };

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.trim().length === 0) {
      setSearchedUsers([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let results: SearchUser[] = [];

      if (isWalletAddress(query)) {
        results = await searchByWalletAddress(query);
      } else {
        results = await searchByUsername(query);
      }

      setSearchedUsers(results);
    } catch (error) {
      console.error('search user error:', error);
      setError(error instanceof Error ? error.message : '搜索过程中出现错误');
      setSearchedUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [composeClient, chainId]);

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
