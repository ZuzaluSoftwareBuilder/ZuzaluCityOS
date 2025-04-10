'use client';

import EventListWithCalendar from '@/app/events/components/EventList/EventListWithCalendar';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import ExploreHeader from '@/components/layout/explore/exploreHeader';
import ExploreNav, { INavItem } from '@/components/layout/explore/exploreNav';
import ExploreSearch from '@/components/layout/explore/exploreSearch';
import { useCeramicContext } from '@/context/CeramicContext';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarDots, Globe, Ticket } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';

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
          <Ticket
            weight="duotone"
            format="Stroke"
            className="size-[80px] mobile:size-[60px]"
          />
        }
        bgImage={'/events/header.png'}
        bgImageWidth={220}
        bgImageHeight={220}
        bgImageTop={20}
        title={'Events'}
        subTitle={'Explore & Join Community Events'}
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

      <Stack direction="column" flex={1} p={isMobile ? '20px 10px' : '20px'}>
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
