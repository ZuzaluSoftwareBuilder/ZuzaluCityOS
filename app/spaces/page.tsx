'use client';
import { useCallback } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import ExploreHeader from '@/components/layout/explore/exploreHeader';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Buildings } from '@phosphor-icons/react';
import ExploreNav, { INavItem } from '@/components/layout/explore/exploreNav';
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
    <>
      {/*TODO space/header.png need to be updated*/}
      <ExploreHeader
        icon={
          <Buildings
            weight="duotone"
            format="Stroke"
            className="size-[80px] mobile:size-[60px]"
          />
        }
        bgImage={'/space/header.png'}
        bgImageWidth={287}
        bgImageHeight={278}
        bgImageTop={20}
        title={'Communities'}
        subTitle={'Zuzalu tools for communities, events and more'}
        versionLabel={'Communities v0.5.0'}
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
    </>
  );
};

export default SpacePage;
