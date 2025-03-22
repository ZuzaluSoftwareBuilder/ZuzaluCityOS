import React from 'react';
import { Button, Input } from '@heroui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export interface IAddMembersSubHeaderProps {
  onSearch: (query: string) => void;
  onAddMember: () => void;
  canManageRole: boolean;
}

export const AddMemberSubHeader: React.FC<IAddMembersSubHeaderProps> = ({
  onSearch,
  onAddMember,
  canManageRole,
}) => {
  return (
    <div className="flex items-center w-full gap-2.5 mobile:flex-col">
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
        className="bg-[rgba(103,219,255,0.2)] p-[8px_14px] text-[#67DBFF] border border-[rgba(103,219,255,0.1)] text-[16px] shrink-0 mobile:w-full"
        radius="sm"
        onPress={onAddMember}
        isDisabled={!canManageRole}
      >
        Add Members
      </Button>
    </div>
  );
};
