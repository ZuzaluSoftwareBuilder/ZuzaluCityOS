import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';
import { GET_USER_SPACE_AND_EVENT } from '@/services/graphql/profile';
import { IUserProfileWithSpaceAndEvent } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { useMemo } from 'react';
import { GET_ALL_EVENT_QUERY } from '@/services/graphql/event';

const useUserEvent = () => {
  const { profile } = useCeramicContext();
  const userDId = profile?.author?.id;

  const {
    data: allEvents,
    isLoading: isAllEventLoading,
    isFetched: isAllEventFetched,
  } = useGraphQL(
    ['GET_ALL_EVENT_QUERY'],
    GET_ALL_EVENT_QUERY,
    { first: 100 },
    {
      select: (data) => {
        if (!data?.data?.zucityEventIndex?.edges) {
          return [];
        }
        return data.data.zucityEventIndex.edges.map((edge) => edge!.node);
      },
    },
  );

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

  const userJoinedEvents = useMemo(() => {
    return (allEvents || []).filter((event) =>
      userJoinedEventIds.has(event?.id),
    );
  }, [userJoinedEventIds, allEvents]);

  return {
    userJoinedEvents,
    userJoinedEventIds,
    userFollowedResourceIds,
    isUserEventLoading:
      isUserRoleLoading || isUserSpaceAndEventLoading || isAllEventLoading,
    isUserEventFetched:
      isUserRoleFetched && isUserSpaceAndEventFetched && isAllEventFetched,
  };
};

export default useUserEvent;
