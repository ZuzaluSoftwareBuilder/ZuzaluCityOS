'use client';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, SpaceData } from '@/types';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Sidebar } from 'components/layout';
import React, { useEffect, useState } from 'react';
import { getSpacesQuery } from '@/services/space';
import Banner from './components/Banner';
import Communities from './components/Communities';
import OngoingEventList from './components/OngoingEventList';
import UpcomingEventList from './components/UpcomingEventList';

const Home: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [spaces, setSpaces] = useState<Space[]>([]);

  const { ceramic, composeClient } = useCeramicContext();

  const getSpaces = async () => {
    try {
      const response: any = await composeClient.executeQuery(getSpacesQuery);
      if ('zucitySpaceIndex' in response.data) {
        const spaceData: SpaceData = response.data as SpaceData;
        let fetchedSpaces: Space[] = spaceData.zucitySpaceIndex.edges.map(
          (edge) => edge.node,
        );
        const shuffledSpaces = [...fetchedSpaces].sort(
          () => Math.random() - 0.5,
        );
        setSpaces(shuffledSpaces);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  };

  useEffect(() => {
    document.title = 'Zuzalu City';
    Promise.all([getSpaces()]).catch((error) => {
      console.error('An error occurred:', error);
    });
  }, [ceramic.did?.parent]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width={'100vw'} minHeight={'calc(100vh - 50px)'}>
        <Box
          display="grid"
          gridTemplateColumns={'auto 1fr'}
          sx={{
            backgroundColor: 'rgba(34, 34, 34, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
          height={'calc(100vh - 50px)'}
        >
          {!isTablet && <Sidebar selected="Home" />}
          <div className="flex-1 w-full lg:w-[calc(100vw-260px)] h-full overflow-y-auto overflow-x-hidden text-white">
            <Banner />
            <Communities data={spaces} />
            <OngoingEventList />
            <UpcomingEventList />
          </div>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Home;
