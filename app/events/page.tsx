'use client';

import { useMediaQuery, useTheme, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useCallback, useState } from 'react';
import ExploreHeader from '@/components/layout/explore/exploreHeader';
import { CalendarDots, Globe, Plus, Ticket } from '@phosphor-icons/react';
import ExploreNav, { INavItem } from '@/components/layout/explore/exploreNav';
import { useCeramicContext } from '@/context/CeramicContext';
import ExploreSearch from '@/components/layout/explore/exploreSearch';
import EventListWithCalendar from '@/app/events/components/EventList/EventListWithCalendar';
import Dialog from '@/app/spaces/components/Modal/Dialog';

const NavItems: INavItem[] = [
  {
    label: 'Explore',
    icon: <Globe size={24} weight={'fill'} format={'Stroke'} />,
  },
  {
    label: 'Public Sessions',
    icon: <CalendarDots size={24} weight={'fill'} format={'Stroke'} />,
    isComingSoon: true,
  },
];

const EventPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState<string>('');

  const { isAuthenticated, showAuthPrompt } = useCeramicContext();

  const createButtonHandler = useCallback(() => {
    if (isAuthenticated) {
      // TODO create event
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  const handleNavChange = useCallback((item: INavItem, index: number) => {
    // for session
    // console.log('handleNavChange', item, index);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ExploreHeader
        icon={
          <Ticket size={isMobile ? 60 : 80} weight="duotone" format="Stroke" />
        }
        bgImage={'/events/header.png'}
        bgImageWidth={220}
        bgImageHeight={220}
        bgImageTop={20}
        title={'Events'}
        subTitle={'Subtitle'}
        versionLabel={'AppName v0.0.5'}
        addButtonText={'Create Event'}
      />

      <Dialog
        title="Warning"
        message="Login to Create Event"
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          showAuthPrompt();
          setShowModal(false);
        }}
      />

      <ExploreNav navItems={NavItems} onNavChange={handleNavChange} />

      <Stack
        direction="column"
        flex={1}
        p={isMobile ? '20px 10px' : '20px'}
      >
        <ExploreSearch
          value={searchVal}
          onChange={setSearchVal}
          className="mb-[10px]"
        />

        <EventListWithCalendar searchVal={searchVal} />

      </Stack>
    </LocalizationProvider>
  );
};

export default EventPage;
