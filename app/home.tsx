'use client';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Sidebar } from 'components/layout';
import React from 'react';
import Banner from './components/Banner';
import Communities from './components/Communities';
import OngoingEventList from './components/OngoingEventList';
import UpcomingEventList from './components/UpcomingEventList';

const Home: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
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
          <div className="lg:w-[calc(100vw-260px)] h-full w-screen flex-1 overflow-y-auto overflow-x-hidden text-white pc:w-full">
            <Banner />
            <Communities />
            <OngoingEventList />
            <UpcomingEventList />
          </div>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Home;
