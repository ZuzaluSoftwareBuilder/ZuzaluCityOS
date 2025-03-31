import { Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { HourglassHighIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import Image from 'next/image';
import { useCeramicContext } from '@/context/CeramicContext';
import React, { useCallback } from 'react';
import { Plus } from '@phosphor-icons/react';

export interface IAddButtonProps {
  isMobile: boolean;
  isDisabled: boolean;
  isAuthenticated: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  btnText: string;
}

export const AddButton = ({
  isMobile,
  isDisabled,
  isAuthenticated,
  onClick,
  icon,
  btnText,
}: IAddButtonProps) => {
  return (
    <ZuButton
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
        height: '40px',
        backgroundColor: '#222',
        p: '8px 14px',
        fontSize: '16px',
        width: isMobile ? '100%' : 'fit-content',
        margin: isMobile ? '10px 0 0' : 0,
        zIndex: 2,
        cursor: isAuthenticated
          ? isDisabled
            ? 'not-allowed'
            : 'pointer'
          : 'pointer',
      }}
      startIcon={
        isAuthenticated ? (
          isDisabled ? (
            <HourglassHighIcon />
          ) : (
            icon
          )
        ) : (
          <Image src="/user/wallet.png" alt="wallet" height={24} width={24} />
        )
      }
      onClick={onClick}
    >
      {isAuthenticated
        ? isDisabled
          ? 'Listing Coming Soon'
          : btnText
        : 'Connect'}
    </ZuButton>
  );
};

export interface IExploreHeaderProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  versionLabel: string;
  onAdd?: () => void;
  bgImage?: string;
  addButtonText: string;
  addButtonIcon?: React.ReactNode;
  titlePrefixIcon?: React.ReactNode;
  bgImageWidth?: number;
  bgImageHeight?: number;
  bgImageTop?: number;
}

export default function ExploreHeader({
  onAdd,
  icon,
  title,
  subTitle,
  versionLabel,
  bgImage,
  addButtonText,
  addButtonIcon,
  titlePrefixIcon,
  bgImageWidth,
  bgImageHeight,
  bgImageTop,
}: IExploreHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, showAuthPrompt } = useCeramicContext();

  const defaultAddButtonIcon = (
    <Plus size={20} weight={'fill'} format={'Stroke'} />
  );

  const handleClick = useCallback(() => {
    if (!isAuthenticated) {
      showAuthPrompt();
    } else {
      onAdd?.();
    }
  }, [isAuthenticated, onAdd, showAuthPrompt]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: isMobile ? 'auto' : '222px',
        position: 'relative',
        p: isMobile ? '20px' : '20px 0 0',
        background: 'linear-gradient(272deg, #222 2.52%, #2C2C2C 107.14%)',
        overflow: 'hidden',
        '@media (hover: hover)': {
          '&:hover': {
            background: 'linear-gradient(272deg, #222 2.52%, #2C2C2C 107.14%)',
          },
        },
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
      }}
    >
      <Typography
        fontSize={13}
        lineHeight={1.4}
        sx={{
          opacity: 0.5,
          position: 'absolute',
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '25px',
          color: '#fff',
        }}
      >
        {versionLabel}
      </Typography>
      <Image
        src={bgImage || '/dapps/header.png'}
        alt="header"
        width={220}
        height={200}
        style={{
          width: `${bgImageWidth || 220}px`,
          height: `${bgImageHeight || 200}px`,
          position: 'absolute',
          top:
            bgImageTop || bgImageTop === 0
              ? `${bgImageTop}px`
              : isMobile
                ? '10px'
                : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />
      <Stack
        direction="row"
        p={isMobile ? '0' : '25px 0 0 25px'}
        gap={isMobile ? '10px' : '20px'}
        sx={{
          zIndex: 2,
        }}
      >
        {icon}

        <Stack direction="column" gap={isMobile ? '5px' : '10px'}>
          <Stack direction="row" alignItems="center">
            {titlePrefixIcon}
            <Typography
              sx={{
                color: '#fff',
                fontSize: isMobile ? '28px' : '40px',
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: '#fff',
              fontSize: isMobile ? '14px' : '18px',
              fontWeight: 500,
              opacity: 0.8,
              textShadow: '0px 6px 14px rgba(0, 0, 0, 0.25)',
              lineHeight: 1.4,
            }}
          >
            {subTitle}
          </Typography>
          {!!onAdd && !isMobile && (
            <AddButton
              isMobile={isMobile}
              isDisabled={false}
              isAuthenticated={isAuthenticated}
              onClick={handleClick}
              icon={addButtonIcon ?? defaultAddButtonIcon}
              btnText={addButtonText}
            />
          )}
        </Stack>
      </Stack>
      {!!onAdd && isMobile && (
        <AddButton
          isMobile={isMobile}
          isDisabled={false}
          isAuthenticated={isAuthenticated}
          onClick={handleClick}
          icon={addButtonIcon ?? defaultAddButtonIcon}
          btnText={addButtonText}
        />
      )}
    </Stack>
  );
}
