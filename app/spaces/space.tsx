'use client';
import { SpaceCard } from '@/components/cards';
import { SpaceCardSkeleton } from '@/components/cards/SpaceCard';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import useUserSpace from '@/hooks/useUserSpace';
import { GET_ALL_SPACE_AND_MEMBER_QUERY } from '@/services/graphql/space';
import { Space } from '@/types';
import { Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from 'components/layout';
import { SpaceHeader } from './components';

const Home = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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

  return (
    <Stack
      direction="row"
      sx={{ backgroundColor: '#222222' }}
      minHeight="100vh"
    >
      {!isTablet && <Sidebar selected="Spaces" />}
      <Stack direction="column" borderLeft="1px solid #383838" flex={1}>
        <SpaceHeader />
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: '30px',
            columnGap: '40px',
            padding: '20px',
            justifyContent: 'start',
          }}
        >
          {!isLoading
            ? spaces?.map((item, index) => (
                <Grid
                  item
                  key={item.id}
                  xs={12}
                  sm={6}
                  md={4}
                  xl={3}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <SpaceCard
                    id={item.id}
                    logoImage={
                      item.avatar !== 'undefined' &&
                      item.avatar &&
                      !item.avatar.includes('blob')
                        ? item.avatar
                        : '/1.webp'
                    }
                    bgImage={
                      item.banner !== 'undefined' &&
                      item.banner &&
                      !item.banner.includes('blob')
                        ? item.banner
                        : '/5.webp'
                    }
                    title={item.name}
                    categories={item.category}
                    tagline={item.tagline}
                    isJoined={userJoinedSpaceIds.has(item.id)}
                    isFollowed={userFollowedSpaceIds.has(item.id)}
                  />
                </Grid>
              ))
            : Array.from({ length: 12 }).map((_, index) => {
                return (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={6}
                    md={4}
                    xl={3}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <SpaceCardSkeleton />
                  </Grid>
                );
              })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
