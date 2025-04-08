import { Skeleton } from '@heroui/react';
import {
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import React, { Fragment } from 'react';
import {
  EventCard,
  EventCardSkeleton,
  EventCardMonthGroup,
} from '@/app/components/EventCard';
import { Event } from '@/types';

export interface ISpaceEventListProps {
  eventsData: Event[];
  isLoading: boolean;
}

const SpaceEventList = ({ isLoading, eventsData }: ISpaceEventListProps) => {
  return (
    <div className="p-[20px] mobile:p-[10px]">
      {isLoading ? (
        <div className="flex flex-col gap-[20px]">
          <Skeleton className="h-[27px] w-[100px] rounded-[8px]" />
          <EventCardMonthGroup>
            <Skeleton className="h-[24px] w-[60px] rounded-full" />
          </EventCardMonthGroup>
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      ) : eventsData.length > 0 ? (
        <div className="flex flex-col gap-[20px]">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="text-[18px] font-[700] text-[#919191]">
              Upcoming Events ({filterUpcomingEvents(eventsData).length})
            </div>
          </div>
          <div className="flex w-full flex-col gap-[20px]">
            {Object.entries(
              groupEventsByMonth(filterUpcomingEvents(eventsData)),
            ).map(([key, value], index) => {
              return (
                <Fragment key={key + index}>
                  <EventCardMonthGroup>{key}</EventCardMonthGroup>
                  {value.map((event) => {
                    return <EventCard key={event.id} data={event} />;
                  })}
                </Fragment>
              );
            })}
          </div>
          <div className="flex flex-col gap-[20px] p-[20px]"></div>
        </div>
      ) : null}
    </div>
  );
};

export default SpaceEventList;
