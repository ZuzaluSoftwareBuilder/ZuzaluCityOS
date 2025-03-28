'use client';

import clsx from 'clsx';
import { useMemo } from 'react';
import { Divider } from '@/components/base';

import AnnouncementsHeader from './components/Header';
import PostList from './components/PostList';

export default function Announcements() {
  const todayDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  return (
    <div>
      <AnnouncementsHeader />
      <div className="flex flex-col p-5 gap-5  mx-auto w-full pc:w-[800px]">
        <div className="flex flex-col pc:flex-row justify-between gap-2.5 pc:items-center">
          <div
            className={clsx([
              'font-bold leading-[140%]',
              'text-[20px] pc:text-[24px]',
            ])}
          >
            Announcements
          </div>
          <div className="flex text-[16px] tablet:leading-[120%] mobile:leading-[120%] tracking-[0.01em]">
            <span>Today&apos;s Date:&nbsp;</span>
            <span className="opacity-70">{todayDate}</span>
          </div>
        </div>
        <Divider orientation="horizontal" className="m-0" />
        <PostList />
      </div>
    </div>
  );
}
