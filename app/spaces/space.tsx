'use client';
import { useState, useEffect, useCallback } from 'react';
import { Stack, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from 'components/layout';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space, SpaceData } from '@/types';
import { getSpacesQuery } from '@/services/space';
import ExploreHeader from '@/app/components/explore/exploreHeader';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Buildings, Plus } from '@phosphor-icons/react';
import ExploreNav, { INavItem } from '@/app/components/explore/exploreNav';
import { Globe, CalendarDots } from '@phosphor-icons/react';
import SpaceList from '@/app/spaces/components/list';

const NavItems: INavItem[] = [
  {
    label: 'Explore',
    icon: <Globe size={24} weight={'fill'} format={'Stroke'} />,
  },
  {
    label: 'Community Sessions',
    icon: <CalendarDots size={24} weight={'fill'} format={'Stroke'} />,
    isComingSoon: true,
  },
];

const SpacePage = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();
  const { isAuthenticated, showAuthPrompt } = useCeramicContext();

  const createButtonHandler = useCallback(() => {
    if (isAuthenticated) {
      router.push('/spaces/create');
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [isAuthenticated, router]);

  const handleNavChange = useCallback((item: INavItem, index: number) => {
    // for session
    // console.log('handleNavChange', item, index);
  }, []);

  return (
    <Stack
      direction="row"
      sx={{ backgroundColor: '#222222' }}
      minHeight="100vh"
    >
      {!isTablet && <Sidebar selected={'Spaces'} />}
      <Stack direction="column" flex={1} width="100%">
        {/*TODO space/header.png need to be updated*/}
        <ExploreHeader
          icon={<Buildings size={isMobile ? 60 : 80} />}
          bgImage={'/space/header.png'}
          title={'Communities'}
          subTitle={'Zuzalu tools for communities, events and more'}
          versionLabel={'Communities v0.5.0'}
          addButtonIcon={<Plus size={20} weight={'fill'} format={'Stroke'} />}
          addButtonText={'Create a Space'}
          onAdd={createButtonHandler}
        />

        <ExploreNav navItems={NavItems} onNavChange={handleNavChange} />

        <SpaceList />

        {/*TODO session list*/}

        <Dialog
          title="Warning"
          message="Login to Create a Space"
          showModal={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            showAuthPrompt();
            setShowModal(false);
          }}
        />
      </Stack>
    </Stack>
  );
};

export default SpacePage;
