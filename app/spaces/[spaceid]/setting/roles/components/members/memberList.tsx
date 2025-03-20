import React, { useCallback, useState } from 'react';
import {
  MemberItem,
  MemberEmpty,
  MemberSkeleton,
} from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { X } from '@phosphor-icons/react';
import { RolePermission } from '@/types';
import { IMemberItem } from './memberManagement';

export interface MemberListProps {
  members: IMemberItem[];
  onRemoveMember: (memberId: string) => void;
  currentRole?: RolePermission;
  canManageAdminRole: boolean;
  isLoading: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onRemoveMember,
  currentRole,
  canManageAdminRole,
  isLoading,
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<IMemberItem | null>(null);

  const handleRemoveClick = useCallback((member: IMemberItem) => {
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
          ))
        ) : (
          <MemberEmpty />
        )}
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
