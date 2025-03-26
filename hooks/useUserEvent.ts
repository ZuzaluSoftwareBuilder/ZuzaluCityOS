import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_OWN_EVENT } from '@/services/graphql/profile';
import { IUserProfileWithSpaceAndEvent } from '@/types';
import { useMemo } from 'react';
import { GET_EVENT_QUERY_BY_IDS } from '@/services/graphql/event';
import useUserRole from '@/hooks/useUserRole';

const useUserEvent = () => {
  const { profile } = useCeramicContext();
  const userDId = profile?.author?.id;

  const { userRoles, isUserRoleLoading, isUserRoleFetched, followerRoleId } =
    useUserRole();

  const {
    data: userOwnEvent,
    isLoading: isUserOwnEventLoading,
    isFetched: isUserOwnEventFetched,
  } = useGraphQL(
    ['GET_USER_OWN_EVENT', userDId],
    GET_USER_OWN_EVENT,
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

  const ownerEvents = useMemo(() => {
    return (userOwnEvent?.events?.edges || []).map((edge) => edge.node);
  }, [userOwnEvent]);

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

  const {
    data: userJoinedEvents,
    isLoading: isUserJoinedEventLoading,
    isFetched: isUserJoinedEventFetched,
  } = useGraphQL(
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
      isUserRoleLoading || isUserOwnEventLoading || isUserJoinedEventLoading,
    isUserEventFetched:
      isUserRoleFetched && isUserOwnEventFetched && isUserJoinedEventFetched,
  };
};

export default useUserEvent;
