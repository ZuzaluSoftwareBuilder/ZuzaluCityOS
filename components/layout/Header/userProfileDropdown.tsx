'use client';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Image,
} from '@heroui/react';
import { Button } from '@/components/base';
import React from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { formatUserName } from '@/utils/format';
import { UserSquare, Wallet, SignOut } from '@phosphor-icons/react';

export interface IUserProfileDropdown {
  avatarSize?: number;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  handleProfile: () => void;
  handlePassport: () => void;
  handleLogout: () => void;
  displayAddress: string;
}

const UserProfileDropdown = ({
  avatarSize = 28,
  isOpen,
  onOpen,
  onClose,
  handleProfile,
  handlePassport,
  handleLogout,
  displayAddress,
}: IUserProfileDropdown) => {
  const { username, profile } = useCeramicContext();

  const formattedName = formatUserName(username);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={onOpen}
      onClose={onClose}
      placement="bottom-end"
      classNames={{
        base: [
          'bg-[rgba(34,34,34,0.8)] backdrop-blur-[12px]',
          'border-2 border-[rgba(255,255,255,0.1)]',
          'rounded-[10px]',
          'p-0',
        ],
        content: ['bg-transparent', 'shadow-none', 'p-0', 'rounded-none'],
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.15, ease: 'easeOut' },
          },
          exit: {
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.1, ease: 'easeIn' },
          },
        },
      }}
    >
      <DropdownTrigger>
        <Button className="gap-[6px] bg-transparent text-[16px] font-[500] leading-[1.2] text-white">
          <Image
            src={profile?.avatar ?? '/user/avatar_p.png'}
            alt="avatar"
            height={avatarSize}
            width={avatarSize}
            className="object-cover"
          />
          {formattedName}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="userProfile"
        closeOnSelect={true}
        className="w-[220px] bg-transparent"
        classNames={{
          base: ['p-[10px]'],
          list: ['gap-[10px]'],
        }}
        style={{
          willChange: 'opacity, transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden' as const,
        }}
        itemClasses={{
          base: [
            'p-0',
            'data-[hover=true]:bg-transparent',
            'dark:data-[hover=true]:bg-transparent',
          ],
        }}
      >
        <DropdownItem key="profileInfo">
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <div className="rounder-[8px] flex w-[full] items-center gap-[10px] p-[5px] hover:bg-[rgba(255,255,255,0.05)]">
            <Avatar
              src={profile?.avatar ?? '/user/avatar_p.png'}
              alt="avatar"
              className="size-[40px] shrink-0"
            />
            <div className="w-[128px]">
              <p className="truncate text-[16px] font-[500] leading-[1.2] text-[white]">
                {username}
              </p>
              <p className="mt-[5px] text-[13px] leading-[1.4] text-[white] opacity-70">
                {displayAddress}
              </p>
            </div>
          </div>
        </DropdownItem>
        <DropdownItem key="profileEntry">
          <Button
            onPress={handleProfile}
            startContent={
              <UserSquare size={24} weight="fill" format="Stroke" />
            }
            className="h-[30px] w-full justify-start bg-transparent px-[8px] opacity-60 hover:bg-[rgba(255,255,255,0.1)] hover:opacity-100"
          >
            My Profile
          </Button>
        </DropdownItem>
        <DropdownItem key="passportEntry">
          <Button
            onPress={handlePassport}
            startContent={<Wallet size={24} weight="fill" format="Stroke" />}
            className="h-[30px] w-full justify-start bg-transparent px-[8px] opacity-60 hover:bg-[rgba(255,255,255,0.1)] hover:opacity-100"
          >
            My Passport
          </Button>
        </DropdownItem>
        <DropdownItem key="delete">
          <div className="border-t border-[rgba(255,255,255,0.1)] pt-[10px]">
            <Button
              onPress={handleLogout}
              startContent={
                <SignOut
                  size={24}
                  weight="fill"
                  format="Stroke"
                  className="text-[#FF5E5E]"
                />
              }
              className="h-[30px] w-full justify-start bg-transparent px-[8px] text-[#FF5E5E] hover:bg-[rgba(255,94,94,0.20)]"
            >
              Logout
            </Button>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfileDropdown;
