import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';
import { GET_USER_SPACE_AND_EVENT } from '@/services/graphql/profile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { useMemo } from 'react';
import useAllSpaceAndEvent from '@/hooks/useAllSpaceAndEvent';

const useUserSpaceAndEvent = () => {
  const { profile } = useCeramicContext();
  const userDId = profile?.author?.id;

  const {
    allSpaces,
    allEvents,
    isAllSpaceLoading,
    isAllEventLoading,
    isAllSpaceFetched,
    isAllEventFetched,
  } = useAllSpaceAndEvent();

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

  const userJoinedSpaces = useMemo(() => {
    return (allSpaces || []).filter((space) =>
      userJoinedSpaceIds.has(space.id),
    );
  }, [userJoinedSpaceIds, allSpaces]);

  const userJoinedEvents = useMemo(() => {
    return (allEvents || []).filter((event) =>
      userJoinedEventIds.has(event.id),
    );
  }, [userJoinedEventIds, allEvents]);

  return {
    userRoles,
    userSpaces: userJoinedSpaces,
    userEvents: userJoinedEvents,
    userJoinedSpaceIds,
    userJoinedEventIds,
    userFollowedResourceIds,
    isUserSpaceLoading:
      isUserRoleLoading || isUserSpaceAndEventLoading || isAllSpaceLoading,
    isUserSpaceFetched:
      isUserRoleFetched && isUserSpaceAndEventFetched && isAllSpaceFetched,
    isUserEventLoading:
      isUserRoleLoading || isUserSpaceAndEventLoading || isAllEventLoading,
    isUserEventFetched:
      isUserRoleFetched && isUserSpaceAndEventFetched && isAllEventFetched,
  };
};

export default useUserSpaceAndEvent;
