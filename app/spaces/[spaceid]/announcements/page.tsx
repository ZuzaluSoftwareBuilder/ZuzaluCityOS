'use client';

import clsx from 'clsx';
import AnnouncementsHeader from './components/Header';
import { useMemo, useState } from 'react';
import { Button, Divider } from '@/components/base';
import { InformationIcon, PlusCircleIcon, PlusIcon } from '@/components/icons';

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

  const [posts, setPosts] = useState([]);
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
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <span className="font-bold leading-[140%] text-[20px]">
                Posts
              </span>
              <InformationIcon size={5} />
            </div>
            <div>
              <Button
                color="secondary"
                size="sm"
                startContent={<PlusIcon size={4} />}
              >
                Add a Post
              </Button>
            </div>
          </div>
          <div className="text-[14px] leading-[120%] opacity-80">
            Announcement post live in the event view under a tab of the same
            name.
          </div>
          {posts.length === 0 && (
            <div className="flex flex-col items-center bg-[#2d2d2d] rounded-[8px] p-5 cursor-pointer">
              <PlusCircleIcon size={15} color="#6c6c6c" />
              <span className="text-normal font-bold leading-[180%] tracking-[0.01em]">
                No Posts
              </span>
              <span className="text-[14px] leading-[140%] tracking-[0.01em] opacity-50">
                Add a Post
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
