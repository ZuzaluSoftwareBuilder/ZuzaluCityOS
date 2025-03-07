'use client';
import { useParams, useRouter } from 'next/navigation';
import { Image, Button, Tooltip } from '@heroui/react';
import { getSpaceEventsQuery } from '@/services/space';
import { Event, Space, SpaceEventData } from '@/types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useCeramicContext } from '@/context/CeramicContext';
import useGetShareLink from '@/hooks/useGetShareLink';
import { LockIcon, MegaPhoneIcon, SearchIcon } from '@/components/icons';
import { ChevronDownIcon } from '@heroicons/react/20/solid'

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

  const handleNavigation = (path: string) => {
    router.push(`/spaces/${spaceId}/${path}`);
    setActiveTab(path);
  };

  const toggleChannels = () => {
    setIsChannelsExpanded(!isChannelsExpanded);
  };

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] mobile:hidden tablet:hidden border-r border-[#363636] bg-[#222222] flex flex-col">
      {/* 社区头部 */}
      <div className="w-[259px] h-[55px] flex justify-between items-center px-[14px] py-[10px] border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-[10px]">
          <Image
            src={space?.avatar || '/placeholder-avatar.png'}
            alt={space?.name || 'Community'}
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-white font-semibold text-base">
            {space?.name || 'Community Name'}
          </span>
        </div>
        <Button isIconOnly variant="light" className="p-0">
          <ChevronDownIcon className='size-5 text-white' />
        </Button>
      </div>

      {/* 主导航区域 */}
      <div className="flex flex-col p-[10px] gap-[5px] border-b border-[rgba(255,255,255,0.1)]">
        {/* 搜索 */}
        <div className="flex items-center gap-[10px] px-[10px] py-[8px] rounded-[10px] bg-[rgba(255,255,255,0.1)] opacity-40">
          <SearchIcon />
          <span className="text-white text-[13px] font-medium">Search</span>
        </div>

        {/* 首页 */}
        <div
          className={`flex items-center gap-[10px] px-[10px] py-[8px] rounded-[8px] cursor-pointer ${activeTab === 'home' ? 'bg-[#363636]' : 'bg-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-70'}`}
          onClick={() => handleNavigation('home')}
        >
          <img src="/icons/home-icon.svg" alt="Home" className="w-5 h-5" />
          <span className="text-white text-[13px] font-medium">Home</span>
        </div>

        {/* 活动 */}
        <div
          className={`flex items-center gap-[10px] px-[10px] py-[8px] rounded-[8px] cursor-pointer ${activeTab === 'events' ? 'bg-[#363636]' : 'bg-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-70'}`}
          onClick={() => handleNavigation('events')}
        >
          <img src="/icons/events-icon.svg" alt="Events" className="w-5 h-5" />
          <span className="text-white text-[13px] font-medium">Events</span>
        </div>

        {/* 公告 */}
        <div
          className={`flex items-center justify-between px-[10px] py-[8px] rounded-[8px] cursor-pointer ${activeTab === 'announcements' ? 'bg-[#363636]' : 'bg-[rgba(255,255,255,0.1)] hover:opacity-70'}`}
          onClick={() => handleNavigation('announcements')}
        >
          <div className="flex items-center gap-[10px] opacity-50">
            <MegaPhoneIcon />
            <span className="text-white text-[13px] font-medium">
              Announcements
            </span>
          </div>
          <span className="text-[#7DFFD1] text-[13px] font-medium">2</span>
        </div>
      </div>

      {/* 频道区域 */}
      <div className="flex flex-col gap-[20px] px-[10px] pt-[20px]">
        {/* 频道标题 */}
        <div className="flex justify-between items-center px-[10px]">
          <span className="text-white text-xs font-normal uppercase tracking-[0.02em]">
            Channels
          </span>
          <Button
            isIconOnly
            variant="light"
            className="p-0"
            onClick={toggleChannels}
          >
            <img
              src="/icons/caret-down-icon.svg"
              alt="Toggle Channels"
              className={`w-5 h-5 transition-transform ${isChannelsExpanded ? '' : 'transform rotate-180'}`}
            />
          </Button>
        </div>

        {isChannelsExpanded && (
          <div className="flex flex-col gap-[5px]">
            {/* 日历 */}
            <div
              className={`flex items-center gap-[10px] px-[10px] py-[8px] rounded-[8px] cursor-pointer bg-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-70`}
              onClick={() => handleNavigation('calendar')}
            >
              <img
                src="/icons/calendar-icon.svg"
                alt="Calendar"
                className="w-5 h-5"
              />
              <span className="text-white text-[13px] font-medium">
                Calendar
              </span>
            </div>

            {/* 公共活动 */}
            <div className="flex items-center gap-[10px] pl-[20px] opacity-50">
              <div className="w-[4px] h-[20px] bg-white opacity-20 rounded-full"></div>
              <div className="flex items-center gap-[10px] px-[8px] py-[8px] rounded-[10px] bg-[rgba(255,255,255,0.1)] w-full">
                <img
                  src="/icons/git-branch-icon.svg"
                  alt="Public Activities"
                  className="w-5 h-5"
                />
                <span className="text-white text-[13px] font-medium">
                  Public Activities
                </span>
              </div>
            </div>

            {/* 讨论 */}
            <div className="flex items-center justify-between px-[10px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-70 cursor-pointer">
              <div className="flex items-center gap-[10px] opacity-60">
                <img
                  src="/icons/chats-icon.svg"
                  alt="Discussions"
                  className="w-5 h-5"
                />
                <span className="text-white text-[13px] font-medium">
                  Discussions
                </span>
              </div>
              <LockIcon size={5} />
            </div>

            {/* Zu_Builders */}
            <div className="flex items-center justify-between px-[10px] py-[8px] rounded-[8px] bg-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-70 cursor-pointer">
              <div className="flex items-center gap-[10px] opacity-60">
                <img
                  src="/icons/calendar-dots-icon.svg"
                  alt="Zu_Builders"
                  className="w-5 h-5"
                />
                <span className="text-white text-[13px] font-medium">
                  Zu_Builders
                </span>
              </div>
              <LockIcon size={5} />
            </div>

            {/* 公共活动2 */}
            <div className="flex items-center pl-[10px]">
              <img
                src="/icons/dot-outline-icon.svg"
                alt="Dot"
                className="w-5 h-5 opacity-50"
              />
              <div className="flex items-center gap-[10px] px-[10px] py-[8px] rounded-[10px] bg-[rgba(255,255,255,0.1)] opacity-50 hover:opacity-70 w-full">
                <img
                  src="/icons/git-branch-icon.svg"
                  alt="Public Activities"
                  className="w-5 h-5"
                />
                <span className="text-white text-[13px] font-medium">
                  Public Activities
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSubSidebar;
