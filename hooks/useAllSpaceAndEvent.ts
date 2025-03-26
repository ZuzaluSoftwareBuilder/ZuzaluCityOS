import { Space } from '@/types';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_ALL_SPACE_QUERY } from '@/services/graphql/space';
import { GET_ALL_EVENT_QUERY } from '@/services/graphql/event';

const useAllSpaceAndEvent = () => {

  const { data: allSpaces, isLoading: isAllSpaceLoading,isFetched: isAllSpaceFetched  } = useGraphQL(
    ['GET_ALL_SPACE_QUERY'],
    GET_ALL_SPACE_QUERY,
    { first: 100 },
    {
      select: (data) => {
        if (!data?.data?.zucitySpaceIndex?.edges) {
          return [];
        }
        return data.data.zucitySpaceIndex.edges.map(
          (edge) => edge!.node,
        ) as Space[];
      },
    },
  );

  const { data: allEvents, isLoading: isAllEventLoading, isFetched: isAllEventFetched } = useGraphQL(
    ['GET_ALL_EVENT_QUERY'],
    GET_ALL_EVENT_QUERY,
    { first: 100 },
    {
      select: (data) => {
        if (!data?.data?.zucityEventIndex?.edges) {
          return [];
        }
        return data.data.zucityEventIndex.edges.map(
          (edge) => edge!.node,
        );
      },
    },
  );

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