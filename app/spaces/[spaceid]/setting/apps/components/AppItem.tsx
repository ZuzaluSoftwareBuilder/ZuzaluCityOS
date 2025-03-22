'use client';
import React, { memo, useMemo } from 'react';
import { Image, Skeleton } from '@heroui/react';
import clsx from 'clsx';

import { AppPreviewInfo } from '../page';

interface Props {
  data: AppPreviewInfo;
}

const AppItem = (props: Props) => {
  const { data } = props;
  const { appName, categories, developer, bannerUrl } = data;

  const firstThreeCategories = useMemo(
    () =>
      categories.slice(0, 3).map((category) => category.toLocaleUpperCase()),
    [categories],
  );
  const remainingCategoriesCount = useMemo(
    () => categories.slice(3).length,
    [categories],
  );

  return (
    <div
      className={clsx([
        'flex p-[10px]',
        'flex-row gap-5',
        'mobile:flex-col mobile:gap-[10px]',
      ])}
    >
      {/* information */}
      <div className={clsx(['flex', 'gap-5', 'mobile:gap-[10px]'])}>
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
                  'rounded px-1.5 py-0.5 bg-[#FFFFFF1A]', // container
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
              alt={developer.username || 'Developer'}
              src={developer.avatarUrl}
              className="rounded-full w-[16px] h-[16px]"
            />
            <span className="opacity-60">{developer.username ?? '-'}</span>
          </div>
        </div>
      </div>
      {/* install button */}
      {/* <div></div> */}
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
      <Skeleton className="rounded-md w-12 h-[18px]" />
    </div>
  </div>
));

export default AppItem;
