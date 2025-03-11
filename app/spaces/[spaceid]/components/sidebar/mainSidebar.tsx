import SpaceList from '@/app/spaces/[spaceid]/components/sidebar/spaceList';
import React from 'react';
import {
  Buildings,
  House,
  IconContext,
  Shapes,
  Ticket,
} from '@phosphor-icons/react';
import { Link } from '@heroui/react';

type SidebarItem = {
  name: string;
  icon: React.ReactNode;
  href: string;
};
const SidebarList: SidebarItem[] = [
  {
    name: 'home',
    icon: <House />,
    href: '/',
  },
  {
    name: 'space',
    icon: <Buildings />,
    href: '/spaces',
  },
  {
    name: 'event',
    icon: <Ticket />,
    href: '/events',
  },
  {
    name: 'dapp',
    icon: <Shapes />,
    href: '/dapps',
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
      <Link href={item.href} className="w-[40px] h-[40px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] rounded-lg flex items-center justify-center cursor-pointer">
        {item.icon}
      </Link>
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
