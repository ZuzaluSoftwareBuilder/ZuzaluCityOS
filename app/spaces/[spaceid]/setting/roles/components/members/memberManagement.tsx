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
  const { checkPermission } = useSpacePermissions();
  const { refetchMembers } = useGetSpaceMember(spaceId as string);

  const [searchQuery, setSearchQuery] = useState('');
  const {
    open: openDrawer,
    handleOpen: openAddMemberDrawer,
    handleClose: closeAddMemberDrawer,
  } = useOpenDraw();
  const params = useParams<{ spaceid: string }>();

  // hardcode space for now
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

        console.log('getSortedMembers', memberIds, membersWithRoles, membersWithoutRoles);

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
          console.log('resource', resource)
          console.log('resourceId', resourceId)
          console.log('roleId', roleId)
          console.log('membersWithRoles', membersWithRoles)
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
          classNames: { base: 'z-[1500]' },
        });
        closeAddMemberDrawer();
      } catch (error) {
        console.error('add member error:', error);
        addToast({
          title: 'Add member failed',
          description: error instanceof Error ? error.message : 'unknown error',
          color: 'danger',
          classNames: { base: 'z-[1500]' },
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
          classNames: { base: 'z-[1500]' },
        });
      } catch (error) {
        console.error('remove member error:', error);
        addToast({
          title: 'Remove Member Failed',
          description: error instanceof Error ? error.message : 'unknown error',
          color: 'danger',
          classNames: { base: 'z-[1500]' },
        });
      }
    },
    [resourceId, resource, roleName, refetchMembers],
  );

  /**
   * 当用户已经是当前 space 的某个角色，选择添加到其他角色时, 需要调用 /api/member/update 接口，而不是 /api/member/add 接口
   * 比如，用户 A 已经是 admin，添加到 member，需要调用 /api/member/update 接口，而不是 /api/member/add 接口
   * 用户 B 已经是 member，添加到 admin,也需要调用 /api/member/update 接口
   * 其他情况同理
   */
  const handleUpdateMember = useCallback(
    async (memberIds: string[], newRoleId: string) => {
      if (!memberIds.length) return;

      try {
        await updateMembersRole(
          resource,
          resourceId as string,
          newRoleId,
          memberIds,
        );
        await refetchMembers();
        addToast({
          title: 'Update Member Role Success',
          description: `Member role updated successfully`,
          color: 'success',
          classNames: { base: 'z-[1500]' },
        });
      } catch (error) {
        console.error('update member role error:', error);
        addToast({
          title: 'Update Member Role Failed',
          description: error instanceof Error ? error.message : 'unknown error',
          color: 'danger',
          classNames: { base: 'z-[1500]' },
        });
      }
    },
    [resourceId, resource, refetchMembers],
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
          address: did?.split(':')[4],
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
              address: owner?.author?.id.split(':')[4],
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

  const canManageAdminRole = useMemo(() => {
    if (!currentRole || currentRole.role.level !== 'admin') return false;
    return checkPermission(PermissionName.MANAGE_ADMIN_ROLE);
  }, [currentRole, checkPermission]);

  return (
    <div className="flex flex-col w-full gap-10">
      <AddMemberSubHeader
        canManageAdminRole={canManageAdminRole}
        onSearch={handleSearch}
        onAddMember={handleAddMember}
      />

      <MemberList
        canManageAdminRole={canManageAdminRole}
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
