import { useRepositories } from '@/context/RepositoryContext';
import { UserRole } from '@/models/role';
import { getMembers } from '@/services/member';
import { getRoles } from '@/services/role';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useGetSpaceMember(spaceId: string) {
  const { spaceRepository } = useRepositories();

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => getRoles('space', spaceId as string),
  });

  const { data: spaceData, isLoading: isLoadingOwner } = useQuery({
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

  const {
    data: members,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ['getSpaceMembers', spaceId],
    queryFn: () => getMembers(spaceId, 'space'),
    select: (data) => {
      return data.data as UserRole[];
    },
  });

  const owner = useMemo(() => {
    return spaceData?.owner || null;
  }, [spaceData]);

  return {
    owner,
    roles,
    members,
    isLoadingMembers,
    isLoadingRoles,
    isLoadingOwner,
    isLoading: isLoadingMembers || isLoadingRoles || isLoadingOwner,
    refetchMembers,
  };
}
