import { MapIcon } from '@/components/icons';
import { Event } from '@/types';
import { Avatar, Skeleton } from '@heroui/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface SmallEventCardProps {
  data: Event;
}

export function SmallEventCardSkeleton() {
  return (
    <div className="border-1 border-b-w-10 rounded-[10px] flex gap-[14px] p-[10px] hover:bg-white/5">
      <Skeleton className="rounded-[10px]">
        <div className="w-[6px] h-[6px] flex-0"></div>
      </Skeleton>
      <div className="flex flex-col gap-[10px] h-[100px] w-[250px]">
        <Skeleton className="rounded-[4px]">
          <div className="h-[22px]">By:</div>
        </Skeleton>
        <Skeleton className="rounded-[4px]">
          <div className="h-[24px]"></div>
        </Skeleton>
        <Skeleton className="rounded-[4px]">
          <div className="h-[16px]"></div>
        </Skeleton>
      </div>
    </div>
  );
}

export function SmallEventCard({ data }: SmallEventCardProps) {
  const { space, id, title, imageUrl, startTime, endTime, location } = data;
  const router = useRouter();

  const handleNavigation = useCallback(() => {
    router.push(`/events/${id}`);
  }, [router, id]);

  const eventLocation = location || 'Not Available';

  return (
    <div
      className="border-1 border-b-w-10 rounded-[10px] flex gap-[14px] p-[10px] hover:bg-white/5 transition-colors cursor-pointer"
      onClick={handleNavigation}
    >
      <Avatar
        src={
          imageUrl ??
          'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
        }
        classNames={{
          base: 'w-[60px] h-[60px] flex-0 rounded-[10px] border-1 border-b-w-10',
        }}
      />
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[10px] items-center">
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
          <span className="text-[14px] leading-[1.6] opacity-60 whitespace-nowrap">
            {dayjs(startTime).utc().format('MMM D')} -{' '}
            {dayjs(endTime).utc().format('MMM D')}
          </span>
        </div>
        <p className="text-[20px] font-bold leading-[1.2] truncate">{title}</p>
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
