'use client';

import { useTheme } from '@mui/material/styles';
import { Stack, useMediaQuery } from '@mui/material';
import { List, DappDetail } from './components';
import React, { useCallback, useEffect, useState } from 'react';
import Drawer from '@/components/drawer';
import DappForm from '@/components/form/DappForm';
import { Dapp } from '@/types';
import OwnedDappList from './components/ownedDappList';
import ExploreHeader from '@/components/layout/explore/exploreHeader';
import { Shapes, } from '@phosphor-icons/react';
import { CubeIcon, DIcon, GlobalIcon } from '@/components/icons';
import ExploreNav, { INavItem } from '@/components/layout/explore/exploreNav';

const NavItems: INavItem[] = [
  { label: 'Explore Apps', icon: <GlobalIcon /> },
  { label: 'Ecosystem Projects', icon: <CubeIcon />, isComingSoon: true },
];

export default function DappsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openOwnedDapps, setOpenOwnedDapps] = useState(false);
  const [showOwnedDapps, setShowOwnedDapps] = useState(false);
  const [showEditDapp, setShowEditDapp] = useState(false);
  const [detailData, setDetailData] = useState<Dapp | undefined>(undefined);

  const toggleForm = useCallback(() => {
    setOpenForm((v) => !v);
  }, []);
  const toggleDetail = useCallback(() => {
    setOpenDetail((v) => !v);
  }, []);

  const toggleOwnedDapps = useCallback(() => {
    setOpenOwnedDapps((v) => !v);
  }, []);

  const handleDetailClick = useCallback(
    (data: Dapp, isOwned: boolean = false) => {
      !isOwned && setOpenDetail(true);
      setDetailData(data);
      isOwned && setShowOwnedDapps(true);
    },
    [],
  );

  const handleEditDapp = useCallback((data: Dapp) => {
    setShowEditDapp(true);
    setDetailData(data);
  }, []);

  useEffect(() => {
    if (!openDetail) {
      setDetailData(undefined);
    }
  }, [openDetail]);

  const handleNavChange = useCallback((item: INavItem, index: number) => {
    // for session
    // console.log('handleNavChange', item, index);
  }, []);

  return (
    <>
      <ExploreHeader
        icon={
          <Shapes size={isMobile ? 60 : 80} weight="duotone" format="Stroke" />
        }
        bgImage={'/dapps/header.png'}
        title={'Apps'}
        titlePrefixIcon={<DIcon />}
        subTitle={'Zuzalu tools for Communities, Events & More'}
        versionLabel={'dApps v0.1'}
        addButtonText={'List Your App'}
        onAdd={toggleForm}
      />

      <ExploreNav navItems={NavItems} onNavChange={handleNavChange} />

      <List
        onDetailClick={handleDetailClick}
        onOwnedDappsClick={toggleOwnedDapps}
      />
      <Drawer open={openForm} onClose={toggleForm} onOpen={toggleForm}>
        <DappForm handleClose={toggleForm} />
      </Drawer>
      <Drawer open={openDetail} onClose={toggleDetail} onOpen={toggleDetail}>
        <DappDetail handleClose={toggleDetail} data={detailData} />
      </Drawer>
      <Drawer
        open={openOwnedDapps}
        onClose={toggleOwnedDapps}
        onOpen={toggleOwnedDapps}
      >
        {openOwnedDapps &&
          (showOwnedDapps ? (
            <DappDetail
              handleClose={() => {
                setShowOwnedDapps(false);
                setDetailData(undefined);
              }}
              data={detailData}
            />
          ) : showEditDapp ? (
            <DappForm
              handleClose={() => {
                setShowEditDapp(false);
                setDetailData(undefined);
              }}
              initialData={detailData}
            />
          ) : (
            <OwnedDappList
              onViewDapp={(dapp) => handleDetailClick(dapp, true)}
              onEditDapp={handleEditDapp}
              handleClose={toggleOwnedDapps}
            />
          ))}
      </Drawer>
    </>
  );
}
