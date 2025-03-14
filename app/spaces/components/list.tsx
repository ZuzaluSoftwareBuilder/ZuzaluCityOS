import {
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SearchIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSpacesQuery } from '@/services/space';
import { SpaceData } from '@/types';
import { SpaceCard, SpaceCardSkeleton } from '@/app/components/SpaceCard';
import { Broadcast } from '@phosphor-icons/react';
import ResponsiveGridItem from '@/components/layout/explore/responsiveGridItem';
import ExploreSearch from '@/components/layout/explore/exploreSearch';

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

      <ExploreSearch
        value={searchVal}
        onChange={setSearchVal}
        placeholder="Search Spaces"
        className="mb-[10px]"
      />

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
            <ResponsiveGridItem key={index}>
              <SpaceCardSkeleton autoWidth={true} key={index} />
            </ResponsiveGridItem>
          ))
          : filteredSpacesData?.map((item) => (
            <ResponsiveGridItem key={item.id}>
              <SpaceCard key={item.id} data={item} autoWidth={true} />
            </ResponsiveGridItem>
          ))}
      </Grid>
    </Stack>
  );
};

export default SpaceList;
