'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HomeIcon, 
  TicketIcon, 
  MegaphoneIcon, 
  CalendarDaysIcon, 
  MagnifyingGlassIcon,
  PlusCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface SidebarProps {
  spaceid: string;
}

const Sidebar: React.FC<SidebarProps> = ({ spaceid }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // 检查当前路径是否活跃
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-64 h-full flex flex-col bg-[#222222]/80 backdrop-blur-xl border-r border-white/10">
      {/* 社区信息 */}
      <div className="flex items-center gap-2.5 p-[10px_14px] border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7DFFD1] to-[#FFCA7A]"></div>
        <span className="text-white font-semibold text-base flex-grow">Community Name</span>
        <ChevronDownIcon className="w-5 h-5 text-white" />
      </div>
      
      {/* 主导航 */}
      <div className="flex flex-col gap-1.5 p-2.5 border-b border-white/10">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/10 opacity-40">
          <MagnifyingGlassIcon className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">Search</span>
        </div>
        
        <Link href={`/spaces/${spaceid}`} className={`flex items-center gap-2.5 p-2 rounded-lg ${isActive(`/spaces/${spaceid}`) ? 'bg-[#363636]' : 'bg-white/10 opacity-50 hover:opacity-70'}`}>
          <HomeIcon className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">Home</span>
        </Link>
        
        <Link href={`/spaces/${spaceid}/events`} className={`flex items-center gap-2.5 p-2 rounded-lg ${isActive(`/spaces/${spaceid}/events`) ? 'bg-[#363636]' : 'bg-white/10 opacity-50 hover:opacity-70'}`}>
          <TicketIcon className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">Events</span>
        </Link>
        
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 opacity-50 hover:opacity-70">
          <div className="flex items-center gap-2.5">
            <MegaphoneIcon className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium">Announcements</span>
          </div>
          <span className="text-[#7DFFD1] text-sm font-medium">2</span>
        </div>
      </div>
      
      {/* 频道部分 */}
      <div className="flex flex-col gap-5 p-5 pt-0">
        <div className="flex justify-between items-center px-2.5 mt-5">
          <span className="text-white text-xs font-normal uppercase tracking-wider">Channels</span>
          <PlusCircleIcon className="w-5 h-5 text-white opacity-50" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/10 opacity-50 hover:opacity-70">
            <CalendarDaysIcon className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium">Calendar</span>
          </div>
          
          <div className="flex items-center pl-5 opacity-50 hover:opacity-70">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/10 w-full">
              <CalendarDaysIcon className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Public Activities</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 opacity-50 hover:opacity-70">
            <div className="flex items-center gap-2.5 opacity-60">
              <CalendarDaysIcon className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Discussions</span>
            </div>
            <LockClosedIcon className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 opacity-50 hover:opacity-70">
            <div className="flex items-center gap-2.5 opacity-60">
              <CalendarDaysIcon className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Zu_Builders</span>
            </div>
            <LockClosedIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 