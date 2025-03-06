import { Image, Link } from '@heroui/react';
import SpaceList from './spaceList';
type SidebarItem = {
  name: string;
  icon: string;
  href: string;
};
const SidebarList: SidebarItem[] = [
  {
    name: 'home',
    icon: '/space/House.png',
    href: '/',
  },
  {
    name: 'space',
    icon: '/space/Buildings.png',
    href: '/spaces',
  },
  {
    name: 'event',
    icon: '/space/Ticket.png',
    href: '/events',
  },
  {
    name: 'dapp',
    icon: '/space/Shapes.png',
    href: '/dapps',
  },
];
const Item = ({ item }: { item: SidebarItem }) => {
  return (
    <Link className="w-[40px] h-[40px] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] rounded-lg flex items-center justify-center cursor-pointer">
      <Image src={item.icon} alt={item.name} width={24} height={24} />
    </Link>
  );
};

const SpaceLayoutSidebar = () => {
  return (
    <div className="tablet:hidden mobile:hidden fixed top-[50px] bottom-0 left-0 w-[62px] h-[calc(100vh-50px)] bg-[#2C2C2C] pt-2.5 pb-2.5 g-2.5 border-r border-[rgba(255,255,255,0.1)] ">
      <div className="w-full flex flex-col items-center pb-2.5 gap-2.5 border-b border-[rgba(255,255,255,0.1)]">
        {SidebarList.map((item) => (
          <Item key={item.name} item={item} />
        ))}
      </div>
      <SpaceList />
    </div>
  );
};

export default SpaceLayoutSidebar;
