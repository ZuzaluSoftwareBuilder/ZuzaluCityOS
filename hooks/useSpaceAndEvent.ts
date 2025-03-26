import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { EVENTS_QUERY } from '@/graphql/eventQueries';
import { EventData, SpaceData } from '@/types';
import { getSpacesQuery } from '@/services/space';
import { composeClient } from '@/constant';
import useUserJoinedSpace from '@/hooks/useUserJoinedSpace';

const useSpaceAndEvent = () => {

  const {
    userJoinedSpaceIds,
    userJoinedEventIds,
    isUserRoleLoading,
    isUserRoleFetched,
    isUserSpaceAndEventFetched,
    isUserSpaceAndEventLoading,
  } = useUserJoinedSpace();

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
    allSpaces: allSpaces || [],
    allEvents: allEvents || [],
    userSpaces,
    userEvents,
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
