'use client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { InstalledApp } from '@/types';
import { useCallback, useMemo } from 'react';
import { House, Ticket, CalendarDots, Megaphone } from '@phosphor-icons/react';
import TabItem from './tabItem';
import SidebarHeader from '@/app/spaces/[spaceid]/components/sidebar/spaceSubSidebar/sidebarHeader';
import { TableIcon } from '@/components/icons';
import { cn, Image, Skeleton } from '@heroui/react';
import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { useSpaceData } from '../../context/spaceData';

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
  const spaceId = params.spaceid.toString();
  const appName = params.appName?.toString();
  const appId = query.get('id');
  console.log(appId, appName);

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

  return (
    <div
      className={cn(
        'w-[260px] h-[calc(100vh-50px)]  border-r border-[rgba(255,255,255,0.1)] flex flex-col relative',
        needBlur ? 'bg-transparent' : 'bg-[#222222]',
      )}
    >
      <SidebarHeader
        isAdmin={isOwner || isAdmin}
        isLoading={isSpaceDataLoading}
        space={spaceData}
        onCloseDrawer={onCloseDrawer}
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
          label="Announcements"
          icon={<Megaphone />}
          href={`/spaces/${spaceId}/announcements`}
          isActive={isRouteActive('announcements')}
          height={36}
          onClick={onCloseDrawer}
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

      <div className="flex-1 pt-5 px-2.5 overflow-y-auto">
        <div className="h-[20px] flex items-center">
          <span className="h-[14px] text-[12px] leading-[14px] text-white px-2.5">
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
    </div>
  );
};

export default SpaceSubSidebar;
