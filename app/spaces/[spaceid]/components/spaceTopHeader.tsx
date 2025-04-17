'use client';

import SpaceSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/spaceSubSidebar/spaceSubSidebar';
import UserProfileSection from '@/components/layout/Header/UserProfileSection';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import {
  Button,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  Image,
  Skeleton,
} from '@heroui/react';
import { CaretLeft, List } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSpaceData } from './context/spaceData';

const SpaceTopHeader: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAbstractAuthContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { spaceData, isSpaceDataLoading } = useSpaceData();

  const handleBack = () => {
    router.replace(`/spaces`);
    setDrawerOpen(false);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    isClient && (
      <div className="pc:hidden tablet:block mobile:block">
        <div
          className={cn(
            'h-[50px] bg-[rgba(44,44,44,0.8)] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between py-[8px]',
            isAuthenticated ? 'pl-[10px]' : 'px-[10px]',
          )}
        >
          <Button
            className="flex h-[34px] min-w-[auto] items-center justify-center gap-1 rounded-[10px] bg-[#363636] p-1 hover:bg-[#424242]"
            onPress={() => toggleDrawer(true)}
          >
            {isSpaceDataLoading ? (
              <Skeleton className="size-[30px] rounded-full bg-[rgba(34,34,34,0.8)]"></Skeleton>
            ) : spaceData?.avatar ? (
              <Image
                src={spaceData.avatar}
                alt={spaceData.name}
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
            ) : null}

            <List size={20} weight="light" className="text-white" />
          </Button>

          <div className="flex items-center">
            <UserProfileSection avatarSize={30} />
          </div>
        </div>

        <Drawer
          isOpen={drawerOpen}
          onClose={() => toggleDrawer(false)}
          placement="left"
          classNames={{
            base: 'bg-transparent',
            backdrop: 'bg-[rgba(34,34,34,0.6)]',
            closeButton: 'hidden',
            body: 'bg-transparent',
          }}
        >
          <DrawerContent className="h-[calc(100vh)] w-[260px] rounded-none border-r border-[rgba(255,255,255,0.1)] bg-[rgba(34,34,34,0.8)] backdrop-blur-md">
            <DrawerBody className="flex h-full flex-col gap-0 p-0">
              <div className="flex h-[50px] items-center bg-[#2C2C2C] px-[10px]">
                <div
                  className="flex h-full cursor-pointer items-center gap-[5px] bg-transparent"
                  onClick={handleBack}
                >
                  <CaretLeft
                    size={20}
                    weight="light"
                    format={'Stroke'}
                    className="text-[#EDDCDC]"
                  />
                  <span className="text-[13px] font-medium text-white">
                    Exit Space
                  </span>
                </div>
              </div>

              <SpaceSubSidebar
                needBlur={true}
                onCloseDrawer={handleCloseDrawer}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    )
  );
};

export default SpaceTopHeader;
