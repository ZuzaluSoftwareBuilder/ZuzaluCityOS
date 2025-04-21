'use client';

import { CubeIcon, DIcon, GlobalIcon } from '@/components/icons';
import ExploreHeader from '@/components/layout/explore/exploreHeader';
import ExploreNav, { INavItem } from '@/components/layout/explore/exploreNav';
import { Shapes } from '@phosphor-icons/react';

import { Drawer, DrawerContent } from '@/components/base';
import DappForm from '@/components/form/DappForm';
import { Dapp } from '@/types';
import { useDisclosure } from '@heroui/react';
import { useCallback, useState } from 'react';
import { DappDetail, List } from './components';
import OwnedDappList from './components/ownedDappList';

const NavItems: INavItem[] = [
  { label: 'Explore Apps', icon: <GlobalIcon /> },
  { label: 'Ecosystem Projects', icon: <CubeIcon />, isComingSoon: true },
];

export default function DappsPage() {
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

  const handleNavChange = useCallback((item: INavItem, index: number) => {
    // for session
    // console.log('handleNavChange', item, index);
  }, []);

  return (
    <>
      <ExploreHeader
        icon={
          <Shapes
            weight="duotone"
            format="Stroke"
            className="size-[80px] mobile:size-[60px]"
          />
        }
        bgImage={'/dapps/header.png'}
        title={'Apps'}
        titlePrefixIcon={<DIcon />}
        subTitle={'Zuzalu tools for Communities, Events & More'}
        versionLabel={'dApps v0.1'}
        addButtonText={'List Your App'}
        onAdd={onOpenEditDapp}
      />

      <ExploreNav navItems={NavItems} onNavChange={handleNavChange} />

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
    </>
  );
}
