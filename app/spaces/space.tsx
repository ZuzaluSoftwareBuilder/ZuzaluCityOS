'use client';
import { useState } from 'react';
import { Stack, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from 'components/layout';
import { SpaceHeader } from './components';
import { SpaceCard } from '@/components/cards';
import { SpaceCardSkeleton } from '@/components/cards/SpaceCard';
import useSpaceAndEvent from '@/hooks/useSpaceAndEvent';
import useUserJoinedSpace from '@/hooks/useUserJoinedSpace';

const Home = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const { userJoinedSpaceIds, userFollowedResourceIds } = useUserJoinedSpace();
  const { allSpaces: spaces, isAllSpaceLoading: isLoading } = useSpaceAndEvent();

  return (
    <Stack
      direction="row"
      sx={{ backgroundColor: '#222222' }}
      minHeight="100vh"
    >
      {!isTablet && <Sidebar selected={'Spaces'} />}
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
                    isUserJoined={userJoinedSpaceIds.has(item.id)}
                    isFollow={userFollowedResourceIds.has(item.id)}
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
