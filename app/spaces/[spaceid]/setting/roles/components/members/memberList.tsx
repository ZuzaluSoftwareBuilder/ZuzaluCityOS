import {
  MemberEmpty,
  MemberItem,
  MemberSkeleton,
} from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';
import {
  CommonModalHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/components/base/modal';
import useOpenDraw from '@/hooks/useOpenDraw';
import { RolePermission } from '@/models/role';
import { Button } from '@heroui/react';
import { X } from '@phosphor-icons/react';
import React, { useCallback, useState } from 'react';
import { IMemberItem } from './memberManagement';

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

  const handleRemoveClick = useCallback(
    (member: IMemberItem) => {
      setMemberToRemove(member);
      handleOpen();
    },
    [handleOpen],
  );

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
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full items-center">
        <span className="flex-1 text-sm font-semibold text-white/60">
          Members with This Role
        </span>
        {canManageRole && (
          <span className="text-sm font-semibold text-white/60">Actions</span>
        )}
      </div>

      <div className="flex w-full flex-col">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <MemberSkeleton key={`skeleton-${index}`} />
          ))
        ) : members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="flex h-[48px] w-full items-center justify-between px-2 py-1"
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
                  className="size-10 min-w-0 rounded-full bg-[rgba(255,255,255,0.05)]"
                  onPress={() => handleRemoveClick(member)}
                >
                  <X size={16} className="text-white" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <MemberEmpty
            description={
              'There are no members with this role yet. Add members to assign this role.'
            }
          />
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
          <ModalBody className="gap-5 p-[0_20px]">
            <p className="text-sm text-white/70">
              Remove following member from{' '}
              <strong>{currentRole?.role.name}</strong>
            </p>
            {memberToRemove && (
              <div className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[rgba(255,255,255,0.1)] py-2.5">
                <MemberItem
                  avatarUrl={memberToRemove.avatar || '/user/avatar_p.png'}
                  name={memberToRemove.name}
                  address={memberToRemove.address}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter className="p-[20px]">
            <div className="flex w-full justify-between gap-2.5">
              <Button
                className="h-[38px] flex-1 border border-[rgba(255,255,255,0.1)] bg-transparent font-bold text-white"
                radius="md"
                onPress={handleCancelRemove}
                disabled={isRemovingMember}
              >
                Cancel
              </Button>
              <Button
                className="h-[38px] flex-1 border border-[rgba(255,94,94,0.2)] bg-[rgba(255,94,94,0.1)] font-bold text-[#FF5E5E]"
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
