import SpaceList from '@/app/spaces/[spaceid]/components/sidebar/spaceList';
import { Tooltip } from '@heroui/react';
import {
  Buildings,
  House,
  IconContext,
  Shapes,
  Ticket,
} from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

type SidebarItem = {
  name: string;
  icon: React.ReactNode;
  href: string;
  tooltipName: string;
};
const SidebarList: SidebarItem[] = [
  {
    name: 'home',
    icon: <House />,
    href: '/',
    tooltipName: 'Home',
  },
  {
    name: 'space',
    icon: <Buildings />,
    href: '/spaces',
    tooltipName: 'Communities',
  },
  {
    name: 'event',
    icon: <Ticket />,
    href: '/events',
    tooltipName: 'Events',
  },
  {
    name: 'dapp',
    icon: <Shapes />,
    href: '/dapps',
    tooltipName: 'dApps',
  },
];
const Item = ({ item }: { item: SidebarItem }) => {
  return (
    <IconContext.Provider
      value={{
        size: 24,
        weight: 'fill',
        color: '#ffffff',
        format: 'Stroke',
        opacity: 0.6,
      }}
    >
      <Tooltip
        placement="right"
        classNames={{
          base: ['bg-transparent'],
          content: [
            'px-2.5 py-1 bg-[rgba(44,44,44,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm',
          ],
        }}
        content={item.tooltipName}
      >
        <Link
          href={item.href}
          className="flex size-[40px] cursor-pointer items-center justify-center rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)]"
        >
          {item.icon}
        </Link>
      </Tooltip>
    </IconContext.Provider>
  );
};

const SpaceSidebar = () => {
  return (
    <div className="fixed bottom-0 left-0 top-[50px] h-[calc(100vh-50px)] w-[62px] border-r border-[rgba(255,255,255,0.1)] bg-[#2C2C2C] py-2.5 mobile:hidden ">
      <div className="flex w-full flex-col items-center gap-2.5 border-b border-[rgba(255,255,255,0.1)] pb-2.5">
        {SidebarList.map((item) => (
          <Item key={item.name} item={item} />
        ))}
      </div>
      <SpaceList />
    </div>
  );
};

export default SpaceSidebar;
