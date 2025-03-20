import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
  cn,
} from '@heroui/react';
import { X } from '@phosphor-icons/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MemberItem, MemberSkeleton } from './memberItem';
import { IMemberItem } from './memberManagement';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import type { SearchUser } from '@/hooks/useSearchUsers';
import { useMediaQuery } from '@mui/material';

interface IAddMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  onAddMembers: (memberIds: string[]) => void;
  isLoading: boolean;
}

export const AddMemberDrawer: React.FC<IAddMemberDrawerProps> = ({
  isOpen,
  onClose,
  roleName,
  onAddMembers,
  isLoading: propIsLoading,
}) => {
  const isMobile = useMediaQuery('(max-width: 809px)');
  
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const {
    searchQuery,
    setSearchQuery,
    searchedUsers,
    isLoading: searchIsLoading,
    error: searchError,
    clearSearch,
  } = useSearchUsers();

  const searchedMembersItems = useMemo(() => {
    return searchedUsers.map(
      (user: SearchUser) =>
        ({
          id: user.id,
          name: user.username,
          avatar: user.avatar,
          address: user.address,
          roleId: null,
        }) as IMemberItem,
    );
  }, [searchedUsers]);

  const filteredMembers = useMemo<IMemberItem[]>(() => {
    return searchQuery ? searchedMembersItems : [];
  }, [searchQuery, searchedMembersItems]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery],
  );

  const handleSelectMember = useCallback((memberId: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      }
      return [...prev, memberId];
    });
  }, []);

  const handleAddMembers = useCallback(() => {
    onAddMembers(selectedMembers);
    setSelectedMembers([]);
    clearSearch();
    onClose();
  }, [onAddMembers, selectedMembers, clearSearch, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMembers([]);
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  const isPageLoading = propIsLoading || searchIsLoading;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={isMobile ? "bottom" : "right"}
      hideCloseButton={true}
      classNames={{
        wrapper: ['z-[1100]'],
        base: cn(
          'bg-[rgba(34,34,34,0.8)] border-[rgba(255,255,255,0.06)] backdrop-blur-[20px] rounded-none',
          isMobile ? 
            'w-full border-t rounded-t-[16px]' : 
            'min-w-[600px] border-l'
        ),
      }}
    >
      <DrawerContent>
        <DrawerHeader className={cn(
          "flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] p-[10px]",
          isMobile && "pb-[14px]"
        )}>
          {isMobile && (
            <div className="w-full flex flex-col items-center">
              <div className="w-[36px] h-[4px] bg-[rgba(255,255,255,0.2)] rounded-full mb-[10px]" />
              <h3 className="text-[18px] font-bold text-white leading-[1.4]">
                Add Members to Role
              </h3>
            </div>
          )}
          
          {!isMobile && (
            <div className="flex items-center gap-[14px]">
              <Button
                variant="light"
                className="rounded-[8px] px-[10px] min-w-[auto] h-[34px] flex gap-[10px]"
                onPress={onClose}
              >
                <X size={20} className="text-white opacity-50" />
                <span className="text-[14px] font-semibold text-white leading-[1.6]">
                  Close
                </span>
              </Button>
              <h3 className="text-[18px] font-bold text-white leading-[1.4]">
                Add Members to Role
              </h3>
            </div>
          )}
        </DrawerHeader>
        <DrawerBody className={cn(
          "flex flex-col gap-[20px]",
          isMobile ? "p-[16px] pb-[24px]" : "p-[20px]"
        )}>
          <div className="w-full relative">
            <Input
              variant="bordered"
              classNames={{
                base: 'bg-[rgba(34,34,34,0.05)] border-[rgba(255,255,255,0.1)]',
                input: 'text-white',
              }}
              placeholder="Search Members"
              radius="md"
              value={searchQuery}
              startContent={
                <MagnifyingGlassIcon className="w-[20px] h-[20px] text-white opacity-50" />
              }
              onChange={handleSearch}
            />
            {searchError && (
              <div className="text-red-500 text-xs mt-1">{searchError}</div>
            )}
          </div>

          <div className={cn(
            "flex flex-col w-full gap-[4px]", 
            isMobile && "max-h-[40vh] overflow-y-auto"
          )}>
            {searchIsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <MemberSkeleton key={`skeleton-${index}`} />
              ))
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member: IMemberItem) => (
                <div
                  key={member.id}
                  className={`flex items-center w-full px-[8px] py-[4px] rounded-[8px] ${
                    selectedMembers.includes(member.id)
                      ? 'bg-[rgba(255,255,255,0.05)]'
                      : ''
                  }`}
                >
                  <Checkbox
                    color="default"
                    isSelected={selectedMembers.includes(member.id)}
                    onValueChange={() => handleSelectMember(member.id)}
                    classNames={{
                      base: cn(
                        "inline-flex w-full gap-[10px]",
                        "items-center justify-start",
                      ),
                      label: "w-full",
                    }}
                  >
                    <MemberItem
                      avatarUrl={member.avatar || '/user/avatar_p.png'}
                      name={member.name}
                      address={member.address}
                    />
                  </Checkbox>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-10">
                <p className="text-white/60 text-base">No members found</p>
              </div>
            )}
          </div>

          <div className={cn(
            'flex justify-end gap-[10px]',
            isMobile && 'mt-[4px]'
          )}>
            <Button
              className={cn(
                "h-[38px] bg-[rgba(255,255,255,0.05)] border-none rounded-[10px] text-white text-[14px] font-bold leading-[1.6]",
                isMobile ? "flex-1" : "w-[120px]"
              )}
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "h-[38px] rgba(103,219,255,0.10) text-[#67DBFF] border border-[rgba(103,219,255,0.2)] rounded-[10px] text-[14px] font-bold leading-[1.6]",
                isMobile ? "flex-1" : "w-[120px]"
              )}
              isDisabled={selectedMembers.length === 0}
              onPress={handleAddMembers}
            >
              Add
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
