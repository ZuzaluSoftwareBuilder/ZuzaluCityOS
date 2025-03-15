'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Tabs, Tab, Input, cn } from '@heroui/react';
import {
  CaretLeft,
  DotsThree,
  Info,
  IdentificationBadge,
} from '@phosphor-icons/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface RoleType {
  id: number;
  name: string;
}

export default function RoleDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState('display');
  const [roleName, setRoleName] = useState('RoleOne');

  const currentRole = searchParams.get('role') || 'Owner';

  const fixedRoles: RoleType[] = [
    { id: 1, name: 'Owner' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Member' },
  ];

  const handleBack = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const handleTabChange = useCallback((key: React.Key) => {
    setSelectedTab(key.toString());
  }, []);

  const handleRoleSelect = useCallback(
    (roleName: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('role', roleName);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    setRoleName(currentRole);
  }, [currentRole]);

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div className="flex gap-10">
        <div className="flex flex-col gap-5 w-[180px] p-[10px]">
          <Button
            className="bg-[#2C2C2C] text-white py-2 px-3.5 flex items-center gap-[5px] rounded-lg text-[13px] font-medium w-[82px] h-[30px]"
            startContent={<CaretLeft size={18} weight="light" />}
            onPress={handleBack}
          >
            Back
          </Button>

          <div className="flex flex-col gap-2.5">
            {fixedRoles.map((role) => (
              <div
                key={role.id}
                className={cn(
                  'flex items-center w-full gap-[5px] p-[5px_10px] rounded-lg cursor-pointer',
                  role.name === currentRole ? 'bg-[rgba(255,255,255,0.1)]' : '',
                )}
                onClick={() => handleRoleSelect(role.name)}
              >
                <IdentificationBadge
                  size={20}
                  weight="fill"
                  className="text-white opacity-40"
                />
                <span className="text-white text-[13px] font-medium">
                  {role.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[30px] w-[600px] p-5">
          <div className="w-full flex flex-col gap-10">
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
              </div>

              <div className="border-b border-[rgba(255,255,255,0.1)]">
                <Tabs
                  variant="underlined"
                  selectedKey={selectedTab}
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
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-white text-[16px] font-medium">
                  Role Name
                </label>
                <Input
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] rounded-lg"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  isDisabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
