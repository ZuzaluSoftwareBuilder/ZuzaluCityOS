'use client';
import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { MenuIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import SidebarDrawer from '../Sidebar/SidebarDrawer';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { Button } from '@/components/base';
import UserProfileSection from '../UserProfileSection';

const Header = () => {
  const theme = useTheme();
  const { openSidebar, setOpenSidebar } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down(1200));

  return (
    <Box
      height="50px"
      bgcolor="rgba(44, 44, 44, 0.8)"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="10px"
      paddingY="8px"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      zIndex={1000}
      position={'sticky'}
      top={0}
      sx={{ backdropFilter: 'blur(20px)' }}
    >
      <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
        {(isTablet ||
          (pathName.split('/')[1] === 'spaces' &&
            pathName.split('/').length > 2)) && (
          <Button
            variant="light"
            className="w-[40px] min-w-[40px] p-[10px]"
            onPress={() => setOpenSidebar(true)}
          >
            <MenuIcon />
          </Button>
        )}

        <Box
          component="img"
          src={isMobile ? '/header/logo.png' : '/header/logoWithText.png'}
          height="30px"
          onClick={() => router.push('/')}
        />
        {!isMobile ? (
          <span className="text-[14px] font-[300] opacity-80 leading-[1.2] italic text-white pl-[10px]">
            beta
          </span>
        ) : null}
      </Box>
      
      <UserProfileSection />
      
      <SidebarDrawer
        selected={'Home'}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
    </Box>
  );
};

export default Header;
