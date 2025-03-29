'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import { MenuIcon } from 'components/icons';
import SidebarDrawer from '../Sidebar/SidebarDrawer';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/base';
import UserProfileSection from '../UserProfileSection';
import { Skeleton, Image } from '@heroui/react';

const HeaderSkeleton = () => {
  const isMobile = useMediaQuery('(max-width:809px)');
  const isTablet = useMediaQuery('(max-width:1199px)');
  return (
    <div
      className="h-[50px] bg-[rgba(44,44,44,0.8)] flex items-center justify-between px-[10px] py-[8px] border-b border-[rgba(255,255,255,0.1)] z-[1000] sticky top-0 backdrop-blur-[20px]">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {isTablet && (
            <Skeleton className="w-[32px] h-[32px] bg-white/10 rounded animate-pulse" />
          )}
          <Skeleton className="w-[120px] h-[28px] bg-white/10 rounded animate-pulse" />
          {!isMobile && (
            <Skeleton className="w-[30px] h-[14px] bg-white/10 rounded ml-1 animate-pulse" />
          )}
        </div>
      </div>
      <Skeleton className="w-[36px] h-[36px] rounded-full bg-white/10 animate-pulse" />
    </div>
  )
}

const Header = () => {
  const { openSidebar, setOpenSidebar, uiReady } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();
  const isMobile = useMediaQuery('(max-width:809px)');
  const isTablet = useMediaQuery('(max-width:1199px)');

  if (!uiReady) {
    return <HeaderSkeleton />
  }

  return (
    <div
      className="h-[50px] bg-[rgba(44,44,44,0.8)] flex items-center justify-between px-[10px] py-[8px] border-b border-[rgba(255,255,255,0.1)] z-[1000] sticky top-0 backdrop-blur-[20px]">
      <div className="flex items-center cursor-pointer">
        {(isTablet ||
          (pathName?.split('/')[1] === 'spaces' &&
            pathName?.split('/').length > 2)) && (
          <Button
            className="w-[40px] min-w-[40px] p-[10px] bg-transparent"
              onPress={() => setOpenSidebar(true)}
            >
              <MenuIcon />
            </Button>
          )}

        <Image
          src={isMobile ? '/header/logo.png' : '/header/logoWithText.png'}
          className="h-[30px]"
          onClick={() => router.push('/')}
          alt="Logo"
        />
        {!isMobile ? (
          <span className="text-[14px] font-[300] opacity-80 leading-[1.2] italic text-white pl-[10px]">
            beta
          </span>
        ) : null}
      </div>

      <UserProfileSection />

      <SidebarDrawer
        selected={'Home'}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
    </div>
  );
};

export default Header;
