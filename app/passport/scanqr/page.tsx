'use client';
import { ZuButton } from '@/components/core';
import { LeftArrowIcon } from '@/components/icons';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ScanQRModal } from '../components/QRScanModal';

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isScanVerify, setIsScanVerify] = useState<boolean>(false);

  return (
    <Stack
      justifyContent={'center'}
      gap="20px"
      padding="30px"
      sx={{
        margin: '0 auto',
        color: 'white',
        [theme.breakpoints.down('sm')]: {
          padding: '10px',
          gap: '10px',
        },
      }}
      maxWidth="640px"
    >
      <Stack
        direction="row"
        gap="20px"
        alignItems="center"
        sx={{
          [theme.breakpoints.down('sm')]: {
            gap: '10px',
          },
        }}
      >
        <ZuButton
          startIcon={<LeftArrowIcon size={5} />}
          onClick={() => router.back()}
          sx={{
            p: '6px 10px',
            gap: '5px',
            borderRadius: '10px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            opacity: 0.5,
            fontSize: '14px',
            lineHeight: 1.6,
            height: '34px',
            [theme.breakpoints.down('sm')]: {
              gap: 0,
              width: '40px',
              minWidth: '40px',
              '& .MuiButton-startIcon': {
                margin: 0,
              },
            },
          }}
        >
          {!isMobile ? 'Back' : ''}
        </ZuButton>
        <Typography
          fontSize="24px"
          fontWeight={700}
          lineHeight={1.2}
          color="white"
          sx={{
            [theme.breakpoints.down('sm')]: {
              fontSize: '18px',
            },
          }}
        >
          Scan QR Code
        </Typography>
      </Stack>

      <ScanQRModal setShowModal={setIsScanVerify} showModal={isScanVerify} />
      <Typography fontSize="14px" fontWeight={600} lineHeight={1.6}>
        Action (beta only has one action):
      </Typography>
      <Stack
        onClick={() => setIsScanVerify(true)}
        sx={{ cursor: 'pointer' }}
        padding="10px"
        borderRadius="10px"
        bgcolor="#2d2d2d"
        border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
        spacing="4px"
      >
        <Typography fontSize="18px" fontWeight={700} lineHeight={1.2}>
          Verify
        </Typography>
        <Typography fontSize="10px" lineHeight={1.2} sx={{ opacity: 0.7 }}>
          Scan & verify a ticket
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Home;
