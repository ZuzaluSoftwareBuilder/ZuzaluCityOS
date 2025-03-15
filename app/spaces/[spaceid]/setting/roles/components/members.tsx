import React, { useState, useCallback } from 'react';
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

interface MembersProps {
  onSearch: (query: string) => void;
  onAddMember: () => void;
}

export const Members: React.FC<MembersProps> = ({ onSearch, onAddMember }) => {
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
        radius="md"
        onPress={onAddMember}
      >
        Add Members
      </Button>
    </div>
  );
};

interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MemberListProps {
  members: Member[];
  onRemoveMember: (memberId: string) => void;
  roleName: string;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onRemoveMember,
  roleName,
}) => {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  const handleRemoveClick = useCallback((member: Member) => {
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
        <span className="text-sm font-semibold text-white/60">Actions</span>
      </div>

      <div className="flex flex-col w-full">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between w-full px-2 py-1"
          >
            <div className="flex items-center gap-2.5">
              <Avatar
                src={member.avatarUrl || '/user/avatar_p.png'}
                alt={member.name}
                className="w-8 h-8"
              />
              <span className="text-sm font-semibold text-[#BFFF66]">
                {member.name}
              </span>
            </div>
            <Button
              isIconOnly
              variant="light"
              className="bg-[rgba(255,255,255,0.05)] w-10 h-10 min-w-0 rounded-full"
              onPress={() => handleRemoveClick(member)}
            >
              <X size={16} className="text-white" />
            </Button>
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
              Remove following member from {roleName}
            </p>
            {memberToRemove && (
              <div className="flex items-center justify-center w-full gap-2.5 py-2.5 border border-[rgba(255,255,255,0.1)] rounded-lg">
                <Avatar
                  src={memberToRemove.avatarUrl || '/user/avatar_p.png'}
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

// 示例成员数据
const initialMembers = [
  {
    id: '1',
    name: 'Minnie_Zboncak',
    avatarUrl: '/user/avatar_p.png',
  },
  {
    id: '2',
    name: 'Alex_Johnson',
    avatarUrl: '/user/avatar_p.png',
  },
  {
    id: '3',
    name: 'Lisa_Moore',
    avatarUrl: '/user/avatar_p.png',
  },
];

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');

  // 处理搜索
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
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  }, []);

  // 过滤成员列表
  const filteredMembers = searchQuery
    ? members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : members;

  return (
    <div className="flex flex-col w-full gap-10">
      <Members onSearch={handleSearch} onAddMember={handleAddMember} />

      <MemberList
        members={filteredMembers}
        onRemoveMember={handleRemoveMember}
        roleName="Admin"
      />
    </div>
  );
};

export default MemberManagement;
