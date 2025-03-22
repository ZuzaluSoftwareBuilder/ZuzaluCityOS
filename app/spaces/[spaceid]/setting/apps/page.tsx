'use client';
import React, {
  useEffect,
  useRef,
  useCallback,
  Suspense,
  use,
  memo,
} from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Dapp } from '@/types';
import { executeQuery } from '@/utils/ceramic';
import { useScrollSection } from '@/hooks/useScrollSection';
import { GET_DAPP_LIST_QUERY } from '@/services/graphql/dApp';

import AppItem from './components/AppItem';

export interface AppPreviewInfo {
  id: string;
  appName: string;
  categories: string[];
  bannerUrl: string;
  developer: {
    username: string;
    avatarUrl: string;
  };
}

const APP_CATEGORY: Record<
  string,
  {
    hash: string;
    title: string;
    subTitle: string;
    getApps: () => Promise<AppPreviewInfo[]>;
  }
> = {
  NativeApps: {
    hash: 'native-apps',
    title: 'Native Apps',
    subTitle: 'Install apps integrated directly in Zuzalu City',
    getApps: async () => [], // TODO: static data
  },
  CommunityApps: {
    hash: 'community-apps',
    title: 'Community Apps',
    subTitle: 'Install apps built by the community',
    getApps: async () => {
      const response = await executeQuery(GET_DAPP_LIST_QUERY);

      if (
        response &&
        response.data &&
        'zucityDappInfoIndex' in response.data &&
        response.data.zucityDappInfoIndex?.edges
      ) {
        return response.data.zucityDappInfoIndex.edges.map((edge: any) => {
          const current: Dapp = edge.node;
          return {
            id: current.id,
            appName: current.appName,
            categories: current.categories.split(','),
            bannerUrl: current.bannerUrl,
            developer: {
              username: current.profile.username,
              avatarUrl: current.profile.avatar,
            },
          };
        });
      }
      return [];
    },
  },
};

const CATEGORIES = Object.values(APP_CATEGORY);

export default function ExploreAppsPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activeSection, setActiveSection, scrollToSection } = useScrollSection(
    {
      sections: CATEGORIES.map((item) => ({
        hash: item.hash,
        threshold: 100,
      })),
      onSectionChange: (hash) => {
        window.history.replaceState(null, '', `#${hash}`);
      },
      options: {
        scrollContainer: scrollContainerRef.current,
      },
    },
  );

  // Scroll to section when hash is present
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && CATEGORIES.some((item) => item.hash === hash)) {
      setActiveSection(hash);
      scrollToSection(hash);
    }
  }, [scrollToSection, setActiveSection]);

  // Handle nav click
  const handleNavClick = useCallback(
    (hash: string, e: React.MouseEvent) => {
      e.preventDefault();
      setActiveSection(hash);
      scrollToSection(hash);
      window.history.pushState(null, '', `#${hash}`);
    },
    [scrollToSection, setActiveSection],
  );

  return (
    <div
      className={clsx(
        'w-full h-full overflow-hidden',
        'p-[20px] pc:p-[20px_40px_0]',
        'relative',
      )}
    >
      <div
        ref={scrollContainerRef}
        className={clsx('w-full h-full overflow-auto flex gap-10')}
      >
        <div
          className={clsx(
            'hidden pc:flex', // show on pc
            'absolute top-[20px] left-[40px]',
            'h-full w-[150px] p-[20px] flex-col gap-5',
          )}
        >
          {CATEGORIES.map((item) => (
            <Link
              key={item.hash}
              href={`#${item.hash}`}
              onClick={(e) => handleNavClick(item.hash, e)}
              className={clsx(
                'text-[13px] font-medium leading-[140%]',
                activeSection !== item.hash && 'opacity-50',
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div
          className={clsx(
            'h-full w-full p-5  flex flex-col gap-5',
            'pc:w-[600px] xl:mx-auto', // pc
            'mobile:p-0', // mobile
          )}
        >
          {CATEGORIES.map((item, idx, arr) => {
            const { promise: appsPromise } = useQuery({
              queryKey: ['apps', item.hash],
              queryFn: item.getApps,
              experimental_prefetchInRender: true,
            });
            return (
              <React.Fragment key={item.hash}>
                <div id={item.hash} className="w-full flex flex-col gap-3 ">
                  <div className="leading-[140%] font-semibold text-[18px]">
                    {item.title}
                  </div>
                  <div className="leading-[140%] font-medium text-[13px] opacity-50">
                    {item.subTitle}
                  </div>
                  <div className="flex flex-col">
                    <Suspense fallback={<AppList.Skeleton />}>
                      <AppList appsPromise={appsPromise} />
                    </Suspense>
                  </div>
                </div>
                {/* line of division */}
                {idx < arr.length - 1 && (
                  <hr className="w-full border-[rgba(255,255,255,0.1)]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AppList({ appsPromise }: { appsPromise: Promise<AppPreviewInfo[]> }) {
  const apps = use(appsPromise);
  return (
    <>
      {apps.map((app) => (
        <AppItem key={app.id} data={app} />
      ))}
    </>
  );
}

AppList.Skeleton = memo(() =>
  Array.from({ length: 3 }).map((_, index) => <AppItem.Skeleton key={index} />),
);
