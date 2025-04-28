import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useRepositories } from '@/context/RepositoryContext';
import useUserRole from '@/hooks/useUserRole';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const useUserSpace = () => {
  const { profile } = useAbstractAuthContext();
  const { spaceRepository } = useRepositories();
  // TODO wait supabase update
  const userDId = profile?.did;

  const { userRoles, isUserRoleLoading, isUserRoleFetched, followerRoleId } =
    useUserRole();

  const {
    data: userOwnSpace,
    isLoading: isUserOwnSpaceLoading,
    isFetched: isUserOwnSpaceFetched,
  } = useQuery({
    queryKey: ['GET_USER_OWN_SPACE', userDId],
    queryFn: () => spaceRepository.getUserOwnedSpaces(userDId as string),
    enabled: !!userDId,
    placeholderData: (previousData) => previousData,
  });

  const ownerSpaces = useMemo(() => {
    return userOwnSpace?.data || [];
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
  } = useQuery({
    queryKey: ['GET_SPACE_QUERY_BY_IDS', userJoinedSpaceIdArray],
    queryFn: () => spaceRepository.getByIds(userJoinedSpaceIdArray as string[]),
    enabled: userJoinedSpaceIdArray.length > 0,
    placeholderData: (previousData) => previousData,
    select: (data) => data.data || [],
  });

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
