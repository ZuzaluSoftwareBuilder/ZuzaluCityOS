'use client';

import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Sidebar } from '@/components/layout';
import React, { useCallback } from 'react';
import ExploreHeader from '@/components/layout/explore/exploreHeader';
import {
  Buildings,
  CalendarDots,
  Globe,
  Plus,
  Ticket,
} from '@phosphor-icons/react';
import ExploreNav, { INavItem } from '@/components/layout/explore/exploreNav';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import EventList from '@/app/events/components/eventList';

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

  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();
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
        bgImage={'/space/header.png'}
        title={'Events'}
        subTitle={'Subtitle'}
        versionLabel={'AppName v0.0.5'}
        addButtonIcon={<Plus size={20} weight={'fill'} format={'Stroke'} />}
        addButtonText={'Create Event'}
        onAdd={createButtonHandler}
      />

      <ExploreNav navItems={NavItems} onNavChange={handleNavChange} />

      <EventList />
    </LocalizationProvider>
  );
};

export default EventPage;
