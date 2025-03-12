'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { getSpaceEventsQuery } from '@/services/space';
import { Event, Space, SpaceEventData } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import {
  House,
  Ticket,
  CalendarDots,
  Chats,
  GitBranch,
} from '@phosphor-icons/react';
import TabItem from './tabItem';
import SubTabItemContainer from './subTabItemContainer';
import SidebarHeader from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/mainSubSidebar/sidebarHeader';
import { useQuery } from '@tanstack/react-query';
import { TableIcon } from '@/components/icons';

interface MainSubSidebarProps {
  onCloseDrawer?: () => void;
}

const MainSubSidebar = ({ onCloseDrawer }: MainSubSidebarProps) => {
  const pathname = usePathname();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const router = useRouter();
  const { composeClient, ceramic } = useCeramicContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const { data: spaceData, isLoading } = useQuery({
    queryKey: ['getSpaceByID', spaceId],
    queryFn: () => {
      return composeClient.executeQuery(getSpaceEventsQuery(), {
        id: spaceId,
      });
    },
    select: (data) => {
      return data?.data?.node as Space;
    },
  });

  useEffect(() => {
    if (spaceData) {
      const admins =
        spaceData?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const superAdmins =
        spaceData?.superAdmin?.map((superAdmin) =>
          superAdmin.id.toLowerCase(),
        ) || [];
      const members =
        spaceData?.members?.map((member) => member.id.toLowerCase()) || [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (admins.includes(userDID) || superAdmins.includes(userDID)) {
        setIsAdmin(true);
      }
      if (members.includes(userDID)) {
        setIsMember(true);
      }
    }
  }, [spaceData]);

  const isRouteActive = useCallback(
    (route: string) => {
      if (pathname === `/spaces/${spaceId}/${route}`) {
        return true;
      }

      if (route === 'home' && pathname === `/spaces/${spaceId}`) {
        return true;
      }

      if (pathname.startsWith(`/spaces/${spaceId}/${route}/`)) {
        return true;
      }

      return false;
    },
    [pathname, spaceId],
  );

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] border-r border-[#363636] flex flex-col relative">
      <SidebarHeader
        isAdmin={isAdmin}
        isLoading={isLoading}
        space={spaceData}
        onSpaceSettings={() => {
          router.push(`/spaces/${spaceId}/edit`);
          if (onCloseDrawer) onCloseDrawer();
        }}
      />

      <div className="flex flex-col p-[10px] gap-[5px] border-t border-b border-[rgba(255,255,255,0.1)]">
        <TabItem
          label="Home"
          icon={<House />}
          href={`/spaces/${spaceId}`}
          isActive={isRouteActive('home')}
          height={36}
          onClick={onCloseDrawer}
        />
        <TabItem
          label="Events"
          icon={<Ticket />}
          href={`/spaces/${spaceId}/events`}
          isActive={isRouteActive('events')}
          height={36}
          onClick={onCloseDrawer}
        />
        <TabItem
          label="Manage Events"
          icon={<TableIcon />}
          href={`/spaces/${spaceId}/adminevents`}
          isActive={isRouteActive('adminevents')}
          height={36}
          onClick={onCloseDrawer}
        />

      </div>

      <div className="flex-1 pt-5 px-2.5 overflow-y-auto">
        <div className="h-[20px] flex items-center">
          <span className="h-[14px] text-[12px] leading-[14px] text-white px-2.5">
            Community Apps
          </span>
        </div>

        <div className="mt-[20px] flex flex-col gap-[5px]">
          <div>
            <TabItem
              label="Calendar"
              href={`/spaces/${spaceId}/calendar`}
              icon={<CalendarDots />}
              isActive={isRouteActive('calendar')}
              onClick={onCloseDrawer}
            />
          </div>
          <TabItem
            label="Discussions"
            icon={<Chats />}
            isActive={false}
            locked={true}
          />
          <div>
            <TabItem
              label="Zu_Builders"
              icon={<CalendarDots />}
              isActive={false}
              locked={true}
            />
            <SubTabItemContainer>
              <TabItem
                label="Public Activities"
                icon={<GitBranch />}
                isActive={false}
                isSubTab={true}
                locked={true}
                hideLockIcon={true}
              />
            </SubTabItemContainer>
          </div>
        </div>
      </div>

      {/* not decide where to push this ui */}
      {/* {isAdmin && (
        <div className="absolute bottom-0 left-0 w-[260px] h-[90px] pt-5 px-2.5 border-t border-[rgba(255,255,255,0.1)]">
          <div className="text-[12px] leading-[14px] text-white px-2.5">
            ADMINS
          </div>
          <div className={'mt-2.5'}>
            <TabItem
              label="Space Settings"
              icon={<Gear />}
              isActive={false}
              onClick={() => router.push(`/spaces/${spaceId}/edit`)}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MainSubSidebar;
