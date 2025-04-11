import { MapIcon } from '@/components/icons';
import { Event } from '@/types';
import { Avatar, Skeleton } from '@heroui/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
interface EventCardProps {
  data: Event;
}

interface Location {
  name: string;
  eventId: string;
}

export const EventCardMonthGroup: React.FC<
  React.PropsWithChildren<{
    bgColor?: 'transparent' | string;
  }>
> = ({ children, bgColor = 'rgba(34, 34, 34, 0.80)' }) => {
  return (
    <div
      className="flex w-full items-center justify-center rounded-[40px] border border-[rgba(255,255,255,0.10)] py-[8px] font-[700] text-[#ccc]"
      style={{
        backgroundColor: bgColor,
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  );
};

export function EventCardSkeleton() {
  return (
    <div className="flex gap-[14px] rounded-[10px] border-1 border-b-w-10 p-[10px] hover:bg-white/5">
      <Skeleton className="rounded-[10px]">
        <div className=" size-[140px]"></div>
      </Skeleton>
      <div className="flex w-[300px] flex-col gap-[10px]">
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
      className="flex cursor-pointer gap-[14px] rounded-[10px] p-[10px] transition-colors hover:bg-white/5"
      onClick={handleNavigation}
    >
      <Avatar
        src={
          imageUrl ??
          'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
        }
        classNames={{
          base: 'w-[140px] h-[140px]  rounded-[10px] border-1 border-b-w-10 mobile:w-[80px] mobile:h-[80px] shrink-0',
        }}
      />
      <div className="flex flex-col gap-[10px]">
        <div className="flex h-[30px] items-center gap-[10px] mobile:h-auto mobile:flex-col mobile:items-start mobile:gap-[6px]">
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
          <span className="whitespace-nowrap text-[16px] leading-[1.6] opacity-60 mobile:text-[14px]">
            {dayjs(startTime).utc().format('MMMM D')} -{' '}
            {dayjs(endTime).utc().format('MMMM D')}
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          <p className="text-[18px] font-bold leading-[1.2]">{title}</p>
          <p className="text-[14px] leading-[1.4] opacity-60">{title}</p>
        </div>
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
