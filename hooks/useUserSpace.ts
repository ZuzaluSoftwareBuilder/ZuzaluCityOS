import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import useUserRole from '@/hooks/useUserRole';
import { GET_USER_OWN_SPACE } from '@/services/graphql/profile';
import { GET_SPACE_QUERY_BY_IDS } from '@/services/graphql/space';
import { IUserProfileWithSpaceAndEvent } from '@/types';
import { useMemo } from 'react';
import { useGraphQL } from './useGraphQL';

const useUserSpace = () => {
  const { profile } = useAbstractAuthContext();
  const userDId = profile?.author?.id;

  const { userRoles, isUserRoleLoading, isUserRoleFetched, followerRoleId } =
    useUserRole();

  const {
    data: userOwnSpace,
    isLoading: isUserOwnSpaceLoading,
    isFetched: isUserOwnSpaceFetched,
  } = useGraphQL(
    ['GET_USER_OWN_SPACE', userDId],
    GET_USER_OWN_SPACE,
    {
      did: userDId as string,
    },
    {
      select: ({ data }) => {
        return (data.node as IUserProfileWithSpaceAndEvent)?.zucityProfile;
      },
      enabled: !!userDId,
      placeholderData: (previousData) => previousData,
    },
  );

  const ownerSpaces = useMemo(() => {
    return (userOwnSpace?.spaces?.edges || []).map((edge) => edge.node);
  }, [userOwnSpace]);

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

  const {
    data: userJoinedSpaces,
    isLoading: isUserJoinedSpaceLoading,
    isFetched: isUserJoinedSpaceFetched,
  } = useGraphQL(
    ['GET_SPACE_QUERY_BY_IDS', userJoinedSpaceIdArray],
    GET_SPACE_QUERY_BY_IDS,
    { ids: userJoinedSpaceIdArray as string[] },
    {
      select: (data) => data.data?.nodes || [],
      enabled: userJoinedSpaceIdArray.length > 0,
      placeholderData: (previousData) => previousData,
    },
  );

  const userFollowedSpaces = useMemo(() => {
    return (userRoles || []).filter(
      (role) =>
        role?.resourceId &&
        role.roleId === followerRoleId &&
        role?.source?.toLocaleLowerCase() === 'space',
    );
  }, [userRoles, followerRoleId]);

  const isUserSpaceFetched = useMemo(() => {
    if (isUserOwnSpaceFetched && userJoinedSpaceIdArray.length > 0) {
      return (
        isUserRoleFetched && isUserOwnSpaceFetched && isUserJoinedSpaceFetched
      );
    } else {
      return isUserRoleFetched && isUserOwnSpaceFetched;
    }
  }, [
    isUserRoleFetched,
    isUserOwnSpaceFetched,
    isUserJoinedSpaceFetched,
    userJoinedSpaceIdArray,
  ]);

  const userFollowedSpaceIds = useMemo(() => {
    const ids = userFollowedSpaces.map((role) => role?.resourceId);
    return new Set(ids);
  }, [userFollowedSpaces]);

  return {
    userFollowedSpaces: userFollowedSpaces || [],
    userJoinedSpaces: userJoinedSpaces || [],
    userJoinedSpaceIds,
    userFollowedSpaceIds,
    isUserSpaceLoading:
      isUserRoleLoading || isUserOwnSpaceLoading || isUserJoinedSpaceLoading,
    isUserSpaceFetched,
  };
};

export default useUserSpace;
