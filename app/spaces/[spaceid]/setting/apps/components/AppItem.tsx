'use client';
import React, { memo, useCallback, useMemo } from 'react';
import { Image, Skeleton } from '@heroui/react';
import clsx from 'clsx';

import { Dapp } from '@/types';
import { Button } from '@/components/base';
import { InstallIcon } from '@/components/icons';

import { useDAppDetailDrawer } from './DAppDetailDrawer';

interface Props {
  data: Dapp;
}

const AppItem = (props: Props) => {
  const { data } = props;
  const {
    id,
    appName,
    categories: _categories = '',
    profile,
    bannerUrl,
  } = data;

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
  const handleInstall = useCallback(() => {}, [id]);

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
          'flex flex-1 cursor-pointer',
          'gap-5',
          'mobile:gap-[10px]',
        ])}
        onClick={() => open(data)}
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
      {/* TODO: install logic */}
      <Button
        size="sm"
        color="functional"
        startContent={<InstallIcon />}
        onClick={handleInstall}
      >
        Install
      </Button>
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
