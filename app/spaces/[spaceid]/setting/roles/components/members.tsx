import React, { useState, useCallback, useMemo } from 'react';
import {
  Input,
  Button,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { X } from '@phosphor-icons/react';
import Member from './member';
import { PermissionName, RolePermission, UserRole } from '@/types';
import { Profile } from '@/types';
import { useSpacePermissions } from '../../../components/permission';

interface MembersProps {
  onSearch: (query: string) => void;
  onAddMember: () => void;
  canManageAdminRole: boolean;
}

export const Members: React.FC<MembersProps> = ({
  onSearch,
  onAddMember,
  canManageAdminRole,
}) => {
  return (
    <div className="flex items-center w-full gap-2.5">
      <Input
        variant="bordered"
        classNames={{
          base: 'bg-[rgba(34,34,34,0.05)] border-[rgba(255,255,255,0.1)]',
          input: 'text-white',
        }}
        placeholder="Search Members"
        radius="md"
        startContent={
          <MagnifyingGlassIcon className="w-4 h-4 text-white opacity-50" />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearch(e.target.value)
        }
      />
      <Button
        className="bg-[rgba(103,219,255,0.2)] p-[8px_14px] text-[#67DBFF] border border-[rgba(103,219,255,0.1)] text-[16px] shrink-0"
        radius="sm"
        isDisabled={!canManageAdminRole}
        onPress={onAddMember}
      >
        Add Members
      </Button>
    </div>
  );
};

interface MemberItem {
  id: string;
  name: string;
  avatar: string;
  address: string;
  roleId: string | null;
}

interface MemberListProps {
  members: MemberItem[];
  onRemoveMember: (memberId: string) => void;
  currentRole?: RolePermission;
  canManageAdminRole: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onRemoveMember,
  currentRole,
  canManageAdminRole,
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<MemberItem | null>(null);

  const handleRemoveClick = useCallback((member: MemberItem) => {
    setMemberToRemove(member);
    setIsRemoveModalOpen(true);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove.id);
      setIsRemoveModalOpen(false);
      setMemberToRemove(null);
    }
  }, [memberToRemove, onRemoveMember]);

  const handleCancelRemove = useCallback(() => {
    setIsRemoveModalOpen(false);
    setMemberToRemove(null);
  }, []);

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex items-center w-full">
        <span className="flex-1 text-sm font-semibold text-white/60">
          Members with This Role
        </span>
        {canManageAdminRole && (
          <span className="text-sm font-semibold text-white/60">Actions</span>
        )}
      </div>

      <div className="flex flex-col w-full">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between w-full px-2 py-1"
          >
            <Member
              avatarUrl={member.avatar || '/user/avatar_p.png'}
              name={member.name}
              address={member.address}
            />
            {canManageAdminRole && (
              <Button
                isIconOnly
                variant="light"
                className="bg-[rgba(255,255,255,0.05)] w-10 h-10 min-w-0 rounded-full"
                onPress={() => handleRemoveClick(member)}
              >
                <X size={16} className="text-white" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal
        placement="center"
        isOpen={isRemoveModalOpen}
        onClose={handleCancelRemove}
        classNames={{
          base: 'bg-[rgba(52,52,52,0.6)] border-[rgba(255,255,255,0.1)] border-[2px] backdrop-blur-[20px] transition-all duration-200',
          wrapper: 'bg-black/40 transition-opacity duration-300',
        }}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.3, ease: 'easeOut' },
            },
            exit: {
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2, ease: 'easeIn' },
            },
          },
        }}
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center p-[20px]">
            <h3 className="text-white font-bold text-base">
              Remove Member From Role?
            </h3>
          </ModalHeader>
          <ModalBody className="p-[0_20px] gap-5">
            <p className="text-white/70 text-sm">
              Remove following member from {currentRole?.role.name}
            </p>
            {memberToRemove && (
              <div className="flex items-center justify-center w-full gap-2.5 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-lg">
                <Avatar
                  src={memberToRemove.avatar || '/user/avatar_p.png'}
                  alt={memberToRemove.name}
                  className="w-8 h-8"
                />
                <span className="text-sm font-semibold text-[#BFFF66]">
                  {memberToRemove.name}
                </span>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="p-[20px]">
            <div className="flex justify-between w-full gap-2.5">
              <Button
                className="flex-1 h-[38px] bg-transparent border border-[rgba(255,255,255,0.1)] text-white font-bold"
                radius="md"
                onPress={handleCancelRemove}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-[38px] bg-[rgba(255,94,94,0.1)] border border-[rgba(255,94,94,0.2)] text-[#FF5E5E] font-bold"
                radius="md"
                onPress={handleConfirmRemove}
              >
                Remove
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

interface MemberManagementProps {
  members: UserRole[];
  owner?: Profile;
  roleData: RolePermission[];
  roleName: string;
}

const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  owner,
  roleData,
  roleName,
}) => {
  const { checkPermission } = useSpacePermissions();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 添加成员
  const handleAddMember = useCallback(() => {
    // 在实际应用中，这里应该打开一个添加成员的模态框
    alert('Add member functionality would open a modal in the real app');
  }, []);

  // 移除成员
  const handleRemoveMember = useCallback((memberId: string) => {
    // setMembers((prev) => prev.filter((member) => member.id !== memberId));
  }, []);

  const currentRole = useMemo(() => {
    return roleData.find((role) => role.role.name === roleName);
  }, [roleData, roleName]);

  const filteredMembers = useMemo(() => {
    const formatedMembers = members.map((member) => {
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
      return {
        id: member.userId.zucityProfile.id,
        name: member.userId.zucityProfile.username,
        avatar: member.userId.zucityProfile.avatar,
        address: member.userId.zucityProfile.author?.id.split(':')[4],
        roleId,
      } as MemberItem;
    });
    const memberList =
      roleName === 'Owner'
        ? [
            {
              id: owner?.id,
              name: owner?.username,
              avatar: owner?.avatar,
              address: owner?.author?.id.split(':')[4],
              roleId: null,
            } as MemberItem,
          ]
        : formatedMembers;
    if (!searchQuery) return memberList || [];

    return memberList.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, owner, roleName, searchQuery]);

  const canManageAdminRole = useMemo(() => {
    if (!currentRole || currentRole.role.level !== 'admin') return false;
    return checkPermission(PermissionName.MANAGE_ADMIN_ROLE);
  }, [currentRole, checkPermission]);

  return (
    <div className="flex flex-col w-full gap-10">
      <Members
        canManageAdminRole={canManageAdminRole}
        onSearch={handleSearch}
        onAddMember={handleAddMember}
      />

      <MemberList
        canManageAdminRole={canManageAdminRole}
        members={filteredMembers}
        onRemoveMember={handleRemoveMember}
        currentRole={currentRole}
      />
    </div>
  );
};

export default MemberManagement;
