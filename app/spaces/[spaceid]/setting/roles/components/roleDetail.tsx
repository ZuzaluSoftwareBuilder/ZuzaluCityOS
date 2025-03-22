'use client';

import React, { useEffect, useCallback } from 'react';
import { Button, Tabs, Tab, cn, Skeleton, Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import {
  CaretLeft,
  Info,
  IdentificationBadge,
  DotsThree,
} from '@phosphor-icons/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Display from './display';
import Permission, { PermissionList } from './permission';
import MemberManagement from './members/memberManagement';
import { Profile, RolePermission, UserRole } from '@/types';
import useOpenDraw from '@/hooks/useOpenDraw';
import { isMobile } from '@/utils';

interface RoleType {
  id: number;
  name: string;
}

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
  const { open, handleOpen, handleClose } = useOpenDraw()
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
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    if (!currentRoleData && roleData.length > 0) {
      router.push(pathname);
    }
  }, [currentRoleData, router, pathname, roleData]);

  return (
    <div className="flex gap-10 relative">
      <div className="hidden flex-col gap-5 w-[180px] p-[10px] absolute top-0 left-0 pc:flex">
        <Button
          className="bg-[#2C2C2C] text-white py-2 px-3.5 flex items-center gap-[5px] rounded-lg text-[13px] font-medium w-[82px] h-[30px]"
          startContent={<CaretLeft size={18} weight="light" />}
          onPress={handleBack}
        >
          Back
        </Button>

        <div className="flex flex-col gap-2.5">
          {isLoading
            ? Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center w-full gap-[5px] p-[5px_10px] rounded-lg"
                >
                  <IdentificationBadge
                    size={20}
                    weight="fill"
                    className="text-white opacity-40"
                  />
                  <Skeleton className="w-24 h-5 rounded" />
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
                onClick={() => handleRoleSelect(item.role.name)}
              >
                <IdentificationBadge
                  size={20}
                  weight="fill"
                  className="text-white opacity-40"
                />
                <span className="text-white text-[13px] font-medium">
                  {item.role.name}
                </span>
              </div>
            ))}
        </div>

        <Drawer
          isOpen={open}
          onClose={handleClose}
          placement={'bottom'}
          isDismissable={false}
          className='xl:hidden pc:hidden'
          classNames={{
            wrapper: ['z-[1100]'],
            base: cn(
              'bg-[rgba(34,34,34,0.8)] border-[rgba(255,255,255,0.06)] backdrop-blur-[20px] rounded-none',
              'w-full border-t rounded-t-[16px]'
            ),
          }}
        >
          <DrawerContent>
            <DrawerHeader className={cn(
              'flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] p-[10px] pb-[14px]',
            )}>
              {/* TODO mobile style nneed update by PM */}
              <div className="w-full flex flex-col items-center">
                <h3 className="text-[18px] font-bold text-white leading-[1.4] text-left">
                  Roles
                </h3>
              </div>
            </DrawerHeader>
            <DrawerBody
              className={cn(
                'flex flex-col gap-[20px]',
                'p-[16px] pb-[24px]',
              )}
            >
              <div className="flex flex-col gap-2.5">
                {isLoading
                  ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center w-full gap-[5px] p-[5px_10px] rounded-lg"
                      >
                        <IdentificationBadge
                          size={20}
                          weight="fill"
                          className="text-white opacity-40"
                        />
                        <Skeleton className="w-24 h-5 rounded" />
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
                      onClick={() => handleRoleSelect(item.role.name)}
                    >
                      <IdentificationBadge
                        size={20}
                        weight="fill"
                        className="text-white opacity-40"
                      />
                      <span className="text-white text-[13px] font-medium">
                        {item.role.name}
                      </span>
                    </div>
                  ))}
              </div>
            </DrawerBody>
          </DrawerContent>

        </Drawer>

      </div>

      <div className="flex flex-col gap-[30px] w-full pc:w-[600px] p-5 ml-[220px] xl:mx-auto mobile:p-0 mobile:ml-0 tablet:ml-0">
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-5">
                <h2 className="text-white text-[18px] font-semibold">
                  Edit Fixed Role:
                </h2>
                <div className="flex items-center gap-[5px] rounded">
                  <IdentificationBadge
                    size={24}
                    weight="fill"
                    className="text-white opacity-40"
                  />
                  <span className="text-white text-[16px] font-semibold">
                    {currentRole}
                  </span>
                </div>
              </div>
              <Button isIconOnly variant="light" className="xl:hidden pc:hidden min-w-0 px-0" onPress={handleOpen}>
                <DotsThree size={24} weight='bold' format='Stroke' />
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
              <div className="flex items-center gap-2.5 bg-[rgba(255,156,102,0.1)] border border-[rgba(255,156,102,0.1)] rounded-lg p-2.5">
                <Info
                  size={20}
                  className="text-[#FF9C66]"
                  weight="light"
                  format="stroke"
                />
                <span className="text-[#FF9C66] text-[14px]">
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
