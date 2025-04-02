import { Event } from '@/types';
import { Avatar, Skeleton, Image, cn } from '@heroui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { MapPin } from '@phosphor-icons/react';

interface IEventCardProps {
  data: Event;
}

export function EventCard({ data }: IEventCardProps) {
  const { space, id, title, imageUrl, startTime, endTime, location, tagline } =
    data;

  const eventLocation = location || 'Not Available';
  const backupImage =
    'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png';

  return (
    <Link
      href={`/events/${id}`}
      className={cn(
        'w-full flex  items-start p-[10px] gap-[10px] rounded-[10px] cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.05)]',
        'mobile:gap-[10px]',
      )}
    >
      <Image
        src={imageUrl ?? backupImage}
        className={cn(
          'w-[140px] h-[140px] rounded-[10px] border border-[rgba(255,255,255,0.10)] object-cover',
          'mobile:w-[80px] mobile:h-[80px] ',
        )}
      />

      <div className="flex flex-col gap-[10px]">
        {/* space and date */}
        <div
          className={cn(
            'flex justify-start items-center gap-[10px] h-[29.5px]',
            'mobile:flex-col mobile:items-start mobile:gap-[6px] mobile:h-[auto]',
          )}
        >
          {/* space info */}
          <div className="flex items-center gap-[6px]">
            <span className="text-[10px] uppercase leading-[1.2] tracking-[0.2px] text-white opacity-60">
              By:
            </span>
            <Avatar
              src={space?.avatar ?? backupImage}
              classNames={{
                base: 'w-[18px] h-[18px]',
              }}
            />
            <span className="whitespace-nowrap text-[13px] leading-[1.4] tracking-[0.13px] opacity-60">
              {space?.name}
            </span>
          </div>
          {/* date */}
          <div className="whitespace-nowrap text-[14px] leading-[1.6] opacity-60">
            {dayjs(startTime).utc().format('MMMM D')} -{' '}
            {dayjs(endTime).utc().format('MMMM D')}
          </div>
        </div>

        {/* title and tagline */}
        <div className="flex flex-col gap-[6px]">
          <p className="h-[30px] text-[18px] font-bold leading-[30px]">
            {title}
          </p>
          <p className=" h-[22px] text-[13px] leading-[22px] tracking-[0.13px] opacity-60">
            {tagline}
          </p>
        </div>

        {/* location */}
        <div className="flex items-center gap-[6px] opacity-50">
          <MapPin size={16} weight="fill" format="Stroke" />
          <span className="text-[10px] uppercase leading-[1.2] tracking-[0.2px]">
            {eventLocation}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div
      className={cn(
        'w-full flex items-start p-[10px] gap-[10px] rounded-[10px] border-1 border-b-w-10',
        'mobile:gap-[10px]',
      )}
    >
      <Skeleton
        className={cn(
          'rounded-[10px] w-[140px] h-[140px]',
          'mobile:w-[80px] mobile:h-[80px]',
          'shrink-0',
        )}
      />

      <div className="flex w-full flex-col gap-[10px]">
        {/* space and date skeleton */}
        <div
          className={cn(
            'flex justify-start items-center gap-[10px] h-[29.5px]',
            'mobile:flex-col mobile:items-start mobile:gap-[6px] mobile:h-[auto]',
          )}
        >
          {/* space info skeleton */}
          <Skeleton className="rounded-[4px]">
            <div className="h-[18px] w-[120px]"></div>
          </Skeleton>

          {/* date skeleton */}
          <Skeleton className="rounded-[4px]">
            <div className="h-[18px] w-[150px] mobile:w-[120px]"></div>
          </Skeleton>
        </div>

        {/* title and tagline skeleton */}
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="rounded-[4px]">
            <div className="h-[30px] w-full"></div>
          </Skeleton>

          <Skeleton className="rounded-[4px]">
            <div className="h-[22px] w-full"></div>
          </Skeleton>
        </div>

        {/* location skeleton */}
        <Skeleton className="rounded-[4px]">
          <div className="h-[16px] w-[100px]"></div>
        </Skeleton>
      </div>
    </div>
  );
}
