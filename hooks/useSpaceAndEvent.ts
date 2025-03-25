import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_SPACE_AND_EVENT } from '@/services/graphql/profile';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';
import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { EVENTS_QUERY } from '@/graphql/eventQueries';
import { EventData, SpaceData } from '@/types';
import { getSpacesQuery } from '@/services/space';
import { composeClient } from '@/constant';

const useSpaceAndEvent = () => {
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
        // @ts-ignore
        return data.node?.zucityProfile;
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

  const {
    data: allEvents,
    isLoading: isEventsLoading,
    isFetched: isEventFetched,
  } = useQuery({
    queryKey: ['userEvents'],
    queryFn: async () => {
      try {
        const response: any = await composeClient.executeQuery(EVENTS_QUERY);

        if (response && response.data && 'zucityEventIndex' in response.data) {
          const eventData: EventData = response.data as EventData;
          return eventData.zucityEventIndex.edges.map((edge) => edge.node);
        } else {
          console.error('Invalid data structure:', response.data);
          return [];
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
      }
    },
  });

  const {
    data: allSpaces,
    isLoading: isSpacesLoading,
    isFetched: isSpaceFetched,
  } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      try {
        const response: any = await composeClient.executeQuery(getSpacesQuery);
        if ('zucitySpaceIndex' in response.data) {
          const spaceData: SpaceData = response.data as SpaceData;

          return spaceData.zucitySpaceIndex.edges.map((edge) => edge.node);
        } else {
          console.error('Invalid data structure:', response.data);
          return [];
        }
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        throw error;
      }
    },
  });

  const ownerSpaces = useMemo(() => {
    return (userSpaceAndEvent?.spaces?.edges || []).map(
      (edge: any) => edge.node,
    ) as Array<{ id: string; name: string }>;
  }, [userSpaceAndEvent]);

  const ownerEvents = useMemo(() => {
    return (userSpaceAndEvent?.events?.edges || []).map(
      (edge: any) => edge.node,
    ) as Array<{ id: string; title: string; description?: string }>;
  }, [userSpaceAndEvent]);

  const userJoinedSpaceIds = useMemo(() => {
    const spaceIds = ownerSpaces.map((space) => space.id);
    const participatedSpaceIds = (userRoles || [])
      .filter(
        (role) =>
          role?.resourceId && role?.source?.toLocaleLowerCase() === 'space',
      )
      .map((role) => role?.resourceId);
    return new Set([...spaceIds, ...participatedSpaceIds]);
  }, [ownerSpaces, userRoles]);

  const userJoinedEventIds = useMemo(() => {
    const eventIds = ownerEvents.map((event) => event.id);
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

  const userSpaces = useMemo(() => {
    return (allSpaces || []).filter((space) =>
      userJoinedSpaceIds.has(space.id),
    );
  }, [userJoinedSpaceIds, allSpaces]);

  const userEvents = useMemo(() => {
    return (allEvents || []).filter((event) =>
      userJoinedEventIds.has(event.id),
    );
  }, [userJoinedEventIds, allEvents]);

  return {
    userRoles,
    allSpaces: allSpaces || [],
    allEvents: allEvents || [],
    userSpaces,
    userEvents,
    userJoinedSpaceIds,
    userJoinedEventIds,
    userFollowedResourceIds,
    isAllSpaceLoading: isSpacesLoading,
    isAllEventLoading: isEventsLoading,
    isUserEventsLoading:
      isUserRoleLoading || isEventsLoading || isUserSpaceAndEventLoading,
    isUserEventFetched:
      isUserRoleFetched && isEventFetched && isUserSpaceAndEventFetched,
    isUserSpacesLoading:
      isUserRoleLoading || isSpacesLoading || isUserSpaceAndEventLoading,
    isUserSpaceFetched:
      isUserRoleFetched && isSpaceFetched && isUserSpaceAndEventFetched,
  };
};

export default useSpaceAndEvent;
