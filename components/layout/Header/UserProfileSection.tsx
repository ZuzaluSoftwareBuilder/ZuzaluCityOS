'use client';

import { Button } from '@/components/base';
import { WalletIcon } from '@/components/icons';
import UserProfileDropdown from '@/components/layout/Header/UserProfileDropdown';
import Profile from '@/components/profile';
import { useCeramicContext } from '@/context/CeramicContext';
import { useLitContext } from '@/context/LitContext';
import { config } from '@/context/WalletContext';
import useOpenDraw from '@/hooks/useOpenDraw';
import { getWalletAddressFromDid } from '@/utils/did';
import { disconnect } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useMemo, useState } from 'react';

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
  const { isAuthenticated, newUser, showAuthPrompt, logout, profile } =
    useCeramicContext();
  const { litDisconnect } = useLitContext();
  const [showProfile, setShowProfile] = useState(false);
  const { open, handleOpen, handleClose } = useOpenDraw();

  const handleLogout = useCallback(async () => {
    await disconnect(config);
    logout();
    litDisconnect();
    window.location.reload();
  }, [logout, litDisconnect]);

  const handleProfile = useCallback(() => {
    setShowProfile(true);
  }, []);

  const handlePassport = useCallback(() => {
    router.push('/passport');
  }, [router]);

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false);
  }, []);

  const address = getWalletAddressFromDid(profile?.author?.id);

  const formattedAddress = useMemo(
    () => formatAddressString(address, 10, 6),
    [address],
  );

  return (
    <>
      <Profile showModal={showProfile} onClose={handleCloseProfile} />

      {isAuthenticated && !newUser ? (
        <UserProfileDropdown
          avatarSize={avatarSize}
          isOpen={open}
          onOpen={handleOpen}
          onClose={handleClose}
          handleProfile={handleProfile}
          handlePassport={handlePassport}
          handleLogout={handleLogout}
          displayAddress={formattedAddress || ''}
          address={address || ''}
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
