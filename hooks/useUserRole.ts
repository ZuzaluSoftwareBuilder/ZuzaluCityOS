import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';

const useUserRole = () => {
  const { profile } = useCeramicContext();
  const userDId = profile?.author?.id;

  const { followerRole } = useBuildInRole();

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

  return {
    userRoles,
    isUserRoleLoading,
    isUserRoleFetched,
    followerRoleId: followerRole?.id,
  };
};

export default useUserRole;
