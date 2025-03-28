'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Typography, Stack } from '@mui/material';
import { useCeramicContext } from '@/context/CeramicContext';
import { useDisconnect } from 'wagmi';
import { useLitContext } from '@/context/LitContext';
import Image from 'next/image';
import { Button } from '@/components/base';
import Profile from '@/components/profile';
import { formatUserName } from '@/utils/format';
import { WalletIcon } from 'components/icons';
import { PressEvent } from '@heroui/react';

export function formatAddressString(str?: string, maxLength: number = 10) {
  if (!str) return;
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, 4) + '...' + str.substring(str.length - 4);
}

interface UserProfileSectionProps {
  avatarSize?: number;
  buttonClassName?: string;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  avatarSize = 28,
  buttonClassName = 'text-[16px] font-[500] leading-[1.2] text-white bg-transparent gap-[6px]',
}) => {
  const router = useRouter();
  const { isAuthenticated, showAuthPrompt, logout, username, profile } =
    useCeramicContext();
  const { litDisconnect } = useLitContext();
  const { disconnect } = useDisconnect();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleMenuClick = (e: PressEvent) => {
    setAnchorEl(e.target as HTMLElement);
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

  const address = profile?.author?.id.split(':');
  const formattedAddress = formatAddressString(address?.[address.length - 1]);
  const formattedName = formatUserName(username);

  return (
    <>
      <Profile showModal={showProfile} onClose={() => setShowProfile(false)} />
      {isAuthenticated ? (
        <>
          <Button className={buttonClassName} onPress={handleMenuClick}>
            <Image
              src={profile?.avatar ?? '/user/avatar_p.png'}
              alt="avatar"
              height={avatarSize}
              width={avatarSize}
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
                  src={profile?.avatar ?? '/user/avatar_p.png'}
                  alt="avatar"
                  height={40}
                  width={40}
                />
                <Stack
                  sx={{ marginTop: 0 }}
                  spacing="4px"
                  flexDirection="column"
                >
                  <Typography variant="bodyBB">{formattedAddress}</Typography>
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
        <Button
          color="functional"
          startContent={<WalletIcon size={5} />}
          onPress={() => showAuthPrompt('connectButton')}
          className="text-[14px] font-[500] leading-[1.2] text-white rounded-[8px] bg-white/5 h-[30px]"
        >
          Connect
        </Button>
      )}
    </>
  );
};

export default UserProfileSection;
