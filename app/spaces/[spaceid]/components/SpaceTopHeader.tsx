'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CaretLeft, List } from '@phosphor-icons/react';
import { Image, Drawer, DrawerContent, DrawerBody } from '@heroui/react';
import UserProfileSection from '@/components/layout/UserProfileSection';
import MainSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/mainSubSidebar';
import { useQuery } from '@tanstack/react-query';
import { Space } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';

const getSpaceByIdQuery = (id: string) => `
  query GetSpace($id: ID!) {
    node(id: $id) {
      ...on ZucitySpace {
        id
        avatar
        name
        description
        banner
      }
    }
  }
`;

const SpaceTopHeader: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { composeClient } = useCeramicContext();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  const { data: spaceData } = useQuery({
    queryKey: ['getSpaceByIdQuery', spaceId],
    queryFn: async () => {
      try {
        const response = await composeClient.executeQuery(
          getSpaceByIdQuery(spaceId),
          {
            id: spaceId,
          },
        );
        if (response.data && response.data.node) {
          return response.data.node as Space;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch space:', error);
        return null;
      }
    },
    enabled: !!spaceId && !!composeClient,
  });

  const handleBack = () => {
    router.replace(`/spaces`);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return isClient && (
    <div className="pc:hidden tablet:hidden mobile:block">
      <div className="h-[50px] bg-[rgba(44,44,44,0.8)] backdrop-blur-[40px] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between pl-[10px] py-[8px]">
        <button
          className="h-[34px] bg-[#363636] hover:bg-[#424242] rounded-[10px] flex items-center justify-center p-1 gap-1"
          onClick={() => toggleDrawer(true)}
        >
          {spaceData?.avatar && (
            <Image
              src={spaceData.avatar}
              alt={spaceData.name}
              width={30}
              height={30}
              className="rounded-full object-cover"
            />
          )}
          <List size={20} weight="light" className="text-white" />
        </button>

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
          backdrop: 'bg-black/50 backdrop-blur-sm',
          closeButton: 'hidden',
        }}
      >
        <DrawerContent className="w-[260px] h-[calc(100vh)] bg-[rgba(44,44,44,0.8)] rounded-none border-r border-[rgba(255,255,255,0.1)] backdrop-blur-[20px]">
          <DrawerBody className="p-0 flex flex-col h-full gap-0">
            <div className="flex items-center h-[36px] px-[10px]">
              <div
                className="h-[36px] bg-[#363636] bg-transparent flex items-center gap-[5px] cursor-pointer"
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
            <MainSubSidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SpaceTopHeader;
