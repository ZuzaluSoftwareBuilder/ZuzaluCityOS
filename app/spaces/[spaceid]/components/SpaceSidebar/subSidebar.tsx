'use client';
import { useParams, useRouter } from 'next/navigation';
import { Image, Button, Tooltip } from '@heroui/react';
import { getSpaceEventsQuery } from '@/services/space';
import { Event, Space, SpaceEventData } from '@/types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useCeramicContext } from '@/context/CeramicContext';
import useGetShareLink from '@/hooks/useGetShareLink';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
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

const NewSubSidebar = () => {
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

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] mobile:hidden tablet:hidden border-r border-[#363636] bg-[#222222] flex flex-col pb-[90px] relative">
      {/* 社区头部 */}
      <div
        className="w-[259px] h-[55px] relative group cursor-pointer"
        style={{
          background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-[rgba(34,34,34,0.8)] backdrop-blur-[44px] transition-colors group-hover:bg-[rgba(34,34,34,0.5)]"></div>
        <div className="absolute top-0 left-0 w-full h-full z-20 flex justify-between items-center px-[14px] py-[10px]">
          <div className="flex justify-between items-center gap-2.5">
            <Image
              src={space?.avatar || '/placeholder-avatar.png'}
              alt={space?.name || 'Community'}
              width={35}
              height={35}
              className="rounded-full object-cover"
            />
            <span className="w-[156px] text-white font-semibold text-base truncate">
              {space?.name || 'Community'}
            </span>
          </div>
          <ChevronDownIcon className="size-5 text-white" />
        </div>
      </div>

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
          href={`/spaces/${spaceId}/home`}
          isActive={true}
        />
        <TabItem
          label="Events"
          icon={<Ticket />}
          href={`/spaces/${spaceId}/events`}
          isActive={false}
          locked={true}
          onClick={() => {
            console.log('Events', spaceId);
          }}
        />
        <TabItem
          label="Announcemnets"
          icon={<Megaphone />}
          href={`/spaces/${spaceId}/announcements`}
          isActive={false}
          count={2}
        />
      </div>

      <div className="flex-1 pt-5 px-2.5">
        <div>
          <span className="text-[12px] leading-[14px] text-white px-2.5">
            Community Apps
          </span>
        </div>

        <div className="mt-2.5">
          {/*TODO confirm click event */}
          <TabItem label="Calendar" icon={<CalendarDots />} isActive={false} />
          <TabItem
            label="Public Activities"
            icon={<GitBranch />}
            isActive={false}
            isSubTab={true}
          />
          <TabItem
            label="Discussions"
            icon={<Chats />}
            isActive={false}
            locked={true}
          />
          <TabItem
            label="Zu_Builders"
            icon={<CalendarDots />}
            isActive={false}
            locked={true}
          />
          <TabItem
            label="Public Activities"
            icon={<GitBranch />}
            isActive={false}
            isSubTab={true}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-[260px] h-[90px] pt-5 px-2.5 border-t border-[rgba(255,255,255,0.1)]">
        <div className="text-[12px] leading-[14px] text-white px-2.5">
          ADMINS
        </div>
        <div className={'mt-2.5'}>
          <TabItem
            label="Space Settings"
            icon={<Gear />}
            isActive={false}
            onClick={() => console.log('Space Settings', spaceId)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewSubSidebar;
