import { useQuery } from '@tanstack/react-query';
import { EVENTS_QUERY } from '@/graphql/eventQueries';
import { EventData, SpaceData } from '@/types';
import { getSpacesQuery } from '@/services/space';
import { composeClient } from '@/constant';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_ALL_SPACE_QUERY } from '@/services/graphql/space';
import { GET_ALL_EVENT_QUERY } from '@/services/graphql/event';

const useAllSpaceAndEvent = () => {
  const { data: allSpaceList } = useGraphQL(
    'GET_ALL_SPACE_QUERY',
    GET_ALL_SPACE_QUERY,
    {
      select: (data) => {
        return data?.zucitySpaceIndex?.edges?.map((edge) => edge?.node) || [];
      },
    },
  );

  const { data: allEventList } = useGraphQL(
    'GET_ALL_EVENT_QUERY',
    GET_ALL_EVENT_QUERY,
    {
      select: (data) => {
        return data?.zucityEventIndex?.edges?.map((edge) => edge?.node) || [];
      },
    },
  );

  const {
    data: allSpaces,
    isLoading: isAllSpaceLoading,
    isFetched: isAllSpaceFetched,
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

  const {
    data: allEvents,
    isLoading: isAllEventLoading,
    isFetched: isAllEventFetched,
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


  return {
    allSpaces: allSpaces || [],
    allEvents: allEvents || [],
    isAllSpaceLoading,
    isAllEventLoading,
    isAllEventFetched,
    isAllSpaceFetched,
  };
};

export default useAllSpaceAndEvent;
