'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  ArrowUpRightIcon,
  ShapeIcon,
  BuildingsIcon,
  TicketIcon,
  StorefrontIcon,
  VideoIcon,
} from 'components/icons';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn, Tab, Tabs, ScrollShadow, Skeleton } from '@heroui/react';
import { Button } from '@/components/base';
import useAllSpaceAndEvent from '@/hooks/useAllSpaceAndEvent';
import useUserSpaceAndEvent from '@/hooks/useUserSpaceAndEvent';

interface SidebarProps {
  selected: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const naviButtons = [
  {
    content: 'Home',
    icon: <HomeIcon />,
    url: '/',
  },
  {
    content: 'Communities',
    icon: <BuildingsIcon />,
    url: '/spaces',
    version: 'V0.5',
  },
  {
    content: 'Events',
    icon: <TicketIcon />,
    url: '/events',
    version: 'V0.5',
  },
  {
    content: 'dApps',
    icon: <ShapeIcon />,
    url: '/dapps',
    isNew: true,
    version: 'V0.1',
  },
  {
    content: 'Shop',
    icon: <StorefrontIcon />,
    url: '/shop',
    isSoon: true,
  },
  {
    content: 'Watch',
    icon: <VideoIcon />,
    url: '/watch',
    isSoon: true,
  },
];

const footerItems = [
  {
    content: 'Docs',
    url: 'https://bit.ly/ZuSoftware-doc',
  },
  {
    content: 'About',
    url: 'https://zuzalu.gitbook.io/zuzalu-beta-docs/welcome/zuzalu.city-vision-and-mission',
  },
  {
    content: 'X/Twitter',
    url: 'https://x.com/Zuzalu_city',
  },
  {
    content: 'Farcaster',
    url: 'https://warpcast.com/zuzalucity',
  },
  {
    content: 'Builder Chat',
    url: 'https://matrix.to/#/#zuzalusoftware:matrix.org',
  },
  {
    content: 'Medium',
    url: 'https://medium.com/@Zuzalu_city',
  },
  {
    content: 'Paragraph',
    url: 'https://paragraph.xyz/@zuzalu.city',
  },
  {
    content: 'Podcast',
    url: 'https://youtube.com/@ZuzaluCity',
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  selected,
  isMobile = false,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState('events');

  const { userEvents, userSpaces, isUserEventLoading, isUserSpaceLoading } = useUserSpaceAndEvent()

  const handleClick = useCallback(
    (item: any) => {
      !item.isSoon && router.push(item.url);
      onClose?.();
    },
    [router, onClose],
  );

  const handleTabChange = useCallback((key: React.Key) => {
    setSelectedTab(key as string);
  }, []);

  const renderLoadingSkeleton = useCallback(() => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center gap-[10px] p-[6px_10px]">
        <Skeleton className="rounded-[2px]">
          <div className="w-[20px] h-[20px]"></div>
        </Skeleton>
        <Skeleton className="rounded-[4px]">
          <div className="h-[17px] w-[190px]"></div>
        </Skeleton>
      </div>
    ));
  }, []);

  const renderItem = useCallback(
    (item: any, isEvent: boolean) => {
      const itemId = item.id;
      const itemImage = isEvent
        ? item.imageUrl
        : item.avatar || '/default-space-avatar.png';
      const itemTitle = isEvent ? item.title : item.name;
      const itemPath = isEvent ? `/events/${itemId}` : `/spaces/${itemId}`;

      return (
        <div
          key={itemId}
          className="flex items-center gap-[10px] p-[6px_10px] opacity-70 cursor-pointer hover:bg-[rgba(255,255,255,0.05)] rounded-[10px]"
          onClick={() => {
            router.push(itemPath);
            onClose?.();
          }}
        >
          <Image
            src={itemImage}
            alt={itemTitle}
            width={20}
            height={20}
            style={{
              objectFit: 'cover',
              borderRadius: '2px',
              height: '20px',
              width: '20px',
            }}
          />
          <p className="text-white text-[14px] font-semibold leading-[1.6] truncate">
            {itemTitle}
          </p>
        </div>
      );
    },
    [router, onClose],
  );

  const renderTabContent = useCallback(() => {
    const isEventsTab = selectedTab === 'events';
    const isLoading = isEventsTab ? isUserEventLoading : isUserSpaceLoading;
    const items = isEventsTab ? userEvents : userSpaces;

    if (isLoading) {
      return renderLoadingSkeleton();
    }

    return items.map((item) => renderItem(item, isEventsTab));
  }, [
    selectedTab,
    isUserEventLoading,
    isUserSpaceLoading,
    userEvents,
    userSpaces,
    renderLoadingSkeleton,
    renderItem,
  ]);

  return (
    <div
      className={cn(
        'h-[calc(100vh-50px)] sticky top-[50px] bg-[rgba(34,34,34,0.8)] flex flex-col border-r border-[#383838]',
        selected !== 'Space Details' ? 'w-[260px]' : 'w-auto',
        isMobile && 'w-full border-none bg-transparent',
      )}
    >
      <ScrollShadow className="flex-1 overflow-y-auto" visibility="bottom">
        <div className="flex flex-col p-[10px] gap-[10px]">
          {naviButtons.map((item, index) => {
            return (
              <div
                className={cn(
                  'flex p-[8px_10px] items-center gap-[10px] rounded-[10px] justify-between group transition-all duration-300 ease-in-out',
                  !item.isSoon
                    ? 'cursor-pointer hover:bg-[#383838]'
                    : 'opacity-70',
                  pathname === item.url ? 'bg-[#383838]' : 'bg-transparent',
                )}
                onClick={() => handleClick(item)}
                key={index}
              >
                <div className="flex flex-row items-center gap-[10px]">
                  <div
                    className={cn(
                      'flex flex-row items-center gap-[10px] opacity-60 transition-opacity duration-300 ease-in-out',
                      !item.isSoon ? 'group-hover:opacity-100' : 'opacity-20',
                      pathname === item.url && 'opacity-100',
                    )}
                  >
                    {item.icon}
                    {selected !== 'Space Details' && (
                      <p className="text-white font-medium text-[14px]">
                        {item.content}
                      </p>
                    )}
                  </div>
                  {item.isNew && (
                    <p className="rounded-[4px] bg-[rgba(125,255,209,0.10)] p-[2px_4px] text-[12px] text-[#7dffd1] font-semibold leading-[1.4]">
                      New!
                    </p>
                  )}
                </div>
                {item.isSoon ? (
                  <p className="text-[10px] leading-[1.2] opacity-50 text-white">
                    SOON
                  </p>
                ) : item.version ? (
                  <p className="text-[10px] leading-[1.2] opacity-30 text-white">
                    {item.version}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          className={`flex flex-col gap-[5px] border-t border-b-w-10 rounded-[10px] mx-[10px] py-[10px] justify-between`}
        >
          <p className="text-[10px] text-[rgba(255,255,255,0.7)] leading-[17px] text-center opacity-70 uppercase">
            YOUR activities
          </p>
          <Tabs
            aria-label="Tabs variants"
            variant="light"
            selectedKey={selectedTab}
            onSelectionChange={handleTabChange}
            className="w-full flex justify-center"
            classNames={{
              cursor: 'bg-white/5 shadow-none',
              tabList: 'w-full',
              tabContent: 'text-[14px] group-data-[selected=false]:opacity-50',
            }}
          >
            <Tab key="events" title="Events" />
            <Tab key="communities" title="Communities" />
          </Tabs>
          <div className="flex flex-col gap-[10px]">{renderTabContent()}</div>
        </div>
      </ScrollShadow>
      <div className="flex flex-col p-[10px] flex-shrink-0 border-t border-[#383838] gap-[10px]">
        <div className="flex flex-row flex-wrap gap-[10px] p-[10px]">
          {footerItems.map((item, index) => {
            return (
              <a
                key={index}
                className="text-[rgba(225,225,225,0.7)] text-[13px] no-underline hover:underline hover:decoration-[#7dffd1] hover:text-[#7dffd1] hover:opacity-70"
                href={item.url}
                target="_blank"
              >
                {item.content}
              </a>
            );
          })}
        </div>
        <div
          className="flex gap-[10px] items-center justify-center cursor-pointer opacity-70 hover:opacity-100"
          onClick={() =>
            window.open(
              'https://github.com/ZuzaluSoftwareBuilder/ZuzaluCityOS',
              '_blank',
            )
          }
        >
          <p className="text-[10px] text-white leading-[1.2] uppercase">
            ZUZalu city is open source
          </p>
          <Image
            src="/sidebar/gitHub.png"
            alt="github"
            width={24}
            height={24}
          />
        </div>
        <Button
          variant="light"
          color="functional"
          className="text-[13px] leading-[1.4] p-[6px_14px]"
          endContent={<ArrowUpRightIcon size={5} />}
          onPress={() =>
            window.open(
              'https://zuzapp-v1-events-app-delta.vercel.app/dashboard/home',
              '_blank',
            )
          }
        >
          Legacy Registry App
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
