import { useCeramicContext } from '@/context/CeramicContext';
import { getRoles } from '@/services/role';
import { getSpaceEventsQuery } from '@/services/space';
import { Space, SpaceData, UserRole, UserRoleData } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function useGetSpaceMember(spaceId: string) {
  const { composeClient } = useCeramicContext();
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => getRoles('space', spaceId as string),
  });

  const { data: spaceData, isLoading: isLoadingOwner } = useQuery({
    queryKey: ['getSpaceByID', spaceId],
    queryFn: () => {
      return composeClient.executeQuery(getSpaceEventsQuery(), {
        id: spaceId,
      });
    },
    select: (data) => {
      return data?.data?.node as Space;
    },
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['getSpaceMembers', spaceId],
    queryFn: () => {
      return composeClient.executeQuery<UserRoleData>(
        `
        query MyQuery {
          zucityUserRolesIndex(
            first: 1000,
            filters: {
              where: {
                resourceId: { equalTo: "${spaceId}" }
                source: { equalTo: "space" }
              }
            }
          ) {
            edges {
              node {
                roleId
                customAttributes {
                  tbd
                }
                userId {
                  zucityProfile {
                    avatar
                    username
                    author {
                      id
                    }
                  }
                }
              }
            }
          }
        }
        `,
      );
    },
    select: (data) => {
      if ('zucityUserRolesIndex' in data.data!) {
        const userRoleData: UserRoleData = data.data as UserRoleData;
        return userRoleData.zucityUserRolesIndex.edges.map((edge) => edge.node);
      }
      return [];
    },
  });

  console.log(members);

  const owner = useMemo(() => {
    return spaceData?.superAdmin?.[0].zucityProfile;
  }, [spaceData]);

  return {
    owner,
    roles,
    members,
    isLoadingMembers,
    isLoadingRoles,
    isLoadingOwner,
    isLoading: isLoadingMembers || isLoadingRoles || isLoadingOwner,
  };
}
