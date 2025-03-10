'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { getSpaceEventsQuery } from '@/services/space';
import { Event, Space, SpaceEventData } from '@/types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useCeramicContext } from '@/context/CeramicContext';
import useGetShareLink from '@/hooks/useGetShareLink';
import {
  House,
  MagnifyingGlass,
  Ticket,
  Megaphone,
  CalendarDots,
  Chats,
  GitBranch,
  Gear,
} from '@phosphor-icons/react';
import TabItem from './tabItem';
import SubTabItemContainer from './subTabItemContainer';
import SidebarHeader from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/mainSubSidebar/sidebarHeader';

const MainSubSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const theme = useTheme();
  const router = useRouter();
  const { composeClient, ceramic } = useCeramicContext();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const [space, setSpace] = useState<Space>();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [currentHref, setCurrentHref] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(true);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { shareUrl } = useGetShareLink({ id: spaceId, name: space?.name });

  const getSpaceByID = async () => {
    setIsEventsLoading(true);
    const spaceId = params.spaceid.toString();

    const response: any = await composeClient.executeQuery(
      getSpaceEventsQuery(),
      {
        id: spaceId,
      },
    );
    const spaceData: Space = response.data.node as Space;
    console.log('spaceData', spaceData);
    setSpace(spaceData);
    const eventData: SpaceEventData = response.data.node
      .events as SpaceEventData;
    const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
    setEvents(fetchedEvents);
    return spaceData;
  };

  useEffect(() => {
    const fetchData = async () => {
      setCurrentHref(window.location.href);
      const space = await getSpaceByID();
      document.title = space?.name + ' - ' + 'Zuzalu City';
      const admins =
        space?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const superAdmins =
        space?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) ||
        [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (admins.includes(userDID) || superAdmins.includes(userDID)) {
        setIsAdmin(true);
      }
    };

    fetchData()
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, [ceramic?.did?.parent]);

  const isRouteActive = (route: string) => {
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
  };

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] mobile:hidden tablet:hidden border-r border-[#363636] bg-[#222222] flex flex-col pb-[90px] relative">
      <SidebarHeader space={space} />

      {/* 主导航区域 */}
      <div className="flex flex-col p-[10px] gap-[5px] border-t border-b border-[rgba(255,255,255,0.1)]">
        {/* 搜索 */}
        <div className="flex items-center gap-[10px] px-[10px] py-[8px] rounded-[10px] opacity-40">
          <MagnifyingGlass size={20} weight={'thin'} format="Stroke" />
          {/* TODO useless for now */}
          <span className="text-white text-[13px] font-medium">Search</span>
        </div>

        <TabItem
          label="Home"
          icon={<House />}
          href={`/spaces/${spaceId}`}
          isActive={isRouteActive('home')}
          height={36}
        />
        <TabItem
          label="Events"
          icon={<Ticket />}
          href={`/spaces/${spaceId}/events`}
          isActive={isRouteActive('events')}
          height={36}
        />
        <TabItem
          label="Announcemnets"
          icon={<Megaphone />}
          href={`/spaces/${spaceId}/announcements`}
          isActive={isRouteActive('announcements')}
          // locked={true}
          count={2}
          height={36}
        />
      </div>

      <div className="flex-1 pt-5 px-2.5 overflow-y-auto">
          <div className="h-[14px] text-[12px] leading-[14px] text-white px-2.5">
            Community Apps
          </div>

        <div className="mt-2.5 flex flex-col gap-[5px]">
          <div>
            <TabItem
              label="Calendar"
              icon={<CalendarDots />}
              isActive={false}
            />
            <SubTabItemContainer>
              <TabItem
                href={`/spaces/${spaceId}/calendar`}
                label="Public Activities"
                icon={<GitBranch />}
                isActive={isRouteActive('calendar')}
                isSubTab={true}
              />
            </SubTabItemContainer>
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
              />
            </SubTabItemContainer>
          </div>
        </div>
      </div>

      {isAdmin && (
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
      )}
    </div>
  );
};

export default MainSubSidebar;
