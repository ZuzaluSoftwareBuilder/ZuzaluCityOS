import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';
import { GET_USER_SPACE_AND_EVENT } from '@/services/graphql/profile';
import { IUserProfileWithSpaceAndEvent } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { useMemo } from 'react';
import { GET_EVENT_QUERY_BY_IDS } from '@/services/graphql/event';

const useUserEvent = () => {
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

  const ownerEvents = useMemo(() => {
    return (userSpaceAndEvent?.events?.edges || []).map((edge) => edge.node);
  }, [userSpaceAndEvent]);

  const userJoinedEventIds = useMemo(() => {
    const eventIds = ownerEvents.map((event) => event?.id);
    const participatedEventIds = (userRoles || [])
      .filter(
        (role) =>
          role?.resourceId && role?.source?.toLocaleLowerCase() === 'event',
      )
      .map((role) => role?.resourceId);
    return new Set([...eventIds, ...participatedEventIds]);
  }, [ownerEvents, userRoles]);

  const userFollowedResourceIds = useMemo(() => {
    const ids = (userRoles || [])
      .filter((role) => role?.resourceId && role.roleId === followerRoleId)
      .map((role) => role?.resourceId);
    return new Set(ids);
  }, [userRoles, followerRoleId]);

  const userJoinedEventIdArray = useMemo(() => {
    return userJoinedEventIds.size > 0 ? Array.from(userJoinedEventIds) : [];
  }, [userJoinedEventIds]);

  const { data: userJoinedEvents, isLoading: isUserJoinedEventLoading, isFetched: isUserJoinedEventFetched } = useGraphQL(
    ['GET_EVENT_QUERY_BY_IDS', userJoinedEventIdArray],
    GET_EVENT_QUERY_BY_IDS,
    { ids: userJoinedEventIdArray as string[] },
    {
      select: (data) => data.data?.nodes || [],
      enabled: userJoinedEventIdArray.length > 0,
    },
  );

  return {
    userJoinedEvents,
    userJoinedEventIds,
    userFollowedResourceIds,
    isUserEventLoading:
      isUserRoleLoading || isUserSpaceAndEventLoading || isUserJoinedEventLoading,
    isUserEventFetched:
      isUserRoleFetched && isUserSpaceAndEventFetched && isUserJoinedEventFetched,
  };
};

export default useUserEvent;
