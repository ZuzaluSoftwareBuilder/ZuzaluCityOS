'use client';

import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base';
import useOpenDraw from '@/hooks/useOpenDraw';
import { Profile } from '@/models/profile';
import { RolePermission, UserRole } from '@/models/role';
import { Button, cn, Skeleton, Tab, Tabs } from '@heroui/react';
import {
  CaretLeft,
  CaretUpDown,
  IdentificationBadge,
  Info,
} from '@phosphor-icons/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import Display from './display';
import MemberManagement from './members/memberManagement';
import { PermissionList } from './permission';

interface RoleListProps {
  roleData: RolePermission[];
  isLoading: boolean;
  currentRole: string;
  onRoleSelect: (_roleName: string) => void;
}

const RoleList: React.FC<RoleListProps> = ({
  roleData,
  isLoading,
  currentRole,
  onRoleSelect,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {isLoading
        ? Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex w-full items-center gap-[5px] rounded-lg p-[5px_10px]"
              >
                <IdentificationBadge
                  size={20}
                  weight="fill"
                  className="text-white opacity-40"
                />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
            ))
        : roleData.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center w-full gap-[5px] p-[5px_10px] rounded-lg cursor-pointer',
                item.role.name === currentRole
                  ? 'bg-[rgba(255,255,255,0.1)]'
                  : '',
              )}
              onClick={() => onRoleSelect(item.role.name)}
            >
              <IdentificationBadge
                size={20}
                weight="fill"
                className="text-white opacity-40"
              />
              <span className="text-[13px] font-medium text-white">
                {item.role.name}
              </span>
            </div>
          ))}
    </div>
  );
};

interface RoleDetailProps {
  roleData: RolePermission[];
  isLoading: boolean;
  members: UserRole[];
  owner?: Profile;
}

export default function RoleDetail({
  roleData,
  isLoading,
  members,
  owner,
}: RoleDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open, handleOpen, handleClose } = useOpenDraw();
  const pathname = usePathname()!;
  const currentRole = searchParams?.get('role') || 'Owner';
  const currentTab = searchParams?.get('tab') || 'display';

  const currentRoleData = React.useMemo(
    () => roleData.find((item) => item.role.name === currentRole),
    [roleData, currentRole],
  );

  const handleBack = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const handleTabChange = useCallback(
    (key: React.Key) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('tab', key.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleRoleSelect = useCallback(
    (roleName: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('role', roleName);
      router.push(`${pathname}?${params.toString()}`);
      handleClose();
    },
    [router, pathname, searchParams, handleClose],
  );

  useEffect(() => {
    if (!currentRoleData && roleData.length > 0) {
      router.push(pathname);
    }
  }, [currentRoleData, router, pathname, roleData]);

  return (
    <div className="relative flex gap-10">
      <div className="absolute left-0 top-0 hidden w-[180px] flex-col gap-5 p-[10px] pc:flex">
        <Button
          className="flex h-[30px] w-[82px] items-center gap-[5px] rounded-lg bg-[#2C2C2C] px-3.5 py-2 text-[13px] font-medium text-white"
          startContent={<CaretLeft size={18} weight="light" />}
          onPress={handleBack}
        >
          Back
        </Button>

        <RoleList
          roleData={roleData}
          isLoading={isLoading}
          currentRole={currentRole}
          onRoleSelect={handleRoleSelect}
        />

        <Drawer
          isOpen={open}
          onClose={handleClose}
          placement={'bottom'}
          isDismissable={false}
          hideCloseButton={true}
          className="xl:hidden pc:hidden"
        >
          <DrawerContent>
            <CommonDrawerHeader title={'Roles'} onClose={handleClose} />

            <DrawerBody
              className={cn('flex flex-col gap-[20px]', 'p-[16px] pb-[24px]')}
            >
              <RoleList
                roleData={roleData}
                isLoading={isLoading}
                currentRole={currentRole}
                onRoleSelect={handleRoleSelect}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="ml-[220px] flex w-full flex-col gap-[30px] p-5 xl:mx-auto pc:w-[600px] tablet:ml-0 mobile:ml-0 mobile:p-0">
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-5">
                <h2 className="text-[18px] font-semibold text-white">
                  Edit Fixed Role:
                </h2>
                <div className="flex items-center gap-[5px] rounded">
                  <IdentificationBadge
                    size={24}
                    weight="fill"
                    className="text-white opacity-40"
                  />
                  <span className="text-[16px] font-semibold text-white">
                    {currentRole}
                  </span>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                className="min-w-0 px-0 xl:hidden pc:hidden"
                onPress={handleOpen}
              >
                <CaretUpDown size={24} weight="light" className="text-white" />
              </Button>
            </div>

            <div className="border-b border-[rgba(255,255,255,0.1)]">
              <Tabs
                variant="underlined"
                selectedKey={currentTab}
                onSelectionChange={handleTabChange}
                classNames={{
                  tabList: 'gap-0 w-full p-0',
                  tab: 'p-[10px] text-[16px] font-semibold text-white',
                  cursor: 'w-full',
                }}
              >
                <Tab key="display" title="Display" />
                <Tab key="permissions" title="Permissions" />
                <Tab key="members" title="Members" />
              </Tabs>
            </div>
            {currentTab !== 'members' && (
              <div className="flex items-center gap-2.5 rounded-lg border border-[rgba(255,156,102,0.1)] bg-[rgba(255,156,102,0.1)] p-2.5">
                <Info
                  size={20}
                  className="text-[#FF9C66]"
                  weight="light"
                  format="stroke"
                />
                <span className="text-[14px] text-[#FF9C66]">
                  Fixed roles cannot be configured as they are hard-coded into
                  the structure
                </span>
              </div>
            )}
          </div>
          {currentTab === 'display' && <Display roleName={currentRole} />}
          {currentTab === 'permissions' && (
            <PermissionList
              roleData={roleData}
              roleDataLoading={isLoading}
              roleName={currentRole}
            />
          )}
          {currentTab === 'members' && (
            <MemberManagement
              owner={owner}
              members={members}
              roleData={roleData}
              roleName={currentRole}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
