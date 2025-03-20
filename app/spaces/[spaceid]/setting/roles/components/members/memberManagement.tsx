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
  }, [openAddMemberDrawer]);

  const handleCloseAddMemberDrawer = useCallback(() => {
    closeAddMemberDrawer();
  }, [closeAddMemberDrawer]);

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
    console.log(members);
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
