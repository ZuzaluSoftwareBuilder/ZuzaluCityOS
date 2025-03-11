'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaretLeft, List } from '@phosphor-icons/react';
import { Image, Drawer, DrawerContent, DrawerBody } from '@heroui/react';
import SpaceList from '@/app/spaces/[spaceid]/components/sidebar/spaceList';
import UserProfileSection from '@/components/layout/UserProfileSection';
import MainSidebar from '@/app/spaces/[spaceid]/components/sidebar/mainSidebar';
import MainSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/mainSubSidebar';

interface SpaceEditHeaderProps {
  spaceId: string;
  spaceName: string;
  spaceAvatar?: string;
  title: string;
}

const SpaceEditHeader: React.FC<SpaceEditHeaderProps> = ({
  spaceId,
  spaceName,
  spaceAvatar,
  title,
}) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleBack = () => {
    router.push(`/spaces/${spaceId}`);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <div className="h-[50px] bg-[rgba(44,44,44,0.8)] backdrop-blur-[40px] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-[10px] py-[8px]">
        <button
          className="h-[34px] bg-[#363636] hover:bg-[#424242] rounded-[10px] flex items-center justify-center p-1 gap-1"
          onClick={() => toggleDrawer(true)}
        >
          {spaceAvatar && (
            <Image
              src={spaceAvatar}
              alt={spaceName}
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
                className="h-[34px] bg-[#363636] bg-transparent flex items-center gap-[5px] cursor-pointer"
                onClick={handleBack}
              >
                <CaretLeft
                  size={18}
                  weight="light"
                  format={'Stroke'}
                  className="text-white"
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
    </>
  );
};

export default SpaceEditHeader;
