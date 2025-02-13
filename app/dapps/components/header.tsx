import { Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { PlusCircleIcon, DIcon } from '@/components/icons';
import { ZuButton } from '@/components/core';
import Image from 'next/image';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';

const AddButton = ({
  isMobile,
  onClick,
}: {
  isMobile: boolean;
  onClick: () => void;
}) => {
  return (
    <ZuButton
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.10)',
        backgroundColor: '#222',
        p: '8px 14px',
        fontSize: '16px',
        width: isMobile ? '100%' : 'auto',
        margin: isMobile ? '10px 0 0' : 0,
        zIndex: 2,
      }}
      startIcon={<PlusCircleIcon size={5} />}
      onClick={onClick}
    >
      Add Your App
    </ZuButton>
  );
};

export default function Header() {
  const { isAuthenticated, composeClient } = useCeramicContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading } = useQuery({
    queryKey: ['zucitySpaceIndex', isAuthenticated],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        const response: any = await composeClient.executeQuery(`
      query {
        zucitySpaceIndex(first: 100) {
          edges {
            node {
              id
            }
          }
        } 
      }
    `);
        if (response && response.data && 'zucitySpaceIndex' in response.data) {
          return response.data.zucitySpaceIndex.edges.length > 0;
        } else {
          console.error('Invalid data structure:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    },
  });

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
          {!isMobile && <AddButton isMobile={isMobile} onClick={() => {}} />}
        </Stack>
      </Stack>
      {isMobile && <AddButton isMobile={isMobile} onClick={() => {}} />}
    </Stack>
  );
}
