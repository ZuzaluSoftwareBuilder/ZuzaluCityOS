import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@/components/base/drawer';
import type { SearchUser } from '@/hooks/useSearchUsers';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button, Checkbox, cn, Input, Skeleton } from '@heroui/react';
import { useMediaQuery } from '@mui/material';
import { X } from '@phosphor-icons/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MemberEmpty, MemberItem } from './memberItem';
import { IMemberItem } from './memberManagement';

interface IAddMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  onAddMembers: (memberIds: string[]) => Promise<void>;
  existingMembers?: IMemberItem[];
}

export const AddMemberDrawer: React.FC<IAddMemberDrawerProps> = ({
  isOpen,
  onClose,
  onAddMembers,
  existingMembers = [],
}) => {
  const isMobile = useMediaQuery('(max-width: 809px)');

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [displayedMembers, setDisplayedMembers] = useState<IMemberItem[]>([]);
  const searchHistoryRef = React.useRef<Map<string, IMemberItem>>(new Map());
  const {
    searchQuery,
    setSearchQuery,
    searchedUsers,
    isLoading: searchIsLoading,
    error: searchError,
    clearSearch,
  } = useSearchUsers();

  const searchedMembersItems = useMemo(() => {
    const items = searchedUsers.map(
      (user: SearchUser) =>
        ({
          id: user.id,
          name: user.username,
          avatar: user.avatar,
          address: user.address,
          roleId: null,
          did: user.did,
        }) as IMemberItem,
    );

    items.forEach((item) => {
      searchHistoryRef.current.set(item.did, item);
    });

    return items;
  }, [searchedUsers]);

  const isMemberInRole = useCallback(
    (memberId: string) => {
      return existingMembers.some((member) => member.did === memberId);
    },
    [existingMembers],
  );

  useEffect(() => {
    if (!searchQuery) {
      const selectedMembersItems = selectedMembers.map((memberId) => {
        const existingMember = existingMembers.find((m) => m.did === memberId);
        if (existingMember) return existingMember;

        const historyMember = searchHistoryRef.current.get(memberId);
        if (historyMember) return historyMember;

        return {
          id: memberId,
          name: 'User',
          avatar: '/user/avatar_p.png',
          address: '',
          roleId: null,
          did: memberId,
        } as IMemberItem;
      });

      setDisplayedMembers(selectedMembersItems);
      return;
    }

    if (searchIsLoading) {
      return;
    }

    const searchResultMembers = searchedMembersItems;

    const selectedMembersNotInSearch = selectedMembers
      .filter(
        (memberId) =>
          !searchResultMembers.some((member) => member.did === memberId),
      )
      .map((memberId) => {
        const existingMember = existingMembers.find((m) => m.did === memberId);
        if (existingMember) return existingMember;

        const historyMember = searchHistoryRef.current.get(memberId);
        if (historyMember) return historyMember;

        return {
          id: memberId,
          name: 'User',
          avatar: '/user/avatar_p.png',
          address: '',
          roleId: null,
          did: memberId,
        } as IMemberItem;
      });

    const newDisplayedMembers = [
      ...searchResultMembers,
      ...selectedMembersNotInSearch,
    ];

    const uniqueMembers = newDisplayedMembers.filter(
      (member, index, self) =>
        index === self.findIndex((m) => m.did === member.did),
    );

    setDisplayedMembers(uniqueMembers);
  }, [
    searchQuery,
    searchedMembersItems,
    searchIsLoading,
    selectedMembers,
    existingMembers,
  ]);

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

  const handleAddMembers = useCallback(async () => {
    try {
      setIsAddingMember(true);
      await onAddMembers(selectedMembers);
    } finally {
      setIsAddingMember(false);
    }
  }, [onAddMembers, selectedMembers]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMembers([]);
      setDisplayedMembers([]);
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  useEffect(() => {
    return () => {
      searchHistoryRef.current.clear();
    };
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={isAddingMember ? undefined : onClose}
      placement={isMobile ? 'bottom' : 'right'}
      isDismissable={false}
      hideCloseButton={true}
    >
      <DrawerContent>
        {isMobile ? (
          <CommonDrawerHeader
            title={'Add Members to Role'}
            onClose={onClose}
            isDisabled={isAddingMember}
          />
        ) : (
          <DrawerHeader className={'justify-start gap-[14px]'}>
            <Button
              variant="light"
              className="flex h-[34px] min-w-[auto] gap-[10px] rounded-[8px] px-[10px]"
              onPress={onClose}
              isDisabled={isAddingMember}
            >
              <X size={20} className="text-white opacity-50" />
              <span className="text-[14px] font-semibold leading-[1.6] text-white">
                Close
              </span>
            </Button>
            <h2 className="text-[18px] font-bold leading-[1.4] text-white">
              Add Members to Role
            </h2>
          </DrawerHeader>
        )}

        <DrawerBody
          className={cn(
            'flex flex-col gap-[20px]',
            isMobile ? 'p-[16px] pb-[24px]' : 'p-[20px]',
          )}
        >
          <div className="relative w-full">
            <Input
              variant="bordered"
              classNames={{
                base: 'bg-[rgba(34,34,34,0.05)] border-[rgba(255,255,255,0.1)]',
                input: 'text-white',
              }}
              placeholder="Search Members By Fullname Or Wallet Address"
              radius="md"
              value={searchQuery}
              startContent={
                <MagnifyingGlassIcon className="size-[20px] text-white opacity-50" />
              }
              onChange={handleSearch}
              isDisabled={isAddingMember}
            />
          </div>

          <div
            className={cn(
              'flex flex-col w-full gap-[4px] h-[200px] overflow-y-auto',
              isMobile && 'max-h-[40vh] overflow-y-auto',
            )}
          >
            {searchIsLoading ? (
              Array.from({ length: 1 }).map((_, index) => (
                <MemberSkeletonWithCheckbox key={`skeleton-${index}`} />
              ))
            ) : displayedMembers.length > 0 ? (
              displayedMembers.map((member: IMemberItem) => {
                const isExistingMember = isMemberInRole(member.did);
                const isSelected =
                  selectedMembers.includes(member.did) || isExistingMember;

                return (
                  <div
                    key={member.id}
                    className={`flex w-full items-center rounded-[8px] px-[8px] py-[4px] ${
                      isSelected ? 'bg-[rgba(255,255,255,0.05)]' : ''
                    }`}
                  >
                    <Checkbox
                      color="default"
                      isSelected={isSelected}
                      onValueChange={() => {
                        if (!isExistingMember) {
                          handleSelectMember(member.did);
                        }
                      }}
                      isDisabled={isExistingMember || isAddingMember}
                      classNames={{
                        base: cn(
                          'inline-flex w-full gap-[10px]',
                          'items-center justify-start',
                        ),
                        label: 'w-full',
                      }}
                    >
                      <MemberItem
                        avatarUrl={member.avatar || '/user/avatar_p.png'}
                        name={member.name}
                        address={member.address}
                      />
                    </Checkbox>
                  </div>
                );
              })
            ) : (
              <MemberEmpty />
            )}
          </div>

          <div
            className={cn(
              'flex justify-end gap-[10px]',
              isMobile && 'mt-[4px]',
            )}
          >
            <Button
              className={cn(
                'h-[38px] bg-[rgba(255,255,255,0.05)] border-none rounded-[10px] text-white text-[14px] font-bold leading-[1.6]',
                isMobile ? 'flex-1' : 'w-[120px]',
              )}
              onPress={onClose}
              isDisabled={isAddingMember}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                'h-[38px] rgba(103,219,255,0.10) text-[#67DBFF] border border-[rgba(103,219,255,0.2)] rounded-[10px] text-[14px] font-bold leading-[1.6]',
                isMobile ? 'flex-1' : 'w-[120px]',
              )}
              isDisabled={selectedMembers.length === 0 || isAddingMember}
              onPress={handleAddMembers}
              isLoading={isAddingMember}
            >
              Add
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export const MemberSkeletonWithCheckbox = () => {
  return (
    <div className="flex h-[40px] items-center gap-[10px] p-[4px_8px]">
      <Skeleton className="mr-[10px] size-[20px] rounded-[4px]" />
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-[22px] w-24 rounded-md" />
      <Skeleton className="h-[22px] w-20 rounded-md" />
    </div>
  );
};
