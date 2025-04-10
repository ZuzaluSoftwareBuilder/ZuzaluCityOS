'use client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { InstalledApp } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  House,
  Ticket,
  CalendarDots,
  Megaphone,
  Gear,
} from '@phosphor-icons/react';
import TabItem from './tabItem';
import SidebarHeader from '@/app/spaces/[spaceid]/components/sidebar/spaceSubSidebar/sidebarHeader';
import { TableIcon } from '@/components/icons';
import { cn, Image, Skeleton } from '@heroui/react';
import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { useSpaceData } from '../../context/spaceData';
import {
  getSpaceLastViewTime,
  subscribeSpaceLastViewTime,
} from '../../../announcements/lastViewTime';
import { dayjs } from '@/utils/dayjs';
import Link from 'next/link';

interface MainSubSidebarProps {
  needBlur?: boolean;
  onCloseDrawer?: () => void;
}

const SpaceSubSidebar = ({
  onCloseDrawer,
  needBlur = false,
}: MainSubSidebarProps) => {
  const pathname = usePathname();
  const params = useParams();
  const query = useSearchParams();
  const spaceId = params.spaceid?.toString() ?? '';
  const appName = params.appName?.toString();
  const appId = query.get('id');

  const { isOwner, isAdmin } = useSpacePermissions();

  const { spaceData, isSpaceDataLoading } = useSpaceData();

  const installedAppsData = useMemo(() => {
    return spaceData?.installedApps?.edges.map(
      (edge) => edge.node,
    ) as InstalledApp[];
  }, [spaceData]);

  const isRouteActive = useCallback(
    (route: string) => {
      if (pathname === `/spaces/${spaceId}/${route}`) {
        return true;
      }

      if (route === 'home' && pathname === `/spaces/${spaceId}`) {
        return true;
      }

      if (appName && appId === route) {
        return true;
      }

      if (pathname.startsWith(`/spaces/${spaceId}/${route}/`)) {
        return true;
      }

      return false;
    },
    [pathname, spaceId, appName, appId],
  );

  const installedApps = useMemo(() => {
    const hasCalendar = installedAppsData?.some(
      (app) => app.nativeAppName === 'calendar',
    );

    const hasZuland = installedAppsData?.some(
      (app) => app.nativeAppName === 'zuland',
    );

    installedAppsData
      ?.filter((app) => app.nativeAppName)
      .map((app) => (
        <TabItem
          key={app.installedAppId}
          label={app.installedApp?.appName ?? ''}
          icon={<TableIcon size={20} />}
          href={`/spaces/${spaceId}/app?id=${app.installedAppId}`}
          isActive={isRouteActive('app')}
          onClick={onCloseDrawer}
        />
      ));

    return [
      hasCalendar ? (
        <TabItem
          label="Calendar"
          href={`/spaces/${spaceId}/calendar`}
          icon={<CalendarDots />}
          isActive={isRouteActive('calendar')}
          onClick={onCloseDrawer}
        />
      ) : null,
      hasZuland ? (
        <TabItem
          label="Zuland"
          href={`/spaces/${spaceId}/zuland`}
          icon={<CalendarDots />}
          isActive={isRouteActive('zuland')}
          onClick={onCloseDrawer}
        />
      ) : null,
      ...(installedAppsData
        ?.filter((app) => !app.nativeAppName)
        .map((app) => (
          <TabItem
            key={app.installedAppId}
            label={app.installedApp?.appName ?? ''}
            icon={
              <Image
                src={app.installedApp?.appLogoUrl}
                alt={app.installedApp?.appName ?? ''}
                width={20}
                height={20}
                className="rounded-[6px]"
              />
            }
            href={`/spaces/${spaceId}/${app.installedApp?.appName.toLowerCase()}?id=${app.installedAppId}`}
            isActive={isRouteActive(app.installedAppId ?? '')}
            onClick={onCloseDrawer}
          />
        )) ?? []),
    ].filter(Boolean);
  }, [installedAppsData, isRouteActive, onCloseDrawer, spaceId]);

  // uot viewed announcements
  const [unViewedAnnouncementsCount, setUnViewedAnnouncementsCount] =
    useState<number>(0);
  useEffect(() => {
    const lastViewTime = getSpaceLastViewTime(spaceId as string);
    if (lastViewTime) {
      setUnViewedAnnouncementsCount(
        spaceData?.announcements?.edges.filter((edge) =>
          dayjs(edge.node.createdAt).isAfter(dayjs(lastViewTime)),
        ).length ?? 0,
      );
    }
    return subscribeSpaceLastViewTime(spaceId as string, (lastViewTime) => {
      setUnViewedAnnouncementsCount(
        spaceData?.announcements?.edges.filter((edge) =>
          dayjs(edge.node.createdAt).isAfter(dayjs(lastViewTime)),
        ).length ?? 0,
      );
    });
  }, [spaceData, spaceId]);

  return (
    <div
      className={cn(
        'w-[260px] h-[calc(100vh-50px)] flex flex-col relative',
        needBlur ? 'bg-transparent' : 'bg-[#222222]',
      )}
    >
      <SidebarHeader
        isAdmin={isOwner || isAdmin}
        isLoading={isSpaceDataLoading}
        space={spaceData}
        onCloseDrawer={onCloseDrawer}
      />

      <div className="flex flex-col gap-[5px] border-y border-[rgba(255,255,255,0.1)] p-[10px]">
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
          label="Announcements"
          icon={<Megaphone />}
          href={`/spaces/${spaceId}/announcements`}
          isActive={isRouteActive('announcements')}
          height={36}
          onClick={onCloseDrawer}
          count={unViewedAnnouncementsCount}
        />
        {(isOwner || isAdmin) && (
          <TabItem
            label="Manage Events"
            icon={<TableIcon size={20} />}
            href={`/spaces/${spaceId}/adminevents`}
            isActive={isRouteActive('adminevents')}
            height={36}
            onClick={onCloseDrawer}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 pt-5">
        <div className="flex h-[20px] items-center">
          <span className="h-[14px] px-2.5 text-[12px] leading-[14px] text-white">
            Community Apps
          </span>
        </div>

        <div className="mt-[20px] flex flex-col gap-[5px]">
          {isSpaceDataLoading ? (
            <div className="flex flex-col gap-[20px]">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="mx-[10px] h-[20px] rounded-[6px]"
                />
              ))}
            </div>
          ) : (
            installedApps
          )}
        </div>
      </div>

      {(isOwner || isAdmin) && (
        <div className="fixed bottom-0 left-[61px] h-[90px] w-[260px] border-t border-[rgba(255,255,255,0.1)] px-2.5 pt-5">
          <div className="px-2.5 text-[12px] leading-[14px] text-white">
            ADMINS
          </div>
          <div className={'mt-2.5'}>
            <Link href={`/spaces/${spaceId}/setting`}>
              <TabItem
                label="Space Settings"
                icon={<Gear />}
                isActive={false}
                onClick={() => console.log('Space Settings', spaceId)}
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceSubSidebar;
