'use client';
import React, { memo, useMemo, useState } from 'react';
import { Image, Skeleton } from '@heroui/react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';

import { Dapp } from '@/types';
import { Button } from '@/components/base';
import { installDApp, InstallDAppParams } from '@/services/space/apps';
import { InstallIcon } from '@/components/icons';

import { useDAppDetailDrawer } from './DAppDetailDrawer';
import { useInstalledAppsData } from './InstalledAppsData';
import { isNativeDApp, NativeDApp } from '../constants';

interface Props {
  data: Dapp | NativeDApp;
}

const AppItem = (props: Props) => {
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const { data } = props;
  const idOrNativeAppName = useMemo(
    () => (isNativeDApp(data) ? data.appIdentifier : data.id),
    [data],
  );
  const isComingSoon = useMemo(
    () => isNativeDApp(data) && data.isComingSoon,
    [data],
  );
  const { appName, categories: _categories = '', profile, bannerUrl } = data;

  // categories pre processing
  const categories = useMemo(() => _categories.split(','), [_categories]);
  const firstThreeCategories = useMemo(
    () =>
      categories
        .slice(0, 3)
        .map((category) => category.trim().toLocaleUpperCase())
        .filter(Boolean),
    [categories],
  );
  const remainingCategoriesCount = useMemo(
    () => categories.slice(3).length,
    [categories],
  );

  // view detail logic
  const { open } = useDAppDetailDrawer();

  // install button logic
  const [loading, setLoading] = useState(false);
  const {
    loading: installedDataFetching,
    isInstalled,
    addInstalledApp,
  } = useInstalledAppsData();

  const handleInstall = () => {
    if (!data) return;
    setLoading(true);
    const params: InstallDAppParams = isNativeDApp(data)
      ? { spaceId, nativeAppName: data.appIdentifier }
      : { spaceId, appId: data.id };
    installDApp(params)
      .then((res) => {
        if (res.data.status === 'success') {
          addInstalledApp(idOrNativeAppName);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className={clsx([
        'flex p-[10px] w-full',
        'flex-row gap-5',
        'mobile:flex-col mobile:gap-[10px]',
      ])}
    >
      {/* information */}
      <div
        className={clsx([
          'flex flex-1',
          !isComingSoon && 'cursor-pointer',
          'gap-5',
          'mobile:gap-[10px]',
        ])}
        onClick={() => !isComingSoon && open(data)}
      >
        {/* banner */}
        <div
          className={clsx([
            'rounded-[10px]',
            'w-[60px] h-[60px]',
            'mobile:w-[40px] mobile:h-[40px]',
          ])}
        >
          <Image
            alt={appName}
            src={bannerUrl}
            className={clsx([
              'rounded-[10px]',
              'w-[60px] h-[60px]',
              'mobile:w-[40px] mobile:h-[40px]',
            ])}
          />
        </div>
        {/* app preview information */}
        <div
          className={clsx(['flex flex-col', 'gap-[10px]', 'mobile:gap-[6px]'])}
        >
          {/* name */}
          <div className="text-base font-bold leading-[120%]">{appName}</div>
          {/* categories */}
          <div
            className={clsx([
              'flex items-center gap-[5px]',
              'text-[10px] leading-[120%] tracking-wide font-normal',
            ])}
          >
            {/* TODO: empty maybe? */}
            {firstThreeCategories.map((category) => (
              <div
                key={category}
                className={clsx([
                  'rounded px-1.5 py-0.5 bg-[rgba(255,255,255,0.05)]', // container
                ])}
              >
                {category}
              </div>
            ))}
            {remainingCategoriesCount > 0 && (
              <span>+{remainingCategoriesCount}</span>
            )}
          </div>
          {/* developer */}
          <div
            className={clsx([
              'flex items-center gap-[5px]', // container
              'font-inter text-[13px] font-normal leading-[140%] tracking-[0.01em] align-middle tabular-nums lining-num', // text
            ])}
          >
            <span className="opacity-50">DEVELOPER:</span>
            <Image
              alt={profile.username || 'Developer'}
              src={profile.avatar}
              className="rounded-full w-[16px] h-[16px]"
            />
            <span className="opacity-60">{profile.username ?? '-'}</span>
          </div>
        </div>
      </div>
      {/* install button */}
      {isComingSoon ? (
        <Button size="sm" color="functional">
          Coming Soon
        </Button>
      ) : (
        <Button
          size="sm"
          color="functional"
          startContent={<InstallIcon />}
          onClick={handleInstall}
          disabled={isInstalled(idOrNativeAppName)}
          isLoading={loading || installedDataFetching}
        >
          {isInstalled(idOrNativeAppName) ? 'Installed' : 'Install'}
        </Button>
      )}
    </div>
  );
};

AppItem.Skeleton = memo(() => (
  <div className={clsx(['flex p-[10px]', 'gap-5', 'mobile:gap-[10px]'])}>
    <Skeleton
      className={clsx([
        'rounded-[10px] w-[60px] h-[60px]',
        'mobile:w-[40px] mobile:h-[40px]',
      ])}
    />
    <div className={clsx(['flex flex-col', 'gap-[10px]', 'mobile:gap-[6px]'])}>
      <Skeleton className="rounded-md w-10 h-5" />
      <Skeleton className="rounded-md w-16 h-4" />
      <Skeleton className="rounded-md w-32 h-[18px]" />
    </div>
  </div>
));

export default AppItem;
