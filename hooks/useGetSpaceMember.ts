import { getSpaceRepository } from '@/repositories/space';
import { getMembers } from '@/services/member';
import { getRoles } from '@/services/role';
import { UserRole } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useGetSpaceMember(spaceId: string) {
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => getRoles('space', spaceId as string),
  });

  const spaceRepository = getSpaceRepository();

  const { data: spaceData, isLoading: isLoadingOwner } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      if (!spaceId) return undefined;
      const spaceData = await spaceRepository.getById(spaceId);
      return spaceData.data || undefined;
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
  console.log('getSapceMember', spaceData);
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
