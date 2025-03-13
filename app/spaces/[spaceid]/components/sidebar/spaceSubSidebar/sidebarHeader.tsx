import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Skeleton,
} from '@heroui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Space } from '@/types';
import { HTMLAttributes, ReactNode, useMemo } from 'react';
import {
  UserPlusIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  BellAlertIcon,
} from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';

export interface ISidebarHeaderProps {
  isAdmin?: boolean;
  space?: Space;
  onCloseDrawer?: () => void;
  isLoading?: boolean;
}

export function SidebarHeaderSkeleton() {
  return (
    <div
      className="w-[259px] h-[55px] relative cursor-default select-none backdrop-filter"
      style={{
        background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
        transform: 'none',
      }}
    >
      <div className="w-full h-full flex justify-between items-center px-[14px] py-[10px] bg-[rgba(34,34,34,0.8)]">
        <div className="flex justify-between items-center gap-2.5">
          <Skeleton className="w-[35px] h-[35px] rounded-full" />
          <Skeleton className="w-[156px] h-[21px] rounded-[4px]" />
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
          onPress={() => {
            router.push(`/spaces/${space?.id}/edit`);
            if (onCloseDrawer) onCloseDrawer();
          }}
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
  }, [onCloseDrawer, router, space?.id]);

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
      <DropdownTrigger className="transition-none transform-none">
        <div
          className="w-[259px] h-[55px] relative group cursor-pointer select-none backdrop-filter backdrop-blur-[22px]"
          style={{
            background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
            transform: 'none',
          }}
        >
          <div className="w-full h-full flex justify-between items-center px-[14px] py-[10px] border-b border-[rgba(255,255,255,0.1)] bg-[rgba(34,34,34,0.8)] group-hover:bg-[rgba(34,34,34,0.5)] transition-colors">
            <div className="flex justify-between items-center gap-2.5">
              {space?.avatar && (
                <Image
                  src={space?.avatar}
                  alt={space?.name || 'Community'}
                  width={35}
                  height={35}
                  className="w-[35px] h-[35px] rounded-full object-cover"
                />
              )}
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
        className="w-[240px] p-[10px] rounded-[10px] bg-transparent flex flex-col gap-2.5 border border-[rgba(255,255,255,0.1)]"
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
