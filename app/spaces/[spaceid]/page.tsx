'use client';

import { useParams } from 'next/navigation';
import SpaceSection from './components/home/spaceSection';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';
import { Event, Space } from '@/types';
import React, { useEffect, useMemo } from 'react';
import SpaceEventList from '@/app/spaces/[spaceid]/components/home/spaceEventList';
import SideNav from '@/app/spaces/[spaceid]/components/home/sideNav/sideNav';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base';
import { CaretUpDown } from '@phosphor-icons/react';
import useOpenDraw from '@/hooks/useOpenDraw';

const SpaceHomePage: React.FC = () => {
  const params = useParams();
  const spaceId = params?.spaceid?.toString() ?? '';
  const { adminRole, memberRole } = useBuildInRole();
  const { open, handleClose, handleOpen } = useOpenDraw();

  const { data: spaceData, isLoading } = useGraphQL(
    ['getSpaceAndEvents', spaceId],
    GET_SPACE_AND_EVENTS_QUERY_BY_ID,
    {
      id: spaceId,
      first: 100,
      userRolesFilters: {
        where: {
          roleId: {
            in: [adminRole, memberRole].map((role) => role?.id ?? ''),
          },
        },
      },
    },
    {
      select: (data) => {
        return data?.data?.node as Space;
      },
      enabled: !!adminRole && !!memberRole,
    },
  );

  const eventsData = useMemo(() => {
    return (spaceData?.events?.edges.map((edge) => edge.node) || []) as Event[];
  }, [spaceData]);

  useEffect(() => {
    if (spaceData) {
      console.log('spaceData', spaceData);
    }
    if (eventsData.length > 0) {
      console.log('eventsData', eventsData);
    }
  }, [spaceData, eventsData]);

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <SpaceSection spaceData={spaceData} isLoading={isLoading} />

        {/* mobile: drawer trigger */}
        <div
          className="hidden cursor-pointer items-center justify-between bg-[#363636] px-[20px] py-[10px] tablet:flex mobile:flex"
          onClick={handleOpen}
        >
          <span className="text-[16px] font-[600] leading-[1.2] text-white">
            About Community
          </span>
          <CaretUpDown size={20} weight="light" className="text-white" />
        </div>

        {/* TODO: remain old logic code (but use new EventCard component) for now, wait for new design */}
        <SpaceEventList eventsData={eventsData} isLoading={isLoading} />
      </div>

      <div className="flex w-[330px] flex-col gap-[10px] border-l border-[rgba(255,255,255,0.1)] bg-[#222] tablet:hidden mobile:hidden">
        <SideNav spaceData={spaceData} />
      </div>

      <Drawer
        isOpen={open}
        onClose={handleClose}
        placement="bottom"
        hideCloseButton={true}
      >
        <DrawerContent className="max-h-[600px] rounded-t-[20px]  border-t-2 shadow-[0px_-6px_24px_0px_rgba(0,0,0,0.25)]">
          <CommonDrawerHeader title={'About Community'} onClose={handleClose} />

          <DrawerBody className="p-[20px]">
            <div className="hidden w-full flex-col  gap-[10px] tablet:flex mobile:flex">
              <SideNav spaceData={spaceData} inDrawer={true} />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SpaceHomePage;
