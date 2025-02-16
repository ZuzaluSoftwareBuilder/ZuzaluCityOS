import FormHeader from '@/components/form/FormHeader';
import { Box, Typography, Stack, Button } from '@mui/material';
import Link from 'next/link';

import { Dapp } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

interface OwnedDappListProps {
  onViewDapp: (dapp: Dapp) => void;
  onEditDapp: (dapp: Dapp) => void;
  handleClose: () => void;
}

export default function OwnedDappList({
  onViewDapp,
  onEditDapp,
  handleClose,
}: OwnedDappListProps) {
  const queryClient = useQueryClient();
  const dapps = queryClient.getQueryData<Dapp[]>(['getDappInfoList']) || [];

  return (
    <Box>
      <FormHeader title="Manage My Listings" handleClose={handleClose} />
      <Stack display="flex" flexDirection="column" gap="20px" padding="20px">
        <Stack direction="column" gap="10px">
          <Typography fontSize={20} fontWeight={700} lineHeight={1.2}>
            Your Listed Apps
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            lineHeight={1.6}
            sx={{ opacity: 0.6 }}
          >
            View and edit your app listings
          </Typography>
        </Stack>
        {dapps.map((dapp) => (
          <Stack
            key={dapp.id}
            direction="row"
            justifyContent="space-between"
            sx={{
              p: '10px',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '10px',
            }}
          >
            <Stack direction="row" gap="10px">
              <img
                src={dapp.bannerUrl || ''}
                alt={dapp.appName}
                style={{
                  width: '200px',
                  height: 'auto',
                  aspectRatio: '620/280',
                  borderRadius: '10px',
                }}
              />
              <Stack direction="column" gap="5px">
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  lineHeight={1.2}
                  sx={{ opacity: 0.8 }}
                >
                  {dapp.appName}
                </Typography>
                <Typography
                  fontSize={13}
                  fontWeight={400}
                  lineHeight={1.4}
                  sx={{
                    opacity: 0.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {dapp.tagline}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="column" justifyContent="center" gap="10px">
              <Button
                onClick={() => onViewDapp(dapp)}
                sx={{
                  p: '4px 10px',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  borderRadius: '6px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  height: '30px',
                }}
              >
                View
              </Button>
              <Button
                onClick={() => onEditDapp(dapp)}
                sx={{
                  p: '4px 10px',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  borderRadius: '6px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  height: '30px',
                }}
              >
                Edit
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
