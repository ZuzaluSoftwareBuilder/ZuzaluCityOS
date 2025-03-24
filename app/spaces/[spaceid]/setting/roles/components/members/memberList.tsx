import React, { useCallback, useState } from 'react';
import {
  MemberItem,
  MemberEmpty,
  MemberSkeleton,
} from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';
import {
  Avatar,
  Button,
} from '@heroui/react';
import { 
  Modal, 
  ModalContent, 
  ModalBody,
  ModalFooter,
  CommonModalHeader 
} from '@/components/base/modal';
import { X } from '@phosphor-icons/react';
import { RolePermission } from '@/types';
import { IMemberItem } from './memberManagement';
import useOpenDraw from '@/hooks/useOpenDraw';

export interface MemberListProps {
  members: IMemberItem[];
  onRemoveMember: (memberId: string) => Promise<void>;
  currentRole?: RolePermission;
  canManageRole: boolean;
  isLoading: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onRemoveMember,
  currentRole,
  canManageRole,
  isLoading,
}) => {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<IMemberItem | null>(
    null,
  );

  const handleRemoveClick = useCallback((member: IMemberItem) => {
    setMemberToRemove(member);
    handleOpen();
  }, [handleOpen]);

  const handleConfirmRemove = useCallback(async () => {
    if (memberToRemove) {
      try {
        setIsRemovingMember(true);
        await onRemoveMember(memberToRemove.id);
        handleClose();
        setMemberToRemove(null);
      } finally {
        setIsRemovingMember(false);
      }
    }
  }, [handleClose, memberToRemove, onRemoveMember]);

  const handleCancelRemove = useCallback(() => {
    if (isRemovingMember) return;
    handleClose();
    setMemberToRemove(null);
  }, [handleClose, isRemovingMember]);

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex items-center w-full">
        <span className="flex-1 text-sm font-semibold text-white/60">
          Members with This Role
        </span>
        {canManageRole && (
          <span className="text-sm font-semibold text-white/60">Actions</span>
        )}
      </div>

      <div className="flex flex-col w-full">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <MemberSkeleton key={`skeleton-${index}`} />
          ))
        ) : members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between w-full px-2 py-1 h-[48px]"
            >
              <MemberItem
                avatarUrl={member.avatar || '/user/avatar_p.png'}
                name={member.name}
                address={member.address}
              />
              {canManageRole && (
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
          ))
        ) : (
          <MemberEmpty description={'There are no members with this role yet. Add members to assign this role.'} />
        )}
      </div>

      <Modal
        placement="center"
        isOpen={open}
        onClose={isRemovingMember ? undefined : handleCancelRemove}
        isDismissable={false}
      >
        <ModalContent>
          <CommonModalHeader
            title="Remove Member From Role?"
            onClose={handleCancelRemove}
            isDisabled={isRemovingMember}
          />
          <ModalBody className="p-[0_20px] gap-5">
            <p className="text-white/70 text-sm">
              Remove following member from <strong>{currentRole?.role.name}</strong>
            </p>
            {memberToRemove && (
              <div className="flex items-center justify-center w-full gap-2.5 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-lg">
                <MemberItem
                  avatarUrl={memberToRemove.avatar || '/user/avatar_p.png'}
                  name={memberToRemove.name}
                  address={memberToRemove.address}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter className="p-[20px]">
            <div className="flex justify-between w-full gap-2.5">
              <Button
                className="flex-1 h-[38px] bg-transparent border border-[rgba(255,255,255,0.1)] text-white font-bold"
                radius="md"
                onPress={handleCancelRemove}
                disabled={isRemovingMember}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-[38px] bg-[rgba(255,94,94,0.1)] border border-[rgba(255,94,94,0.2)] text-[#FF5E5E] font-bold"
                radius="md"
                onPress={handleConfirmRemove}
                isLoading={isRemovingMember}
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
