'use client';

import { Divider } from '@/components/base';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import AnnouncementsHeader from './components/Header';
import PostList from './components/PostList';
import { setSpaceLastViewTime } from './lastViewTime';

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

  const spaceId = useParams().spaceid;
  useEffect(() => {
    setSpaceLastViewTime(spaceId as string);
  }, [spaceId]);

  return (
    <div className="flex h-[calc(100vh-50px)] w-full flex-col overflow-hidden">
      <AnnouncementsHeader />
      <div className="w-full flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full flex-col gap-5 p-5 pc:w-[800px]">
          <div className="flex flex-col justify-between gap-2.5 pc:flex-row pc:items-center">
            <div
              className={clsx([
                'font-bold leading-[140%]',
                'text-[20px] pc:text-[24px]',
              ])}
            >
              Announcements
            </div>
            <div className="flex text-[16px] tracking-[0.01em] tablet:leading-[120%] mobile:leading-[120%]">
              <span>Today&apos;s Date:&nbsp;</span>
              <span className="opacity-70">{todayDate}</span>
            </div>
          </div>
          <Divider orientation="horizontal" className="m-0" />
          <PostList />
        </div>
      </div>
    </div>
  );
}
