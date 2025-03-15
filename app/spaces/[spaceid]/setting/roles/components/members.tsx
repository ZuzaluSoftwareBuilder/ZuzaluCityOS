import React, { useState, useCallback } from 'react';
import { Input, Button, Avatar } from '@heroui/react';
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
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onRemoveMember,
}) => {
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
              onPress={() => onRemoveMember(member.id)}
            >
              <X size={16} className="text-white" />
            </Button>
          </div>
        ))}
      </div>
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
      />
    </div>
  );
};

export default MemberManagement;
