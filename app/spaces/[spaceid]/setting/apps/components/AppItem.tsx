'use client';
import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Image, Skeleton } from '@heroui/react';
import { CaretLineDown, Trash } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';

import { Dapp } from '@/types';
import { Button } from '@/components/base';
import {
  installDApp,
  InstallDAppParams,
  uninstallDApp,
  UninstallDAppParams,
} from '@/services/space/apps';

import { useDAppDetailDrawer } from './DAppDetailDrawer';
import { useInstalledAppsData } from './InstalledAppsData';
import { isNativeDApp, NativeDApp } from '../constants';
import { USER_AVATAR_URL } from '@/constant';

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
  const { appName, categories: _categories = '', profile, appLogoUrl } = data;

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
  const {
    queryInstalledAppIndexId,
    loading: installedDataFetching,
    isInstalled,
    addInstalledApp,
    removeInstalledApp,
  } = useInstalledAppsData();

  const currentIsInstalled = useMemo(() => {
    return idOrNativeAppName && isInstalled(idOrNativeAppName);
  }, [isInstalled, idOrNativeAppName]);

  const { mutate: installMutation, isPending: isInstalling } = useMutation({
    mutationFn: (params: InstallDAppParams) => installDApp(params),
    onSuccess: (response) => {
      if (response.data.status === 'success' && idOrNativeAppName) {
        addInstalledApp({
          installedAppIndexId: response.data.data.installedAppIndexId,
          installedAppIdOrNativeAppName: idOrNativeAppName,
        });
      }
    },
  });

  const { mutate: uninstallMutation, isPending: isUninstalling } = useMutation({
    mutationFn: (params: UninstallDAppParams) => uninstallDApp(params),
    onSuccess: (response) => {
      if (response.data.status === 'success' && idOrNativeAppName) {
        removeInstalledApp(idOrNativeAppName);
      }
    },
  });

  const handleInstall = useCallback(() => {
    if (!data) return;
    const params: InstallDAppParams = isNativeDApp(data)
      ? { spaceId, nativeAppName: data.appIdentifier }
      : { spaceId, appId: data.id };
    installMutation(params);
  }, [data, spaceId, installMutation]);

  const handleUninstall = useCallback(() => {
    if (!data) return;
    const installedAppIndexId = queryInstalledAppIndexId(idOrNativeAppName);
    if (!installedAppIndexId) return;
    uninstallMutation({ spaceId, installedAppIndexId });
  }, [
    data,
    idOrNativeAppName,
    queryInstalledAppIndexId,
    spaceId,
    uninstallMutation,
  ]);

  const handleInstallOrUninstall = useCallback(() => {
    if (currentIsInstalled) {
      handleUninstall();
    } else {
      handleInstall();
    }
  }, [currentIsInstalled, handleInstall, handleUninstall]);

  // 合并加载状态
  const isLoading = isInstalling || isUninstalling || installedDataFetching;

  return (
    <div
      className={clsx([
        'flex w-full p-[10px]',
        'flex-row gap-5',
        'mobile:flex-col mobile:gap-[10px]',
      ])}
    >
      {/* information */}
      <div
        className={clsx([
          'flex flex-1',
          !isNativeDApp(data) && 'cursor-pointer',
          'gap-5',
          'mobile:gap-[10px]',
        ])}
        onClick={() => !isNativeDApp(data) && open(data)}
      >
        {/* banner */}
        <div
          className={clsx([
            'rounded-[10px]',
            'size-[60px]',
            'mobile:size-[40px]',
          ])}
        >
          <Image
            alt={appName}
            src={appLogoUrl}
            className={clsx([
              'rounded-[10px]',
              'size-[60px]',
              'mobile:size-[40px]',
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
              'text-[10px] font-normal leading-[120%] tracking-wide',
            ])}
          >
            {/* TODO: empty maybe? */}
            {firstThreeCategories.map((category) => (
              <div
                key={category}
                className={clsx([
                  'rounded bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5', // container
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
              'font-inter lining-num align-middle font-normal tabular-nums', // text
            ])}
          >
            <span className="text-[10px] leading-[120%] tracking-[0.02em] opacity-50">
              DEVELOPER:
            </span>
            <Image
              alt={profile.username || 'Developer'}
              src={profile.avatar ?? USER_AVATAR_URL}
              className="size-[16px] rounded-full"
            />
            <span className="text-[13px] leading-[140%] tracking-[0.01em] opacity-60">
              {profile.username ?? '-'}
            </span>
          </div>
        </div>
      </div>
      {/* install button */}
      {isComingSoon ? (
        <Button size="sm" isDisabled color="functional">
          Coming Soon
        </Button>
      ) : (
        <Button
          size="sm"
          color="functional"
          startContent={
            !isLoading ? (
              currentIsInstalled ? (
                <Trash />
              ) : (
                <CaretLineDown />
              )
            ) : null
          }
          onClick={handleInstallOrUninstall}
          isLoading={isLoading}
        >
          {currentIsInstalled ? 'Uninstall' : 'Install'}
        </Button>
      )}
    </div>
  );
};

AppItem.Skeleton = memo(function AppItemSkeleton() {
  return (
    <div className={clsx(['flex p-[10px]', 'gap-5', 'mobile:gap-[10px]'])}>
      <Skeleton
        className={clsx(['size-[60px] rounded-[10px]', 'mobile:size-[40px]'])}
      />
      <div
        className={clsx(['flex flex-col', 'gap-[10px]', 'mobile:gap-[6px]'])}
      >
        <Skeleton className="h-5 w-10 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-[18px] w-32 rounded-md" />
      </div>
    </div>
  );
});

export default AppItem;
