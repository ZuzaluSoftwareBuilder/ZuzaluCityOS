'use client';
import { Button } from '@/components/base';
import useUserEvent from '@/hooks/useUserEvent';
import useUserSpace from '@/hooks/useUserSpace';
import { cn, ScrollShadow, Skeleton, Tab, Tabs } from '@heroui/react';
import {
  ArrowUpRightIcon,
  BuildingsIcon,
  HomeIcon,
  ShapeIcon,
  StorefrontIcon,
  TicketIcon,
  VideoIcon,
} from 'components/icons';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useCallback, useState } from 'react';
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

  const { userJoinedSpaces, isUserSpaceLoading } = useUserSpace();
  const { userJoinedEvents, isUserEventLoading } = useUserEvent();

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
          <div className="size-[20px]"></div>
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
          className="flex cursor-pointer items-center gap-[10px] rounded-[10px] p-[6px_10px] opacity-70 hover:bg-[rgba(255,255,255,0.05)]"
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
          <p className="truncate text-[14px] font-semibold leading-[1.6] text-white">
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
    const items = isEventsTab ? userJoinedEvents : userJoinedSpaces;

    if (isLoading) {
      return renderLoadingSkeleton();
    }

    return items?.map((item) => renderItem(item, isEventsTab));
  }, [
    selectedTab,
    isUserEventLoading,
    isUserSpaceLoading,
    userJoinedEvents,
    userJoinedSpaces,
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
        <div className="flex flex-col gap-[10px] p-[10px]">
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
                      <p className="text-[14px] font-medium text-white">
                        {item.content}
                      </p>
                    )}
                  </div>
                  {item.isNew && (
                    <p className="rounded-[4px] bg-[rgba(125,255,209,0.10)] p-[2px_4px] text-[12px] font-semibold leading-[1.4] text-[#7dffd1]">
                      New!
                    </p>
                  )}
                </div>
                {item.isSoon ? (
                  <p className="text-[10px] leading-[1.2] text-white opacity-50">
                    SOON
                  </p>
                ) : item.version ? (
                  <p className="text-[10px] leading-[1.2] text-white opacity-30">
                    {item.version}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          className={`mx-[10px] flex flex-col justify-between gap-[5px] rounded-[10px] border-t border-b-w-10 py-[10px]`}
        >
          <p className="text-center text-[10px] uppercase leading-[17px] text-[rgba(255,255,255,0.7)] opacity-70">
            YOUR activities
          </p>
          <Tabs
            aria-label="Tabs variants"
            variant="light"
            selectedKey={selectedTab}
            onSelectionChange={handleTabChange}
            className="flex w-full justify-center"
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
      <div className="flex shrink-0 flex-col gap-[10px] border-t border-[#383838] p-[10px]">
        <div className="flex flex-row flex-wrap gap-[10px] p-[10px]">
          {footerItems.map((item, index) => {
            return (
              <a
                key={index}
                className="text-[13px] text-[rgba(225,225,225,0.7)] no-underline hover:text-[#7dffd1] hover:underline hover:decoration-[#7dffd1] hover:opacity-70"
                href={item.url}
                target="_blank"
              >
                {item.content}
              </a>
            );
          })}
        </div>
        <div
          className="flex cursor-pointer items-center justify-center gap-[10px] opacity-70 hover:opacity-100"
          onClick={() =>
            window.open(
              'https://github.com/ZuzaluSoftwareBuilder/ZuzaluCityOS',
              '_blank',
            )
          }
        >
          <p className="text-[10px] uppercase leading-[1.2] text-white">
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
          className="p-[6px_14px] text-[13px] leading-[1.4]"
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
