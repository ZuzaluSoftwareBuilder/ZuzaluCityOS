import { GET_SPACE_QUERY_BY_ID } from '@/services/graphql/space';
import { getMembers } from '@/services/member';
import { getRoles } from '@/services/role';
import { Space, UserRole } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useGraphQL } from './useGraphQL';

export default function useGetSpaceMember(spaceId: string) {
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => getRoles('space', spaceId as string),
  });

  const { data: spaceData, isLoading: isLoadingOwner } = useGraphQL(
    ['getSpaceByID', spaceId],
    GET_SPACE_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => {
        return data?.data?.node as Space;
      },
    },
  );

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
    return spaceData?.owner?.zucityProfile;
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
