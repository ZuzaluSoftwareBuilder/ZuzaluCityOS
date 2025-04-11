import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface RoleData {
  id: string;
  level: string;
  [key: string]: any;
}

interface BuildInRoleContextType {
  followerRole: RoleData | undefined;
  adminRole: RoleData | undefined;
  ownerRole: RoleData | undefined;
  memberRole: RoleData | undefined;
  isRoleLoading: boolean;
}

const BuildInRoleContext = createContext<BuildInRoleContextType>({
  followerRole: undefined,
  adminRole: undefined,
  ownerRole: undefined,
  memberRole: undefined,
  isRoleLoading: false,
});

export const BuildInRoleProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['getAllBuildInRoles'],
    queryFn: () => supabase.from('role').select('*').is('resource_id', null),
    select: (data: any) => {
      return data;
    },
  });

  const followerRole = useMemo(() => {
    return data?.data?.find((role: any) => role.level === 'follower');
  }, [data]);

  const adminRole = useMemo(() => {
    return data?.data?.find((role: any) => role.level === 'admin');
  }, [data]);

  const ownerRole = useMemo(() => {
    return data?.data?.find((role: any) => role.level === 'owner');
  }, [data]);

  const memberRole = useMemo(() => {
    return data?.data?.find((role: any) => role.level === 'member');
  }, [data]);

  return (
    <BuildInRoleContext.Provider
      value={{
        followerRole,
        adminRole,
        ownerRole,
        memberRole,
        isRoleLoading: isLoading,
      }}
    >
      {children}
    </BuildInRoleContext.Provider>
  );
};

export const useBuildInRole = () => useContext(BuildInRoleContext);

export default BuildInRoleContext;
