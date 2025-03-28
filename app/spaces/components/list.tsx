import { Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { Space } from '@/types';
import { SpaceCard, SpaceCardSkeleton } from '@/app/components/SpaceCard';

import ResponsiveGridItem from '@/components/layout/explore/responsiveGridItem';
import ExploreSearch from '@/components/layout/explore/exploreSearch';
import useUserSpace from '@/hooks/useUserSpace';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_ALL_SPACE_AND_MEMBER_QUERY } from '@/services/graphql/space';

const SpaceList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchVal, setSearchVal] = useState<string>('');

  const { userJoinedSpaceIds, userFollowedSpaceIds } = useUserSpace();

  const { adminRole, memberRole } = useBuildInRole();

  const { data: spaces, isLoading } = useGraphQL(
    ['GET_ALL_SPACE_AND_MEMBER_QUERY'],
    GET_ALL_SPACE_AND_MEMBER_QUERY,
    {
      first: 100,
      userRolesFilters: {
        where: {
          roleId: {
            in: [adminRole, memberRole].map((role) => role?.id ?? ''),
          },
        },
      },
    },
    {
      select: (data) => {
        if (!data?.data?.zucitySpaceIndex?.edges) {
          return [];
        }
        return data.data.zucitySpaceIndex.edges.map(
          (edge) => edge!.node,
        ) as Space[];
      },
      enabled: !!adminRole && !!memberRole,
    },
  );

  const filteredSpacesData = useMemo(() => {
    if (searchVal === '') {
      return spaces;
    }
    return spaces?.filter((space) =>
      space.name.toLowerCase().includes(searchVal.toLowerCase()),
    );
  }, [spaces, searchVal]);

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
          alignContent: 'flex-start',
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
                <SpaceCard
                  key={item.id}
                  data={item}
                  autoWidth={true}
                  isJoined={userJoinedSpaceIds.has(item.id)}
                  isFollowed={userFollowedSpaceIds.has(item.id)}
                />
              </ResponsiveGridItem>
            ))}
      </Grid>
    </Stack>
  );
};

export default SpaceList;
