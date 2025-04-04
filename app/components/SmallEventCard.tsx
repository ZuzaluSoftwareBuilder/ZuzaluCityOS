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
    <div className="flex gap-[14px] rounded-[10px] border-1 border-b-w-10 p-[10px] hover:bg-white/5">
      <Skeleton className="size-[100px] rounded-[10px] mobile:size-[60px]">
        <div className=""></div>
      </Skeleton>
      <div className="flex w-[250px] flex-col gap-[10px]">
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
      className="flex cursor-pointer gap-[14px] rounded-[10px] border-1 border-b-w-10 p-[10px] transition-colors hover:bg-white/5"
      onClick={handleNavigation}
    >
      <Avatar
        src={
          imageUrl ??
          'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
        }
        classNames={{
          base: 'w-[100px] h-[100px]  rounded-[10px] border-1 border-b-w-10 mobile:w-[60px] mobile:h-[60px]',
        }}
      />
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-[10px] mobile:gap-[5px]">
          <div className="flex items-center gap-[6px]">
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
            <span className="whitespace-nowrap text-[13px] leading-[1.4] opacity-60">
              {space?.name}
            </span>
          </div>
          <span className="whitespace-nowrap text-[14px] leading-[1.6] opacity-60">
            {dayjs(startTime).utc().format('MMM D')} -{' '}
            {dayjs(endTime).utc().format('MMM D')}
          </span>
        </div>
        <p className="truncate text-[20px] font-bold leading-[1.2]">{title}</p>
        <div className="flex items-center gap-[6px] opacity-50">
          <MapIcon size={4} />
          <span className="text-[10px] uppercase leading-[1.2]">
            {eventLocation}
          </span>
        </div>
      </div>
    </div>
  );
}
