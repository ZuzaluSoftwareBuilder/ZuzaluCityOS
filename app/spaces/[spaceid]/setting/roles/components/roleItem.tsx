import { Key, useMemo } from 'react';

import { Role, RolePermission, UserRole } from '@/models/role';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from '@heroui/react';
import {
  DotsThreeVertical,
  IdentificationBadge,
  User,
} from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface RoleItemProps {
  item: RolePermission;
  members: UserRole[];
}

export const RoleItemSkeleton = () => {
  return (
    <div className="box-content flex h-[40px] w-full items-center gap-[5px] border-b border-[rgba(255,255,255,0.1)] pb-[10px]">
      <div className="flex flex-1 items-center gap-[5px]">
        <IdentificationBadge
          size={24}
          weight="fill"
          className="text-white opacity-20"
        />
        <Skeleton className="h-5 w-32 rounded" />
      </div>

      <div className="flex flex-1 justify-between mobile:w-[100px] mobile:flex-none mobile:shrink-0">
        <div className="flex w-24 items-center gap-1.5">
          <Skeleton className="h-4 w-7 rounded" />
          <User size={24} weight="fill" className="text-white opacity-20" />
        </div>

        <Skeleton className="size-10 rounded-full mobile:hidden" />
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
      className="box-content flex h-[40px] w-full cursor-pointer items-center gap-[5px] border-b border-[rgba(255,255,255,0.1)] pb-[10px]"
      onClick={() => handleRoleClick(item.role)}
    >
      <div className="flex flex-1 items-center gap-[5px]">
        <IdentificationBadge
          size={24}
          weight="fill"
          className="text-white opacity-40"
        />
        <span className="truncate text-base font-medium text-white mobile:w-[50vw]">
          {item.role.name}
        </span>
      </div>

      <div className="flex flex-1 justify-between mobile:w-[100px] mobile:flex-none mobile:shrink-0">
        <div className="flex w-24 items-center gap-1.5">
          <span className="text-[13px] text-white">{roleCount}</span>
          <User size={24} weight="fill" className="text-white opacity-40" />
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              radius="full"
              className="size-10 bg-[rgba(255,255,255,0.05)] mobile:hidden"
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
