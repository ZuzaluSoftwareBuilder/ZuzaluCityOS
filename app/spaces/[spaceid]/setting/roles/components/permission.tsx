'use client';

import { useState } from 'react';
import { Switch } from '@heroui/react';

interface PermissionItemProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: (isSelected: boolean) => void;
  className?: string;
}

const PermissionItem = ({
  title,
  description,
  defaultChecked = false,
  className,
}: PermissionItemProps) => {
  return (
    <div
      className={`flex flex-col justify-center gap-1 w-full pb-2.5 border-b border-white/10 ${className}`}
    >
      <div className="flex flex-col justify-center items-center w-full gap-[5px]">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="text-white font-semibold text-base leading-[1.4]">
            {title}
          </span>
          <Switch defaultChecked={defaultChecked} isDisabled />
        </div>
      </div>
      <span className="text-white/60 text-sm leading-[1.6] w-full">
        {description}
      </span>
    </div>
  );
};

interface PermissionProps {
  permissions?: {
    title: string;
    description: string;
    defaultChecked?: boolean;
  }[];
  onChange?: (permissions: { [key: string]: boolean }) => void;
}

export const Permission = ({
  permissions = [
    {
      title: 'Open Event',
      description: 'Anybody can attend this event',
      defaultChecked: false,
    },
    {
      title: 'Open Event',
      description: 'Anybody can attend this event',
      defaultChecked: false,
    },
    {
      title: 'Open Event',
      description: 'Anybody can attend this event',
      defaultChecked: false,
    },
    {
      title: 'Open Event',
      description: 'Anybody can attend this event',
      defaultChecked: false,
    },
  ],
  onChange,
}: PermissionProps) => {
  const [permissionState, setPermissionState] = useState<{
    [key: string]: boolean;
  }>(
    permissions.reduce(
      (acc, permission) => {
        acc[permission.title] = permission.defaultChecked || false;
        return acc;
      },
      {} as { [key: string]: boolean },
    ),
  );

  const handlePermissionChange = (title: string, isSelected: boolean) => {
    const newState = {
      ...permissionState,
      [title]: isSelected,
    };
    setPermissionState(newState);
    onChange?.(newState);
  };

  return (
    <div className="flex flex-col gap-5 w-full mt-5">
      <span className="text-white/60 font-semibold text-sm leading-[1.2em] w-full">
        General Space Permissions
      </span>
      <div className="flex flex-col gap-2.5 w-full">
        {permissions.map((permission, index) => (
          <PermissionItem
            key={`${permission.title}-${index}`}
            title={permission.title}
            description={permission.description}
            defaultChecked={permission.defaultChecked}
            onChange={(isSelected) =>
              handlePermissionChange(permission.title, isSelected)
            }
            className={index === permissions.length - 1 ? 'border-b-0' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default Permission;
