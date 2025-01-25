import { Stack, Typography } from '@mui/material';
import { PlusCircleIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import Image from 'next/image';
export default function Header() {
  return (
    <Stack
      sx={{
        background: 'url(/dapps/dappsHeader.png) no-repeat center center',
        backgroundSize: 'cover',
        width: '100%',
        height: '222px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
      }}
    >
      <Stack direction="row" p="45px 0 0 25px" gap="20px">
        <Image
          src="/dapps/shapes.png"
          alt="shapes"
          width={80}
          height={80}
          style={{ width: '80px', height: '80px' }}
        />
        <Stack direction="column" gap="10px">
          <Typography
            sx={{
              color: '#fff',
              fontSize: '40px',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            dApps
          </Typography>
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
