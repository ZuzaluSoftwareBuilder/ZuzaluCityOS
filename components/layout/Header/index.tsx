'use client';
import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  Stack,
} from '@mui/material';
import styles from './index.module.css';
import { useTheme, useMediaQuery } from '@mui/material';
import { MenuIcon, WalletIcon } from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import SidebarDrawer from '../Sidebar/SidebarDrawer';
import { useAppContext } from '@/context/AppContext';
import { useAccount, useDisconnect, useEnsName } from 'wagmi';
import Image from 'next/image';
import { ZuButton } from '@/components/core';
import { formatUserName } from '@/utils/format';
import { useLitContext } from '@/context/LitContext';
import Profile from '@/components/profile';

export function formatAddressString(str?: string, maxLength: number = 10) {
  if (!str) return;
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, 4) + '...' + str.substring(str.length - 4);
}

const Header = () => {
  const theme = useTheme();
  const { openSidebar, setOpenSidebar } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { isAuthenticated, showAuthPrompt, logout, username, profile } =
    useCeramicContext();
  const { litDisconnect } = useLitContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showProfile, setShowProfile] = useState(false);
  const { disconnect } = useDisconnect();

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    disconnect();
    logout();
    litDisconnect();
    handleMenuClose();
    window.location.reload();
  };

  const handleProfile = () => {
    setShowProfile(true);
    handleMenuClose();
  };

  const handlePassport = () => {
    handleMenuClose();
    router.push('/passport');
  };

  const address = useMemo(() => {
    if (profile) {
      const id = profile.author?.id.split(':');
      return formatAddressString(id?.[id?.length - 1]);
    }
  }, [profile]);

  const formattedName = useMemo(() => {
    return formatUserName(username);
  }, [username]);

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
      <Profile showModal={showProfile} onClose={() => setShowProfile(false)} />
      <Box
        display="flex"
        alignItems="center"
        gap="10px"
        sx={{ cursor: 'pointer' }}
      >
        {(isTablet ||
          (pathName.split('/')[1] === 'spaces' &&
            pathName.split('/').length > 2)) && (
          <Button
            sx={{
              padding: '10px',
              width: '40px',
              minWidth: 'unset',
            }}
            onClick={() => setOpenSidebar(true)}
          >
            <MenuIcon />
          </Button>
        )}

        <Box
          component="img"
          src={
            isMobile ? '/ZuCityLogo-IconOnly.svg' : '/header/logoWithText.png'
          }
          height="30px"
          onClick={() => router.push('/')}
        />
      </Box>
      {isAuthenticated ? (
        <>
          <Button
            sx={{
              color: 'white',
              fontSize: 16,
              fontWeight: 500,
              lineHeight: 1.2,
              background: 'transparent',
              gap: '6px',
            }}
            onClick={handleMenuClick}
          >
            <Image
              src={profile?.avatar ?? '/user/avatar_p.png'}
              alt="avatar"
              height={28}
              width={28}
            />
            {formattedName}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                style: {
                  backgroundColor: 'rgba(34, 34, 34)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 9999,
                  padding: '2px 10px',
                  width: '244px',
                  marginTop: '8px',
                },
              },
            }}
          >
            <Stack flexDirection="column" sx={{ gap: '10px' }}>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                }}
              >
                <Image
                  src="/user/avatar_p.png"
                  alt="avatar"
                  height={40}
                  width={40}
                />
                <Stack
                  sx={{ marginTop: 0 }}
                  spacing="4px"
                  flexDirection="column"
                >
                  <Typography variant="bodyBB">{address}</Typography>
                  <Typography variant="bodyM" color="text.secondary">
                    Wallet Connected
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                flexDirection="column"
                sx={{
                  gap: '10px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  opacity: '0.8',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                  },
                }}
                onClick={handleProfile}
              >
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  sx={{ gap: '10px' }}
                >
                  <Image
                    src="/user/profile.png"
                    alt="profile"
                    height={24}
                    width={24}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  >
                    My Profile
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                flexDirection="column"
                sx={{
                  gap: '4px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  opacity: '0.8',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                  },
                }}
                onClick={handlePassport}
              >
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  sx={{ gap: '10px' }}
                >
                  <Image
                    src="/user/wallet.png"
                    alt="wallet"
                    height={24}
                    width={24}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  >
                    My Passport
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                flexDirection="row"
                alignItems="center"
                sx={{
                  gap: '10px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 94, 94, 0.05)',
                  borderRadius: '10px',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 94, 94, 0.1)',
                  },
                }}
                onClick={handleLogout}
              >
                <Image
                  src="/user/logout.png"
                  alt="logout"
                  height={24}
                  width={24}
                />
                <Typography
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#FF5E5E',
                  }}
                >
                  Logout
                </Typography>
              </Stack>
            </Stack>
          </Menu>
        </>
      ) : (
        <ZuButton
          sx={{
            textAlign: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.2,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
            gap: '10px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '5px 10px',
          }}
          startIcon={<WalletIcon size={5} />}
          onClick={showAuthPrompt}
        >
          Connect
        </ZuButton>
      )}
      <SidebarDrawer
        selected={'Home'}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
    </Box>
  );
};

export default Header;
