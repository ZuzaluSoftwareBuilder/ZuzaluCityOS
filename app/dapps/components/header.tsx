import { Stack, Typography } from '@mui/material';
import { PlusCircleIcon, DIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import Image from 'next/image';

export default function Header() {
  return (
    <Stack
      sx={{
        width: '100%',
        height: '222px',
        position: 'relative',
        pt: '20px',
        background: 'linear-gradient(272deg, #222 2.52%, #2C2C2C 107.14%)',
      }}
    >
      <Image
        src="/dapps/header.png"
        alt="header"
        width={220}
        height={200}
        style={{
          width: '220px',
          height: '200px',
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <Stack direction="row" p="25px 0 0 25px" gap="20px">
        <Image
          src="/dapps/shapes.png"
          alt="shapes"
          width={80}
          height={80}
          style={{ width: '80px', height: '80px' }}
        />
        <Stack direction="column" gap="10px">
          <Stack direction="row" alignItems="center">
            <DIcon />
            <Typography
              sx={{
                color: '#fff',
                fontSize: '40px',
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
              fontSize: '18px',
              fontWeight: 500,
              opacity: 0.8,
              textShadow: '0px 6px 14px rgba(0, 0, 0, 0.25)',
              lineHeight: 1.4,
            }}
          >
            Zuzalu tools for Communities, Events & More
          </Typography>
          <ZuButton
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backgroundColor: '#222',
              p: '8px 14px',
              fontSize: '16px',
            }}
            startIcon={<PlusCircleIcon size={5} />}
          >
            Add Your App
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
