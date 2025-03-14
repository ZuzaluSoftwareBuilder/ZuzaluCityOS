'use client';
import React, { Key, useCallback, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import {
  DotsThreeVertical,
  IdentificationBadge,
  User,
} from '@phosphor-icons/react';

interface Role {
  id: number;
  name: string;
  members: number;
}

export default function RolesPage() {
  const fixedRoles: Role[] = [
    { id: 2, name: 'Owner', members: 1 },
    { id: 3, name: 'Admin', members: 0 },
    { id: 1, name: 'Member', members: 0 },
    { id: 4, name: 'Follower', members: 0 },
  ];

  const handleRoleClick = useCallback(() => {
    console.log('role click');
  }, []);

  const handleRoleMenu = useCallback((key: Key) => {
    console.log(key);
  }, []);

  return (
    <div className="w-full h-full p-[20px_40px_0] flex flex-col gap-10 mobile:p-[20px]">
      <div className="w-full">
        <div className="w-full pc:w-[560px] pc:box-content p-[20px] mx-auto flex flex-col gap-[40px] mobile:p-0">
          <h2 className="text-white text-lg font-semibold leading-[1.2]">
            Fixed Roles
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-center w-full gap-[5px]">
              <span className="flex-1 text-white opacity-60 text-sm font-semibold">
                Roles
              </span>
              <span className="flex-1 text-white opacity-60 text-sm font-semibold mobile:w-[100px] mobile:flex-none">
                Members
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {fixedRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center w-full border-b border-[rgba(255,255,255,0.1)] pb-[10px] h-[40px] box-content gap-[5px] cursor-pointer"
                  onClick={handleRoleClick}
                >
                  <div className="flex items-center gap-[5px] flex-1">
                    <IdentificationBadge
                      size={24}
                      weight="fill"
                      className="text-white opacity-40"
                    />
                    <span className="text-white text-base font-medium mobile:w-[50vw] truncate">
                      {role.name}
                    </span>
                  </div>

                  <div className="flex justify-between flex-1 mobile:w-[100px] mobile:flex-none mobile:shrink-0">
                    <div className="flex items-center gap-1.5 w-24">
                      <span className="text-white text-[13px]">
                        {role.members}
                      </span>
                      <User
                        size={24}
                        weight="fill"
                        className="text-white opacity-40"
                      />
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
                      <DropdownMenu onAction={handleRoleMenu}>
                        <DropdownItem key="permissions">
                          View Permissions
                        </DropdownItem>
                        <DropdownItem key="members">View Members</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
