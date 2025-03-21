import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { PermissionName, Profile, RolePermission, UserRole } from '@/types';
import { useSpacePermissions } from '../../../../components/permission';
import { AddMemberDrawer } from './addMemberDrawer';
import { AddMemberSubHeader } from './addMemberSubHeader';
import { MemberList } from './memberList';
import useOpenDraw from '@/hooks/useOpenDraw';
import { addToast } from '@heroui/react';
import { useParams, usePathname } from 'next/navigation';
import { addMembersToRole, removeMembersFromRole } from '@/services/role';

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
  onMembersChange?: (members: IMemberItem[]) => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  owner,
  roleData,
  roleName,
  isLoading,
  onMembersChange,
}) => {
  const { checkPermission } = useSpacePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const { open: openDrawer, handleOpen: openAddMemberDrawer, handleClose: closeAddMemberDrawer } = useOpenDraw();
  const params = useParams<{ spaceid: string }>();
  const pathname = usePathname();
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  // TODO set space for now
  const resource = pathname?.includes('/spaces/') ? 'space' : 'city';
  const resourceId = params?.spaceid;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAddMember = useCallback(() => {
    openAddMemberDrawer()
  }, [openAddMemberDrawer]);

  const handleAddMembers = useCallback(
    async (memberIds: string[]) => {
      if (!memberIds.length) return;
      
      setIsAddingMembers(true);
      
      try {
        const roleId = roleData.find(role => role.role.name === roleName)?.role.id;
        
        if (!roleId) {
          throw new Error('未找到角色ID');
        }
        
        await addMembersToRole(resource, resourceId as string, roleId, memberIds);

        // TODO need refresh list
        addToast({
          title: '成功添加成员',
          description: `已成功将选定用户添加到 ${roleName} 角色`,
          color: 'success',
        });
        setIsAddingMembers(false);
      } catch (error) {
        console.error('添加成员错误:', error);
        addToast({
          title: '添加成员失败',
          description: error instanceof Error ? error.message : '发生未知错误',
          color: 'danger',
        });
      } finally {
        // setIsAddingMembers(false);
      }
    },
    [resourceId, resource, roleData, roleName, addToast]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!memberId) return;
      
      setRemovingMemberId(memberId);
      
      try {
        await removeMembersFromRole(resource, resourceId as string, [memberId]);

        const updatedMembers = members.filter(member => member.userId.zucityProfile?.id !== memberId);
        onMembersChange?.(updatedMembers.map((member) => ({
          id: member.userId.zucityProfile?.id,
          name: member.userId.zucityProfile?.username,
          avatar: member.userId.zucityProfile?.avatar,
          address: member.userId.zucityProfile?.id.split(':')[4],
          roleId: member.roleId,
          did: member.userId.zucityProfile?.author?.id,
        } as IMemberItem)));

        addToast({
          title: '成功移除成员',
          description: `已从 ${roleName} 角色中移除成员`,
          color: 'success',
        });
      } catch (error) {
        console.error('移除成员错误:', error);
        addToast({
          title: '移除成员失败',
          description: error instanceof Error ? error.message : '发生未知错误',
          color: 'danger',
        });
      } finally {
        setRemovingMemberId(null);
      }
    },
    [resourceId, resource, members, roleName, onMembersChange, addToast]
  );

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
        isOpen={openDrawer}
        onClose={closeAddMemberDrawer}
        roleName={roleName}
        onAddMembers={handleAddMembers}
        isLoading={isAddingMembers}
      />
    </div>
  );
};

export default MemberManagement;
