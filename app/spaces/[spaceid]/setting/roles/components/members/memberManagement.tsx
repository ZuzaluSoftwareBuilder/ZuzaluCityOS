import React, { useCallback, useMemo, useState } from 'react';
import { PermissionName, Profile, RolePermission, UserRole } from '@/types';
import { useSpacePermissions } from '../../../../components/permission';
import { AddMemberDrawer } from './addMemberDrawer';
import { AddMemberSubHeader } from './addMemberSubHeader';
import { MemberList } from './memberList';
import useOpenDraw from '@/hooks/useOpenDraw';
import { addToast } from '@heroui/react';
import { useParams } from 'next/navigation';
import {
  addMembersToRole,
  removeMembersFromRole,
  updateMembersRole,
} from '@/services/member';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { getWalletAddressFromDid } from '@/utils/did';

export interface IMemberItem {
  id: string;
  name: string;
  avatar: string;
  address: string;
  roleId: string | null;
  did: string;
}

interface MemberManagementProps {
  members: UserRole[];
  owner?: Profile;
  roleData: RolePermission[];
  roleName: string;
  isLoading: boolean;
}

const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  owner,
  roleData,
  roleName,
  isLoading,
}) => {
  const spaceId = useParams()?.spaceid;
  const { checkPermission, isOwner, isAdmin, isMember } = useSpacePermissions();
  const { refetchMembers } = useGetSpaceMember(spaceId as string);

  const [searchQuery, setSearchQuery] = useState('');
  const {
    open: openDrawer,
    handleOpen: openAddMemberDrawer,
    handleClose: closeAddMemberDrawer,
  } = useOpenDraw();
  const params = useParams<{ spaceid: string }>();

  const resource = 'space';
  const resourceId = params?.spaceid;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddMember = useCallback(() => {
    openAddMemberDrawer();
  }, [openAddMemberDrawer]);

  const getSortedMembers = useCallback(
    (memberIds: string[]) => {
      const membersWithRoles: string[] = [];
      const membersWithoutRoles: string[] = [];
      memberIds.forEach((memberId) => {
        const existingMember = members.find(
          (member) => member.userId.zucityProfile?.author?.id === memberId,
        );

        if (existingMember && existingMember.roleId) {
          membersWithRoles.push(memberId);
        } else {
          membersWithoutRoles.push(memberId);
        }
      });
      return { membersWithRoles, membersWithoutRoles };
    },
    [members],
  );

  const handleAddMembers = useCallback(
    async (memberIds: string[]) => {
      if (!memberIds.length) return;

      try {
        const roleId = roleData.find((role) => role.role.name === roleName)
          ?.role.id;
        if (!roleId) {
          throw new Error('can not find roleId');
        }

        const { membersWithRoles, membersWithoutRoles } =
          getSortedMembers(memberIds);

        const promises = [];

        if (membersWithoutRoles.length > 0) {
          promises.push(
            addMembersToRole(
              resource,
              resourceId as string,
              roleId,
              membersWithoutRoles,
            ),
          );
        }

        if (membersWithRoles.length > 0) {
          promises.push(
            updateMembersRole(
              resource,
              resourceId as string,
              roleId,
              membersWithRoles,
            ),
          );
        }

        await Promise.all(promises);

        await refetchMembers();

        addToast({
          title: 'Add Member Success',
          description: `Member added to ${roleName} role`,
          color: 'success',
        });
        closeAddMemberDrawer();
      } catch (error) {
        console.error('add member error:', error);
        addToast({
          title: 'Add member failed',
          description: error instanceof Error ? error.message : 'unknown error',
          color: 'danger',
        });
      }
    },
    [
      resourceId,
      resource,
      roleData,
      roleName,
      closeAddMemberDrawer,
      refetchMembers,
      getSortedMembers,
    ],
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!memberId) return;
      try {
        await removeMembersFromRole(resource, resourceId as string, [memberId]);
        await refetchMembers();
        addToast({
          title: 'Remove Member Success',
          description: `Member removed from ${roleName} role`,
          color: 'success',
        });
      } catch (error) {
        console.error('remove member error:', error);
        addToast({
          title: 'Remove Member Failed',
          description: error instanceof Error ? error.message : 'unknown error',
          color: 'danger',
        });
      }
    },
    [resourceId, resource, roleName, refetchMembers],
  );

  const currentRole = useMemo(() => {
    return roleData.find((role) => role.role.name === roleName);
  }, [roleData, roleName]);

  const filteredMembers = useMemo(() => {
    const formatedMembers = members
      .map((member) => {
        let roleId = member.roleId;
        const profile = member.userId.zucityProfile;
        if (!profile) return null;
        const did = profile.author?.id;
        return {
          id: did,
          name: profile.username,
          avatar: profile.avatar,
          address: getWalletAddressFromDid(did),
          roleId,
          did: profile.author?.id,
        } as IMemberItem;
      })
      .filter((v) => !!v)
      .filter((member) => member!.roleId === currentRole?.role.id);
    const memberList =
      roleName === 'Owner'
        ? [
            {
              id: owner?.author?.id,
              name: owner?.username,
              avatar: owner?.avatar,
              address: getWalletAddressFromDid(owner?.author?.id),
              roleId: null,
              did: owner?.author?.id,
            } as IMemberItem,
          ]
        : formatedMembers;
    if (!searchQuery) return memberList || [];

    return memberList.filter((member) =>
      member?.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [currentRole?.role.id, members, owner, roleName, searchQuery]);

  const canManageRole = useMemo(() => {
    if (!currentRole) return false;
    if (currentRole.role.level === 'owner') return false;
    if (currentRole.role.level === 'admin') {
      return checkPermission(PermissionName.MANAGE_ADMIN_ROLE);
    }
    if (currentRole.role.level === 'member') {
      return checkPermission(PermissionName.MANAGE_MEMBER_ROLE);
    }
    // no need to manage other roles, except admin、member
    return false;
  }, [currentRole, checkPermission]);

  return (
    <div className="flex flex-col w-full gap-10">
      <AddMemberSubHeader
        canManageRole={canManageRole}
        onSearch={handleSearch}
        onAddMember={handleAddMember}
      />

      <MemberList
        canManageRole={canManageRole}
        members={filteredMembers as IMemberItem[]}
        onRemoveMember={handleRemoveMember}
        currentRole={currentRole}
        isLoading={isLoading}
      />

      <AddMemberDrawer
        isOpen={openDrawer}
        onClose={closeAddMemberDrawer}
        roleName={roleName}
        onAddMembers={handleAddMembers}
      />
    </div>
  );
};
export default MemberManagement;
