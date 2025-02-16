'use client';

import { Sidebar } from 'components/layout';
import { useTheme } from '@mui/material/styles';
import { Stack, useMediaQuery } from '@mui/material';
import { Header, List, Nav, DappDetail } from './components';
import { useCallback, useEffect, useState } from 'react';
import Drawer from '@/components/drawer';
import DappForm from '@/components/form/DappForm';
import { Dapp } from '@/types';
import OwnedDappList from './components/ownedDappList';

export default function DappsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
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

  return (
    <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
      {!isTablet && <Sidebar selected="dapps" />}
      <Stack direction="column" flex={1} width="100%">
        <Header onAdd={toggleForm} />
        <Nav />
        <List
          onDetailClick={handleDetailClick}
          onOwnedDappsClick={toggleOwnedDapps}
        />
        <Drawer open={openForm} onClose={toggleForm} onOpen={toggleForm}>
          <DappForm handleClose={toggleForm} refetch={() => toggleForm()} />
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
                refetch={() => toggleForm()}
              />
            ) : (
              <OwnedDappList
                onViewDapp={(dapp) => handleDetailClick(dapp, true)}
                onEditDapp={handleEditDapp}
                handleClose={toggleOwnedDapps}
              />
            ))}
        </Drawer>
      </Stack>
    </Stack>
  );
}
