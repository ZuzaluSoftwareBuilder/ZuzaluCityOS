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
import get from 'lodash/get';
import { useQuery } from '@tanstack/react-query';

import { Dapp } from '@/types';
import { executeQuery } from '@/utils/ceramic';
import { useScrollSection } from '@/hooks/useScrollSection';
import { GET_DAPP_LIST_QUERY } from '@/services/graphql/dApp';

import AppItem from './components/AppItem';
import DAppDetailDrawer from './components/DAppDetailDrawer';
import InstalledAppsData from './components/InstalledAppsData';
import { NATIVE_APPS, NativeDApp } from './constants';

const APP_CATEGORY: Record<
  string,
  {
    hash: string;
    title: string;
    subTitle: string;
    getApps: () => Promise<Dapp[] | NativeDApp[]>;
  }
> = {
  NativeApps: {
    hash: 'native-apps',
    title: 'Native Apps',
    subTitle: 'Install apps integrated directly in Zuzalu City',
    getApps: async () => NATIVE_APPS,
  },
  CommunityApps: {
    hash: 'community-apps',
    title: 'Community Apps',
    subTitle: 'Install apps built by the community',
    getApps: async () => {
      const response = await executeQuery(GET_DAPP_LIST_QUERY, {
        filters: {
          where: {
            isInstallable: {
              equalTo: '1',
            },
          },
        },
      });

      if (
        response &&
        response.data &&
        'zucityDappInfoIndex' in response.data &&
        response.data.zucityDappInfoIndex?.edges
      ) {
        return response.data.zucityDappInfoIndex.edges.map((edge: any) => {
          const current: Dapp = edge.node;
          return current;
        });
      }
      return [];
    },
  },
};

const CATEGORIES = Object.values(APP_CATEGORY);

export default function ExploreAppsPage() {
  // ------------ scroll logic ------------
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
    <InstalledAppsData>
      <DAppDetailDrawer>
        <div
          className={clsx(
            'size-full overflow-hidden',
            'p-[20px] pc:p-[20px_40px_0]',
            'relative',
          )}
        >
          <div
            ref={scrollContainerRef}
            className={clsx('flex size-full gap-10 overflow-auto')}
          >
            <div
              className={clsx(
                'hidden pc:flex', // show on pc
                'absolute left-[40px] top-[20px]',
                'h-full w-[150px] flex-col gap-5 p-[20px]',
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
                'flex size-full flex-col  gap-5 p-5',
                'mx-auto pc:w-[600px]', // pc
                'mobile:p-0', // mobile
              )}
            >
              {CATEGORIES.map((item, idx, arr) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const { promise: appsPromise } = useQuery({
                  queryKey: ['apps', item.hash],
                  queryFn: item.getApps,
                  experimental_prefetchInRender: true,
                });
                return (
                  <React.Fragment key={item.hash}>
                    <div
                      id={item.hash}
                      className="flex w-full flex-col gap-2.5 "
                    >
                      <div className="text-[18px] font-semibold leading-[140%]">
                        {item.title}
                      </div>
                      <div className="text-[13px] font-medium leading-[140%] opacity-50">
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
      </DAppDetailDrawer>
    </InstalledAppsData>
  );
}

function AppList(props: { appsPromise: Promise<Dapp[] | NativeDApp[]> }) {
  const { appsPromise } = props;
  const apps = use(appsPromise);
  return (
    <>
      {apps.map((app) => (
        <AppItem key={get(app, 'id', get(app, 'appIdentifier'))} data={app} />
      ))}
    </>
  );
}

AppList.Skeleton = memo(function AppListSkeleton() {
  return Array.from({ length: 3 }).map((_, index) => (
    <AppItem.Skeleton key={index} />
  ));
});
