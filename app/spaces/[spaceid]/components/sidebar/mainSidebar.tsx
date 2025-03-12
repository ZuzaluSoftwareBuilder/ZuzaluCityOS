import SpaceList from '@/app/spaces/[spaceid]/components/sidebar/spaceList';
import React from 'react';
import {
  Buildings,
  House,
  IconContext,
  Shapes,
  Ticket,
} from '@phosphor-icons/react';
import { Tooltip } from '@heroui/react';
import Link from 'next/link';

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
      <Tooltip placement="right" classNames={{
        base: ['bg-transparent'],
        content: [
          'px-2.5 py-1 bg-[rgba(44,44,44,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm'
        ]
      }}
        content={item.tooltipName} >
        <Link href={item.href} className="w-[40px] h-[40px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] rounded-lg flex items-center justify-center cursor-pointer">
          {item.icon}
        </Link>
      </Tooltip>
    </IconContext.Provider>
  );
};

const MainSidebar = () => {
  return (
    <div className="mobile:hidden fixed top-[50px] bottom-0 left-0 w-[62px] h-[calc(100vh-50px)] bg-[#2C2C2C] pt-2.5 pb-2.5 g-2.5 border-r border-[rgba(255,255,255,0.1)] ">
      <div className="w-full flex flex-col items-center pb-2.5 gap-2.5 border-b border-[rgba(255,255,255,0.1)]">
        {SidebarList.map((item) => (
          <Item key={item.name} item={item} />
        ))}
      </div>
      <SpaceList />
    </div>
  );
};

export default MainSidebar;
