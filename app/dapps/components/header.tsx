import { ZuButton } from '@/components/core';
import { DIcon, HourglassHighIcon, PlusCircleIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useCallback } from 'react';

const AddButton = ({
  isMobile,
  isDisabled,
  isAuthenticated,
  onClick,
}: {
  isMobile: boolean;
  isDisabled: boolean;
  isAuthenticated: boolean;
  onClick: () => void;
}) => {
  return (
    <ZuButton
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
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
            <PlusCircleIcon />
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
          : 'Add Your App'
        : 'Connect'}
    </ZuButton>
  );
};

export default function Header({ onAdd }: { onAdd: () => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, showAuthPrompt } = useCeramicContext();

  const handleClick = useCallback(() => {
    if (!isAuthenticated) {
      showAuthPrompt();
    } else {
      onAdd();
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
        dApps v0.1
      </Typography>
      <Image
        src="/dapps/header.png"
        alt="header"
        width={220}
        height={200}
        style={{
          width: '220px',
          height: '200px',
          position: 'absolute',
          top: isMobile ? '10px' : '20px',
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
        <Image
          src="/dapps/shapes.png"
          alt="shapes"
          width={isMobile ? 60 : 80}
          height={isMobile ? 60 : 80}
          style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
          }}
        />
        <Stack direction="column" gap={isMobile ? '5px' : '10px'}>
          <Stack direction="row" alignItems="center">
            <DIcon />
            <Typography
              sx={{
                color: '#fff',
                fontSize: isMobile ? '28px' : '40px',
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              Apps
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
            Zuzalu tools for Communities, Events & More
          </Typography>
          {!isMobile && (
            <AddButton
              isMobile={isMobile}
              isDisabled={false}
              isAuthenticated={isAuthenticated}
              onClick={handleClick}
            />
          )}
        </Stack>
      </Stack>
      {isMobile && (
        <AddButton
          isMobile={isMobile}
          isDisabled={false}
          isAuthenticated={isAuthenticated}
          onClick={handleClick}
        />
      )}
    </Stack>
  );
}
