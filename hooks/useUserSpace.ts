import { GET_USER_SPACE_AND_EVENT } from '@/services/graphql/profile';
import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useGraphQL } from './useGraphQL';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';
import { useCeramicContext } from '@/context/CeramicContext';
import { IUserProfileWithSpaceAndEvent } from '@/types';
import { GET_SPACE_QUERY_BY_IDS } from '@/services/graphql/space';

const useUserSpace = () => {
  const { profile } = useCeramicContext();
  const userDId = profile?.author?.id;

  const {
    data: userRoles,
    isLoading: isUserRoleLoading,
    isFetched: isUserRoleFetched,
  } = useGraphQL(
    ['GET_USER_ROLES_QUERY', userDId],
    GET_USER_ROLES_QUERY,
    {
      userId: userDId,
    },
    {
      select: ({ data }) => {
        return (
          data?.zucityUserRolesIndex?.edges?.map((edge) => edge?.node) || []
        );
      },
      enabled: !!userDId,
    },
  );

  const {
    data: userSpaceAndEvent,
    isLoading: isUserSpaceAndEventLoading,
    isFetched: isUserSpaceAndEventFetched,
  } = useGraphQL(
    ['GET_USER_SPACE_AND_EVENT', userDId],
    GET_USER_SPACE_AND_EVENT,
    {
      did: userDId as string,
    },
    {
      select: ({ data }) => {
        return (data.node as IUserProfileWithSpaceAndEvent)?.zucityProfile;
      },
      enabled: !!userDId,
    },
  );

  const { data: followerRoleId } = useQuery({
    queryKey: ['getFollowerRoleId'],
    queryFn: () => {
      return supabase.from('role').select('*').eq('level', 'follower');
    },
    select: (data: any) => {
      return data.data.id;
    },
  });

  const ownerSpaces = useMemo(() => {
    return (userSpaceAndEvent?.spaces?.edges || []).map((edge) => edge.node);
  }, [userSpaceAndEvent]);

  const userJoinedSpaceIds = useMemo(() => {
    const spaceIds = ownerSpaces.map((space) => space?.id);
    const participatedSpaceIds = (userRoles || [])
      .filter(
        (role) =>
          role?.resourceId && role?.source?.toLocaleLowerCase() === 'space',
      )
      .map((role) => role?.resourceId);
    return new Set([...spaceIds, ...participatedSpaceIds]);
  }, [ownerSpaces, userRoles]);

  const userJoinedSpaceIdArray = useMemo(() => {
    return userJoinedSpaceIds.size > 0 ? Array.from(userJoinedSpaceIds) : [];
  }, [userJoinedSpaceIds]);

  const { data: userJoinedSpaces, isLoading: isUserJoinedSpaceLoading, isFetched: isUserJoinedSpaceFetched } = useGraphQL(
    ['GET_SPACE_QUERY_BY_IDS', userJoinedSpaceIdArray],
    GET_SPACE_QUERY_BY_IDS,
    { ids: userJoinedSpaceIdArray as string[] },
    {
      select: (data) => data.data?.nodes || [],
      enabled: userJoinedSpaceIdArray.length > 0,
    },
  );

  const userFollowedSpaceIds = useMemo(() => {
    const ids = (userRoles || [])
      .filter(
        (role) =>
          role?.resourceId &&
          role.roleId === followerRoleId &&
          role?.source?.toLocaleLowerCase() === 'space',
      )
      .map((role) => role?.resourceId);
    return new Set(ids);
  }, [userRoles, followerRoleId]);

  return {
    userJoinedSpaces: userJoinedSpaces || [],
    userJoinedSpaceIds,
    userFollowedSpaceIds,
    isUserSpaceLoading: isUserRoleLoading || isUserSpaceAndEventLoading || isUserJoinedSpaceLoading,
    isUserSpaceFetched: isUserRoleFetched && isUserSpaceAndEventFetched && isUserJoinedSpaceFetched,
  };
};

export default useUserSpace;
