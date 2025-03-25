import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useMemo } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';

export interface IUseUserJoinProps {
  spaceId: string;
}
const useUserJoinSpace = ({ spaceId }: IUseUserJoinProps) => {
  const { profile } = useCeramicContext();
  const userId = profile?.author?.id;
  const { owner, roles, members } = useGetSpaceMember(spaceId as string);

  const isOwner = useMemo(() => {
    if (!owner || !userId) return false;
    return owner?.author?.id === userId;
  }, [owner, userId]);

  const userRoleId = useMemo(() => {
    if (!members || !userId) return null;
    const userMember = members.find(
      (member) => member.userId.zucityProfile?.author?.id === userId,
    );

    if (!userMember) return null;

    return userMember.roleId;
  }, [members, userId]);

  const isAdmin = useMemo(() => {
    if (!members || !userId || !roles?.data) return false;

    const adminRoleData = roles.data.find(
      (role) => role.role.level === 'admin',
    );

    if (!adminRoleData) return false;

    return userRoleId === adminRoleData.role.id;
  }, [members, userId, roles?.data, userRoleId]);

  const isMember = useMemo(() => {
    if (!members || !userId || !roles?.data) return false;

    const memberRoleData = roles.data.find(
      (role) => role.role.level === 'member',
    );

    if (!memberRoleData) return false;

    return userRoleId === memberRoleData.role.id;
  }, [members, userId, roles?.data, userRoleId]);

  const isUserJoined = useMemo(() => {
    return isOwner || isAdmin || isMember;
  }, [isAdmin, isMember, isOwner]);

  return {
    joined: isUserJoined,
  };
};

export default useUserJoinSpace;
