import React, { useCallback, useMemo, useState } from 'react';
import { PermissionName, Profile, RolePermission, UserRole } from '@/types';
import { useSpacePermissions } from '../../../../components/permission';
import { AddMemberDrawer } from './addMemberDrawer';
import { AddMemberSubHeader } from './addMemberSubHeader';
import { MemberList } from './memberList';
import useOpenDraw from '@/hooks/useOpenDraw';

export interface IMemberItem {
  id: string;
  name: string;
  avatar: string;
  address: string;
  roleId: string | null;
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
  const { checkPermission } = useSpacePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const { open: isAddMemberDrawerOpen, handleOpen: openAddMemberDrawer, handleClose: closeAddMemberDrawer } = useOpenDraw();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddMember = useCallback(() => {
    openAddMemberDrawer()
  }, []);

  const handleCloseAddMemberDrawer = useCallback(() => {
    closeAddMemberDrawer();
  }, []);

  const handleRemoveMember = useCallback((memberId: string) => {
    console.log('Remove member:', memberId);
  }, []);

  const handleAddMembers = useCallback((memberIds: string[]) => {
    console.log('Add members:', memberIds);
  }, []);

  const currentRole = useMemo(() => {
    return roleData.find((role) => role.role.name === roleName);
  }, [roleData, roleName]);

  const filteredMembers = useMemo(() => {
    const formatedMembers = members
      .map((member) => {
        let roleId: string | null = null;
        member.customAttributes.some((attr) => {
          if (!attr || !('tbd' in attr)) return false;

          try {
            const parsedAttr = JSON.parse(attr.tbd);
            if (parsedAttr.key === 'roleId' && parsedAttr.value) {
              roleId = parsedAttr.value;
              return true;
            }
            return false;
          } catch {
            return false;
          }
        });
        const did = member.userId.zucityProfile.author?.id;
        return {
          id: did,
          name: member.userId.zucityProfile.username,
          avatar: member.userId.zucityProfile.avatar,
          address: did?.split(':')[4],
          roleId,
        } as IMemberItem;
      })
      .filter((member) => member.roleId === currentRole?.role.id);
    const memberList =
      roleName === 'Owner'
        ? [
            {
              id: owner?.author?.id,
              name: owner?.username,
              avatar: owner?.avatar,
              address: owner?.author?.id.split(':')[4],
              roleId: null,
            } as IMemberItem,
          ]
        : formatedMembers;
    if (!searchQuery) return memberList || [];

    return memberList.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [currentRole?.role.id, members, owner, roleName, searchQuery]);

  const availableMembers = useMemo(() => {
    const allMembers = members.map((member) => {
      const did = member.userId.zucityProfile.author?.id;
      return {
        id: did,
        name: member.userId.zucityProfile.username,
        avatar: member.userId.zucityProfile.avatar,
        address: did?.split(':')[4],
        roleId: null,
      } as IMemberItem;
    });

    return allMembers.filter(
      (member) => !filteredMembers.some((m) => m.id === member.id),
    );
  }, [members, filteredMembers]);

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
        members={filteredMembers}
        onRemoveMember={handleRemoveMember}
        currentRole={currentRole}
        isLoading={isLoading}
      />

      <AddMemberDrawer
        isOpen={isAddMemberDrawerOpen}
        onClose={handleCloseAddMemberDrawer}
        roleName={roleName}
        onAddMembers={handleAddMembers}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MemberManagement;
