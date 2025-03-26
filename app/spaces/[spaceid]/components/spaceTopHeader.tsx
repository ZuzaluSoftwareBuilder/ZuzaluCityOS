'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CaretLeft, List } from '@phosphor-icons/react';
import {
  Image,
  Drawer,
  DrawerContent,
  DrawerBody,
  Button,
  cn,
  Skeleton,
} from '@heroui/react';
import UserProfileSection from '@/components/layout/UserProfileSection';
import SpaceSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/spaceSubSidebar/spaceSubSidebar';
import { Space } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_QUERY_BY_ID } from '@/services/graphql/space';

const SpaceTopHeader: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useCeramicContext();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: spaceData, isLoading } = useGraphQL(
    ['getSpaceByID', spaceId],
    GET_SPACE_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => data?.data?.node as Space,
      enabled: !!spaceId,
    },
  );

  console.log(spaceData);

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
            className="h-[34px] min-w-[auto] bg-[#363636] hover:bg-[#424242] rounded-[10px] flex items-center justify-center p-1 gap-1"
            onPress={() => toggleDrawer(true)}
          >
            {isLoading ? (
              <Skeleton className="w-[30px] h-[30px] rounded-full bg-[rgba(34,34,34,0.8)]"></Skeleton>
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
          <DrawerContent className="w-[260px] h-[calc(100vh)] border-r border-[rgba(255,255,255,0.1)] rounded-none bg-[rgba(34,34,34,0.8)] backdrop-filter backdrop-blur-[12px]">
            <DrawerBody className="p-0 flex flex-col h-full gap-0">
              <div className="flex items-center h-[50px] px-[10px] bg-[#2C2C2C]">
                <div
                  className="h-full bg-[#363636] bg-transparent flex items-center gap-[5px] cursor-pointer"
                  onClick={handleBack}
                >
                  <CaretLeft
                    size={20}
                    weight="light"
                    format={'Stroke'}
                    className="text-[#EDDCDC]"
                  />
                  <span className="text-white text-[13px] font-medium">
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
