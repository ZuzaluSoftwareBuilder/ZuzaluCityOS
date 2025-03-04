import { supabase } from '@/utils/supabase/client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Event } from '@/types';
import { Avatar, Skeleton } from '@heroui/react';
import { MapIcon } from '@/components/icons';
import dayjs from 'dayjs';
interface EventCardProps {
  data: Event;
}

interface Location {
  name: string;
  eventId: string;
}

export function EventCardSkeleton() {
  return (
    <div className="border-1 border-b-w-10 rounded-[10px] flex gap-[14px] p-[10px] hover:bg-white/5">
      <Skeleton className="rounded-[10px]">
        <div className="w-[140px] h-[140px] flex-0"></div>
      </Skeleton>
      <div className="flex flex-col gap-[10px] w-[300px]">
        <Skeleton className="rounded-[4px]">
          <div className="h-[30px]">By:</div>
        </Skeleton>
        <Skeleton className="rounded-[4px]">
          <div className="h-[24px]"></div>
        </Skeleton>
        <Skeleton className="rounded-[4px]">
          <div className="h-[20px]"></div>
        </Skeleton>
        <Skeleton className="rounded-[4px]">
          <div className="h-[16px]"></div>
        </Skeleton>
      </div>
    </div>
  );
}

export function EventCard({ data }: EventCardProps) {
  const { space, id, title, imageUrl, startTime, endTime, location } = data;
  const router = useRouter();

  const handleNavigation = useCallback(() => {
    router.push(`/events/${id}`);
  }, [router, id]);

  const eventLocation = location || 'Not Available';
  return (
    <div
      key={id}
      className="p-[10px] rounded-[10px] hover:bg-white/5 transition-colors gap-[14px] flex cursor-pointer"
      onClick={handleNavigation}
    >
      <Avatar
        src={
          imageUrl ??
          'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
        }
        classNames={{
          base: 'w-[140px] h-[140px] flex-0 rounded-[10px] border-1 border-b-w-10',
        }}
      />
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[10px] items-center h-[30px]">
          <div className="flex gap-[6px] items-center">
            <span className="text-[10px] leading-[1.2] opacity-60">By:</span>
            <Avatar
              src={
                space?.avatar ??
                'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
              }
              classNames={{
                base: 'w-[18px] h-[18px]',
              }}
            />
            <span className="text-[13px] leading-[1.4] opacity-60 whitespace-nowrap">
              {space?.name}
            </span>
          </div>
          <span className="text-[16px] leading-[1.6] opacity-60 whitespace-nowrap">
            {dayjs(startTime).utc().format('MMMM D')} -{' '}
            {dayjs(endTime).utc().format('MMMM D')}
          </span>
        </div>
        <p className="text-[20px] font-bold leading-[1.2]">{title}</p>
        <p className="text-[14px] leading-[1.4] opacity-60">{title}</p>
        <div className="flex gap-[6px] items-center opacity-50">
          <MapIcon size={4} />
          <span className="text-[10px] leading-[1.2] uppercase">
            {eventLocation}
          </span>
        </div>
      </div>
    </div>
  );
}
