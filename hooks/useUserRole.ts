import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_ROLES_QUERY } from '@/services/graphql/role';
import { getDidByAddress } from '@/utils/did';
import { useAccount } from 'wagmi';

const useUserRole = () => {
  const { chainId, address } = useAccount();
  // TODO wait supabase update
  const userDId = getDidByAddress(address as string, chainId!);

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
