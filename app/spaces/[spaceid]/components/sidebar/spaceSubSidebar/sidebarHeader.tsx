import { Space } from '@/models/space';
import {
  BellAlertIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Skeleton,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { HTMLAttributes, ReactNode, useCallback, useMemo } from 'react';

export interface ISidebarHeaderProps {
  isAdmin?: boolean;
  space?: Space;
  onCloseDrawer?: () => void;
  isLoading?: boolean;
}

export function SidebarHeaderSkeleton() {
  return (
    <div
      className="relative h-[55px] w-[259px] cursor-default select-none"
      style={{
        background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
        transform: 'none',
      }}
    >
      <div className="flex size-full items-center justify-between bg-[rgba(34,34,34,0.8)] px-[14px] py-[10px]">
        <div className="flex items-center justify-between gap-2.5">
          <Skeleton className="size-[35px] rounded-full" />
          <Skeleton className="h-[21px] w-[156px] rounded-[4px]" />
        </div>
        <ChevronDownIcon className="size-5 text-white opacity-50" />
      </div>
    </div>
  );
}

const SidebarHeader = ({
  space,
  isAdmin,
  onCloseDrawer,
  isLoading,
}: ISidebarHeaderProps) => {
  const dropdownItemClass = `w-[220px] h-[32px] bg-transparent focus:bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.05)] group`;
  const iconClass = `w-5 h-5 text-white opacity-50 group-hover:opacity-100 group-focus:opacity-100`;
  const router = useRouter();

  const handleMenuClick = useCallback(
    (
      menu:
        | 'InvitePeople'
        | 'SpaceSettings'
        | 'PrivacySettings'
        | 'NotificationSettings',
    ) => {
      if (menu === 'SpaceSettings') {
        router.push(`/spaces/${space?.id}/setting`);
      }
      if (onCloseDrawer) onCloseDrawer();
    },
    [router, space?.id, onCloseDrawer],
  );

  const menuItems = useMemo(() => {
    return (
      <>
        <DropdownItem
          key="InvitePeople"
          className={dropdownItemClass}
          onPress={() => {}}
        >
          <Item
            name="Invite People"
            icon={<UserPlusIcon className={iconClass} />}
          />
        </DropdownItem>
        <DropdownItem
          key="SpaceSettings"
          className={dropdownItemClass}
          onPress={() => handleMenuClick('SpaceSettings')}
        >
          <Item
            name="Space Settings"
            icon={<Cog8ToothIcon className={iconClass} />}
          />
        </DropdownItem>
        <DropdownItem
          key="PrivacySettings"
          className={dropdownItemClass}
          onPress={() => {}}
        >
          <Item
            name="Privacy Settings"
            icon={<ShieldCheckIcon className={iconClass} />}
          />
        </DropdownItem>
        <DropdownItem
          key="NotificationSettings"
          className={dropdownItemClass}
          onPress={() => {}}
        >
          <Item
            name="Notification Settings"
            icon={<BellAlertIcon className={iconClass} />}
          />
        </DropdownItem>
      </>
    );
  }, [dropdownItemClass, handleMenuClick, iconClass]);

  const dropdownStyles = {
    willChange: 'opacity, transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
  };

  if (isLoading || !space) {
    return <SidebarHeaderSkeleton />;
  }

  return (
    <Dropdown
      classNames={{
        base: [
          'bg-[rgba(34,34,34,0.6)] backdrop-filter backdrop-blur-[20px] p-0 rounded-[10px]',
        ],
        content: ['bg-transparent p-0 z-[50]'],
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
      shouldBlockScroll={false}
      placement="bottom"
    >
      <DropdownTrigger className="transform-none transition-none">
        <div
          className="group relative h-[55px] w-[259px] cursor-pointer select-none backdrop-blur-[22px]"
          style={{
            background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
            transform: 'none',
          }}
        >
          <div className="flex size-full items-center justify-between border-b border-[rgba(255,255,255,0.1)] bg-[rgba(34,34,34,0.8)] px-[14px] py-[10px] transition-colors group-hover:bg-[rgba(34,34,34,0.5)]">
            <div className="flex items-center justify-between gap-2.5">
              {space?.avatar && (
                <Image
                  src={space?.avatar}
                  alt={space?.name || 'Community'}
                  width={35}
                  height={35}
                  className="size-[35px] rounded-full object-cover"
                />
              )}
              <span className="w-[156px] truncate text-base font-semibold text-white">
                {space?.name || 'Community'}
              </span>
            </div>
            <ChevronDownIcon className="size-5 text-white" />
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Space Actions"
        className="flex w-[240px] flex-col gap-2.5 rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-transparent p-[10px]"
        style={dropdownStyles}
        disabledKeys={
          isAdmin
            ? ['InvitePeople', 'PrivacySettings', 'NotificationSettings']
            : [
                'InvitePeople',
                'SpaceSettings',
                'PrivacySettings',
                'NotificationSettings',
              ]
        }
      >
        {menuItems}
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
      className={`flex w-full items-center justify-between ${className}`}
      {...props}
    >
      <span className="text-[13px] font-normal leading-[18px] tracking-[0.01em] text-white group-hover:font-bold ">
        {name}
      </span>
      {icon}
    </div>
  );
};

export default SidebarHeader;
