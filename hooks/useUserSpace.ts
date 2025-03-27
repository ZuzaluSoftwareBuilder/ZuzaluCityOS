import { GET_USER_OWN_SPACE } from '@/services/graphql/profile';
import { useMemo } from 'react';
import { useGraphQL } from './useGraphQL';
import { useCeramicContext } from '@/context/CeramicContext';
import { IUserProfileWithSpaceAndEvent } from '@/types';
import { GET_SPACE_QUERY_BY_IDS } from '@/services/graphql/space';
import useUserRole from '@/hooks/useUserRole';

const useUserSpace = () => {
  const { profile } = useCeramicContext();
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
    isUserSpaceLoading:
      isUserRoleLoading || isUserOwnSpaceLoading || isUserJoinedSpaceLoading,
    isUserSpaceFetched:
      isUserRoleFetched && isUserOwnSpaceFetched && isUserJoinedSpaceFetched,
  };
};

export default useUserSpace;
