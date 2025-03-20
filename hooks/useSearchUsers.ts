import { useState, useEffect, useCallback } from 'react';
import useDebounce from './useDebounce';

export interface SearchUser {
  id: string;
  username: string;
  avatar: string;
  address: string;
}

const MockData = [
  {
    id: 'user_id_1',
    username: 'Alice_Dev',
    avatar: '/user/avatar_p.png',
    address: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: 'user_id_2',
    username: 'Bob_Builder',
    avatar: '/user/avatar_p.png',
    address: '0x2345678901abcdef2345678901abcdef23456789',
  },
  {
    id: 'user_id_3',
    username: 'Charlie_Coder',
    avatar: '/user/avatar_p.png',
    address: '0x3456789012abcdef3456789012abcdef34567890',
  },
  {
    id: 'user_id_4',
    username: 'Dana_Designer',
    avatar: '/user/avatar_p.png',
    address: '0x4567890123abcdef4567890123abcdef45678901',
  },
];

export function useSearchUsers(initialQuery = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchedUsers, setSearchedUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.trim().length === 0) {
      setSearchedUsers([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: use real API
      // const response = await fetch(`/api/user/search?query=${encodeURIComponent(query)}`);
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || '搜索用户失败');
      // }
      // const data = await response.json();
      // setSearchedUsers(data.users || []);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setSearchedUsers(
        MockData.filter(
          (user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.address.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    } catch (error) {
      console.error('search user error:', error);
      setError(error instanceof Error ? error.message : 'something went wrong');
      setSearchedUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
