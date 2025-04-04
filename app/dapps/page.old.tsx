'use client';

import { Sidebar } from 'components/layout';
import { useTheme } from '@mui/material';
import { Stack, useMediaQuery } from '@mui/material';
import { Header, List, Nav, DappDetail } from './components';
import { useCallback, useState } from 'react';
import { Drawer, DrawerContent } from '@/components/base';
import DappForm from '@/components/form/DappForm';
import { Dapp } from '@/types';
import OwnedDappList from './components/ownedDappList';
import { useDisclosure } from '@heroui/react';

export default function DappsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [showOwnedDapps, setShowOwnedDapps] = useState(false);
  const [showEditDapp, setShowEditDapp] = useState(false);
  const [detailData, setDetailData] = useState<Dapp | undefined>(undefined);
  const {
    isOpen: isOwnedDappsOpen,
    onOpen: onOpenOwnedDapps,
    onOpenChange: onOpenChangeOwnedDapps,
  } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onOpenDetail,
    onOpenChange: onOpenChangeDetail,
  } = useDisclosure();
  const {
    isOpen: isEditDappOpen,
    onOpen: onOpenEditDapp,
    onOpenChange: onOpenChangeEditDapp,
  } = useDisclosure();

  const handleDetailClick = useCallback(
    (data: Dapp, isOwned: boolean = false) => {
      !isOwned && onOpenDetail();
      setDetailData(data);
      isOwned && setShowOwnedDapps(true);
    },
    [onOpenDetail],
  );

  const handleEditDapp = useCallback((data: Dapp) => {
    setShowEditDapp(true);
    setDetailData(data);
  }, []);

  return (
    <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
      {!isTablet && <Sidebar selected="dapps" />}
      <Stack direction="column" flex={1} width="100%">
        <Header onAdd={onOpenEditDapp} />
        <Nav />
        <List
          onDetailClick={handleDetailClick}
          onOwnedDappsClick={onOpenOwnedDapps}
        />

        <Drawer
          isOpen={isEditDappOpen}
          classNames={{
            base: 'w-[700px] max-w-[700px] mobile:w-[100%] mobile:max-w-[100%]',
          }}
          onOpenChange={onOpenChangeEditDapp}
        >
          <DrawerContent>
            {(onClose) => {
              return <DappForm handleClose={onClose} />;
            }}
          </DrawerContent>
        </Drawer>
        <Drawer
          isOpen={isDetailOpen}
          classNames={{
            base: 'w-[700px] max-w-[700px] mobile:w-[100%] mobile:max-w-[100%]',
          }}
          onOpenChange={onOpenChangeDetail}
        >
          <DrawerContent>
            {(onClose) => {
              return <DappDetail handleClose={onClose} data={detailData} />;
            }}
          </DrawerContent>
        </Drawer>
        <Drawer
          isOpen={isOwnedDappsOpen}
          classNames={{
            base: 'w-[700px] max-w-[700px] mobile:w-[100%] mobile:max-w-[100%]',
          }}
          onOpenChange={onOpenChangeOwnedDapps}
        >
          <DrawerContent>
            {(onClose) => {
              return (
                <>
                  {isOwnedDappsOpen &&
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
                        handleClose={onClose}
                      />
                    ))}
                </>
              );
            }}
          </DrawerContent>
        </Drawer>
      </Stack>
    </Stack>
  );
}
