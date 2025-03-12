import {
  Grid,
  InputAdornment,
  OutlinedInput,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { GearSixIcon, SearchIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSpacesQuery } from '@/services/space';
import { Space, SpaceData } from '@/types';
import { SpaceCard, SpaceCardSkeleton } from '@/app/components/SpaceCard';
import { Broadcast } from '@phosphor-icons/react';
import { Button } from '@heroui/react';

const SpaceList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { composeClient } = useCeramicContext();
  const [searchVal, setSearchVal] = useState<string>('');

  const { data: spacesData, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      try {
        const response: any = await composeClient.executeQuery(getSpacesQuery);
        if ('zucitySpaceIndex' in response.data) {
          const spaceData: SpaceData = response.data as SpaceData;
          const spaces = spaceData.zucitySpaceIndex.edges.map(
            (edge) => edge.node,
          );

          return spaces;
        } else {
          console.error('Invalid data structure:', response.data);
          return [];
        }
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        throw error;
      }
    },
  });

  const filteredSpacesData = useMemo(() => {
    if (searchVal === '') {
      return spacesData;
    }
    return spacesData?.filter((space) =>
      space.name.toLowerCase().includes(searchVal.toLowerCase()),
    );
  }, [spacesData, searchVal]);

  return (
    <Stack
      direction="column"
      flex={1}
      p={isMobile ? '20px 10px' : '20px'}
      gap={isMobile ? '10px' : '20px'}
    >
      <div className="flex h-[40px] mb-[10px]">
        <div className="w-[40px] h-[40px] flex justify-center items-center opacity-50">
          <Broadcast size={24} weight={'fill'} format={'Stroke'} />
        </div>
        <OutlinedInput
          placeholder="Search Spaces"
          sx={{
            backgroundColor: 'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
            p: '12px 14px',
            borderRadius: '10px',
            height: '40px',
            width: '100%',
            border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
            opacity: 0.7,
            color: 'white',
            fontSize: '16px',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          onChange={(e) => setSearchVal(e.target.value)}
          startAdornment={
            <InputAdornment position="start" sx={{ opacity: 0.6 }}>
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>

      <Grid
        container
        spacing="20px"
        flex={1}
        sx={{
          '& .MuiGrid-item': {
            width: '100%',
            maxWidth: '100%',
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid
                item
                xl={3}
                lg={4}
                md={6}
                sm={12}
                xs={12}
                gap={20}
                sx={{
                  '@media (max-width: 809px)': {
                    maxWidth: '100% !important',
                    flexBasis: '100% !important',
                  },
                  '@media (min-width: 810px) and (max-width: 1199px)': {
                    maxWidth: '50% !important',
                    flexBasis: '50% !important',
                  },
                  '@media (min-width: 1200px) and (max-width: 1399px)': {
                    maxWidth: '33.333% !important',
                    flexBasis: '33.333% !important',
                  },
                  '@media (min-width: 1400px)': {
                    maxWidth: '25% !important',
                    flexBasis: '25% !important',
                  },
                }}
                key={index}
              >
                <SpaceCardSkeleton autoWidth={true} key={index} />
              </Grid>
            ))
          : filteredSpacesData?.map((item, index) => (
              <Grid
                item
                xl={3}
                lg={4}
                md={6}
                sm={12}
                xs={12}
                gap={20}
                sx={{
                  '@media (max-width: 809px)': {
                    maxWidth: '100% !important',
                    flexBasis: '100% !important',
                  },
                  '@media (min-width: 810px) and (max-width: 1199px)': {
                    maxWidth: '50% !important',
                    flexBasis: '50% !important',
                  },
                  '@media (min-width: 1200px) and (max-width: 1399px)': {
                    maxWidth: '33.333% !important',
                    flexBasis: '33.333% !important',
                  },
                  '@media (min-width: 1400px)': {
                    maxWidth: '25% !important',
                    flexBasis: '25% !important',
                  },
                }}
                key={item.id}
              >
                <SpaceCard key={item.id} data={item} autoWidth={true} />
              </Grid>
            ))}
      </Grid>
    </Stack>
  );
};

export default SpaceList;
