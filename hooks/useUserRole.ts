import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { getRoleRepository } from '@/repositories/role';
import { useQuery } from '@tanstack/react-query';

const useUserRole = () => {
  const { profile } = useAbstractAuthContext();
  // TODO wait supabase update
  const userDId = profile?.did;

  const { followerRole } = useBuildInRole();

  const {
    data: userRoles,
    isLoading: isUserRoleLoading,
    isFetched: isUserRoleFetched,
  } = useQuery({
    queryKey: ['GET_USER_ROLES', userDId],
    queryFn: () => getRoleRepository().getOwnedRole(userDId as string),
    enabled: !!userDId,
    select: (data) => data.data,
  });

  console.log('userRoles', userRoles);

  return {
    userRoles,
    isUserRoleLoading,
    isUserRoleFetched,
    followerRoleId: followerRole?.id,
  };
};

export default useUserRole;
