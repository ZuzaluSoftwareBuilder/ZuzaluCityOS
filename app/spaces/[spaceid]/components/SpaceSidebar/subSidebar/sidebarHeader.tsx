import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import NextImage from 'next/image'
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Space } from '@/types';
import { HTMLAttributes, ReactNode } from 'react';
import {
  UserPlusIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  BellAlertIcon,
} from '@heroicons/react/20/solid';

export interface ISidebarHeaderProps {
  space?: Space;
  onInvitePeople?: () => void;
  onSpaceSettings?: () => void;
  onPrivacySettings?: () => void;
  onNotificationSettings?: () => void;
}

const SidebarHeader = ({
  space,
  onInvitePeople,
  onSpaceSettings,
  onPrivacySettings,
  onNotificationSettings,
}: ISidebarHeaderProps) => {
  const dropdownItemClass = `w-[220px] h-[32px] bg-transparent focus:bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] group`;
  const iconClass = `w-5 h-5 text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100`;

  return (
    <Dropdown>
      <DropdownTrigger disableAnimation>
        <div
          className="w-[259px] h-[55px] relative group cursor-pointer"
          style={{
            background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full z-10 bg-[rgba(34,34,34,0.8)] backdrop-blur-[44px] transition-colors group-hover:bg-[rgba(34,34,34,0.5)]"></div>
          <div className="absolute top-0 left-0 w-full h-full z-20 flex justify-between items-center px-[14px] py-[10px]">
            <div className="flex justify-between items-center gap-2.5">
              <NextImage
                src={space?.avatar || '/placeholder-avatar.png'}
                alt={space?.name || 'Community'}
                width={35}
                height={35}
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
              <span className="w-[156px] text-white font-semibold text-base truncate">
                {space?.name || 'Community'}
              </span>
            </div>
            <ChevronDownIcon className="size-5 text-white" />
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Space Actions"
        className="w-[240px] p-2.5 bg-[rgba(34,34,34,0.6)] border border-[rgba(255,255,255,0.1)] backdrop-blur-[20px] rounded-[10px] flex flex-col gap-2.5"
      >
        <DropdownItem
          key="InvitePeople"
          className={dropdownItemClass}
          onPress={onInvitePeople}
        >
          <Item
            name="Invite People"
            icon={<UserPlusIcon className={iconClass} />}
          />
        </DropdownItem>
        <DropdownItem
          key="SpaceSettings"
          className={dropdownItemClass}
          onPress={onSpaceSettings}
        >
          <Item
            name="Space Settings"
            icon={<Cog8ToothIcon className={iconClass} />}
          />
        </DropdownItem>
        <DropdownItem
          key="PrivacySettings"
          className={dropdownItemClass}
          onPress={onPrivacySettings}
        >
          <Item
            name="Privacy Settings"
            icon={<ShieldCheckIcon className={iconClass} />}
          />
        </DropdownItem>
        <DropdownItem
          key="NotificationSettings"
          className={dropdownItemClass}
          onPress={onNotificationSettings}
        >
          <Item
            name="Notification Settings"
            icon={<BellAlertIcon className={iconClass} />}
          />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

interface IItemProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  icon: ReactNode;
}

const Item = ({ name, icon, className, ...props }: IItemProps) => {
  return (
    <div
      className={`flex justify-between items-center w-full ${className}`}
      {...props}
    >
      <span className="text-white text-[13px] leading-[18px] font-normal tracking-[0.01em] group-hover:font-bold ">
        {name}
      </span>
      {icon}
    </div>
  );
};

export default SidebarHeader;
