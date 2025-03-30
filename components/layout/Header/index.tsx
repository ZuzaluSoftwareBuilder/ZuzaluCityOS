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

const Header = () => {
  const { openSidebar, setOpenSidebar } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();

  const isSpacePath =
    pathName?.split('/')[1] === 'spaces' && pathName?.split('/').length > 2;

  return (
    <div className="h-[50px] bg-[rgba(44,44,44,0.8)] flex items-center justify-between px-[10px] py-[8px] border-b border-[rgba(255,255,255,0.1)] z-[1000] sticky top-0 backdrop-blur-[20px]">
      <div className="flex items-center cursor-pointer">
        <Button
          className="hidden tablet:block mobile:block w-[40px] min-w-[40px] p-[10px] bg-transparent"
          onPress={() => setOpenSidebar(true)}
        >
          <MenuIcon />
        </Button>

        {isSpacePath ? (
          <Button
            className="tablet:hidden mobile:hidden w-[40px] min-w-[40px] p-[10px] bg-transparent"
            onPress={() => setOpenSidebar(true)}
          >
            <MenuIcon />
          </Button>
        ) : null}

        <Image
          className="hidden mobile:block"
          src={'/header/logo.png'}
          width={30}
          height={30}
          onClick={() => router.push('/')}
          alt="Logo"
          disableSkeleton={false}
          radius="none"
        />

        <Image
          className="mobile:hidden"
          src={'/header/logoWithText.png'}
          width={155}
          height={30}
          onClick={() => router.push('/')}
          alt="Logo"
          disableSkeleton={false}
          radius="none"
        />

        <span className="mobile:hidden text-[14px] font-[300] opacity-80 leading-[1.2] italic text-white pl-[10px]">
          beta
        </span>
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
