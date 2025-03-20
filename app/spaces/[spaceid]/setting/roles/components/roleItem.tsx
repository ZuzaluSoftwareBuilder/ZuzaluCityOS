import { Key, useMemo } from 'react';

import { usePathname } from 'next/navigation';
import { Role, RolePermission, UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import {
  DotsThreeVertical,
  IdentificationBadge,
  User,
} from '@phosphor-icons/react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from '@heroui/react';

interface RoleItemProps {
  item: RolePermission;
  members: UserRole[];
}

export const RoleItemSkeleton = () => {
  return (
    <div className="flex items-center w-full border-b border-[rgba(255,255,255,0.1)] pb-[10px] h-[40px] box-content gap-[5px]">
      <div className="flex items-center gap-[5px] flex-1">
        <IdentificationBadge
          size={24}
          weight="fill"
          className="text-white opacity-20"
        />
        <Skeleton className="h-5 w-32 rounded" />
      </div>

      <div className="flex justify-between flex-1 mobile:w-[100px] mobile:flex-none mobile:shrink-0">
        <div className="flex items-center gap-1.5 w-24">
          <Skeleton className="h-4 w-7 rounded" />
          <User size={24} weight="fill" className="text-white opacity-20" />
        </div>

        <Skeleton className="w-10 h-10 rounded-full mobile:hidden" />
      </div>
    </div>
  );
};

export const RoleItem = ({ item, members }: RoleItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleRoleClick = useCallback(
    (role: Role) => {
      router.push(`${pathname}?role=${role.name}&tab=display`);
    },
    [pathname, router],
  );

  const handleRoleMenu = useCallback(
    (key: Key, role: Role) => {
      router.push(`${pathname}?role=${role.name}&tab=${key}`);
    },
    [pathname, router],
  );

  const roleCount = useMemo(() => {
    if (item.role.level === 'owner') return 1;
    return members.filter((member) => {
      return member.roleId === item.role.id;
    }).length;
  }, [item.role.level, item.role.id, members]);

  return (
    <div
      className="flex items-center w-full border-b border-[rgba(255,255,255,0.1)] pb-[10px] h-[40px] box-content gap-[5px] cursor-pointer"
      onClick={() => handleRoleClick(item.role)}
    >
      <div className="flex items-center gap-[5px] flex-1">
        <IdentificationBadge
          size={24}
          weight="fill"
          className="text-white opacity-40"
        />
        <span className="text-white text-base font-medium mobile:w-[50vw] truncate">
          {item.role.name}
        </span>
      </div>

      <div className="flex justify-between flex-1 mobile:w-[100px] mobile:flex-none mobile:shrink-0">
        <div className="flex items-center gap-1.5 w-24">
          <span className="text-white text-[13px]">{roleCount}</span>
          <User size={24} weight="fill" className="text-white opacity-40" />
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              radius="full"
              className="w-10 h-10 bg-[rgba(255,255,255,0.05)] mobile:hidden"
              variant="flat"
            >
              <DotsThreeVertical size={16} className="text-white" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu onAction={(key) => handleRoleMenu(key, item.role)}>
            <DropdownItem key="permissions">View Permissions</DropdownItem>
            <DropdownItem key="members">View Members</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};
