'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { useDisconnect } from 'wagmi';
import { useLitContext } from '@/context/LitContext';
import { Button } from '@/components/base';
import Profile from '@/components/profile';
import { WalletIcon } from '@/components/icons';
import UserProfileDropdown from '@/components/layout/Header/userProfileDropdown';
import useOpenDraw from '@/hooks/useOpenDraw';

export function formatAddressString(
  str?: string,
  maxLength: number = 10,
  subLen: number = 4,
) {
  if (!str) return;
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, subLen) + '...' + str.substring(str.length - subLen);
}

interface UserProfileSectionProps {
  avatarSize?: number;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  avatarSize = 28,
}) => {
  const router = useRouter();
  const { isAuthenticated, showAuthPrompt, logout, profile } =
    useCeramicContext();
  const { litDisconnect } = useLitContext();
  const { disconnect } = useDisconnect();
  const [showProfile, setShowProfile] = useState(false);
  const { open, handleOpen, handleClose } = useOpenDraw();

  const handleLogout = useCallback(() => {
    disconnect();
    logout();
    litDisconnect();
    window.location.reload();
  }, [disconnect, logout, litDisconnect]);

  const handleProfile = useCallback(() => {
    setShowProfile(true);
  }, []);

  const handlePassport = useCallback(() => {
    router.push('/passport');
  }, [router]);

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false);
  }, []);

  const address = profile?.author?.id.split(':');

  const formattedAddress = useMemo(
    () => formatAddressString(address?.[address.length - 1], 10, 6),
    [address],
  );

  return (
    <>
      <Profile showModal={showProfile} onClose={handleCloseProfile} />

      {isAuthenticated ? (
        <UserProfileDropdown
          avatarSize={avatarSize}
          isOpen={open}
          onOpen={handleOpen}
          onClose={handleClose}
          handleProfile={handleProfile}
          handlePassport={handlePassport}
          handleLogout={handleLogout}
          displayAddress={formattedAddress || ''}
        />
      ) : (
        <Button
          color="functional"
          startContent={<WalletIcon size={5} />}
          onPress={() => showAuthPrompt('connectButton')}
          className="h-[30px] rounded-[8px] bg-white/5 text-[14px] font-[500] leading-[1.2] text-white"
        >
          Connect
        </Button>
      )}
    </>
  );
};

export default memo(UserProfileSection);
