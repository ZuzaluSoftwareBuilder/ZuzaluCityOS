import FormHeader from '@/components/form/FormHeader';
import {
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { Dapp } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { EyeIcon } from '@/components/icons/Eye';
import { PencilIcon } from '@/components/icons/Pencil';
import { NotePencilIcon } from '@/components/icons/NotePencil';
import { useMemo } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';

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
  const { data: dapps = [] } = useQuery<Dapp[]>({
    queryKey: ['getDappInfoList'],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { ceramic } = useCeramicContext();
  const userDID = ceramic.did?.parent;

  const ownedDapps = useMemo(() => {
    return dapps?.filter((dapp) => dapp.profile.author.id === userDID) || [];
  }, [dapps, userDID]);

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
        {ownedDapps.map((dapp) => (
          <Stack
            key={dapp.id}
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            sx={{
              p: '10px',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '10px',
            }}
          >
            <Stack direction={isMobile ? 'column' : 'row'} gap="10px">
              <img
                src={dapp.bannerUrl || ''}
                alt={dapp.appName}
                style={{
                  width: isMobile ? '100%' : '200px',
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
            <Stack
              direction={isMobile ? 'row' : 'column'}
              justifyContent="center"
              gap="10px"
              mt={isMobile ? '20px' : '0'}
            >
              <Button
                onClick={() => onViewDapp(dapp)}
                startIcon={<EyeIcon color="#fff" size={4.5} />}
                sx={{
                  p: '4px 10px',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  borderRadius: '6px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  height: '30px',
                  textTransform: 'none',
                  flex: isMobile ? 1 : 'unset',
                }}
              >
                View
              </Button>
              <Button
                onClick={() => onEditDapp(dapp)}
                startIcon={<NotePencilIcon />}
                sx={{
                  p: '4px 10px',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  borderRadius: '6px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  height: '30px',
                  textTransform: 'none',
                  flex: isMobile ? 1 : 'unset',
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
