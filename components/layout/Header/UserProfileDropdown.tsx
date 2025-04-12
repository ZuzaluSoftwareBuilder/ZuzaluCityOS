'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/base';
import Copy from '@/components/biz/common/Copy';
import { useCeramicContext } from '@/context/CeramicContext';
import { formatUserName } from '@/utils/format';
import { Avatar, Image } from '@heroui/react';
import { SignOut, UserSquare, Wallet } from '@phosphor-icons/react';

export interface IUserProfileDropdown {
  avatarSize?: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleProfile: () => void;
  handlePassport: () => void;
  handleLogout: () => void;
  displayAddress: string;
  address: string;
}

const UserProfileDropdown = ({
  avatarSize = 28,
  isOpen,
  onOpenChange,
  handleProfile,
  handlePassport,
  handleLogout,
  displayAddress,
  address,
}: IUserProfileDropdown) => {
  const { username, profile } = useCeramicContext();

  const formattedName = formatUserName(username);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom-end"
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
      <DropdownMenu aria-label="userProfile" closeOnSelect={true}>
        <DropdownItem key="profileInfo">
          <Copy
            text={address}
            message={'Wallet address copied'}
            useCustomChildren={true}
          >
            <div className="flex w-[full] items-center gap-[10px] rounded-[8px] p-[5px] hover:bg-[rgba(255,255,255,0.05)]">
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
          </Copy>
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
