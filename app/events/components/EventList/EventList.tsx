import { Event } from '@/types';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Skeleton } from '@heroui/react';
import { EventCard, EventCardSkeleton } from './EventCard';
import { groupEventsByMonth } from '@/components/cards/EventCard';

export interface EventListProps {
  events: Event[];
  isLoading: boolean;
  hasAllButton?: boolean;
  top?: number;
  headerStyle?: React.CSSProperties;
}

function EventList({ events, isLoading }: EventListProps) {
  const eventsData = useMemo(() => {
    const groupedEvents = {
      upcoming: [] as Event[],
    };

    if (events && events.length > 0) {
      groupedEvents.upcoming = [...events];
    }

    const getData = (events: Event[]) => {
      const data = groupEventsByMonth(events);
      let keys = Object.keys(data).sort((a, b) => {
        const dateA = dayjs(a, 'MMMM YYYY');
        const dateB = dayjs(b, 'MMMM YYYY');
        return dateA.isAfter(dateB) ? 1 : -1;
      });

      const invalidDateIndex = keys.findIndex((key) => key === 'Invalid Date');
      if (invalidDateIndex !== -1) {
        const invalidDate = keys.splice(invalidDateIndex, 1)[0];
        keys.push(invalidDate);
      }

      const groupedEvents: { [key: string]: Event[] } = {};
      keys.forEach((key) => {
        const value = data[key];
        value.sort((a, b) => {
          const dateA = dayjs(a.startTime);
          const dateB = dayjs(b.startTime);
          return dateA.isAfter(dateB) ? 1 : -1;
        });
        groupedEvents[key] = value;
      });
      return groupedEvents;
    };

    const data = {
      upcoming: {} as { [key: string]: Event[] },
    };
    data.upcoming = getData(groupedEvents.upcoming);

    return data;
  }, [events]);

  return (
    <div className="flex-1 flex flex-col gap-[10px] pb-[20px] pc:pr-0">
      {isLoading ? (
        <div className="flex flex-col gap-[20px] w-full">
          <Skeleton className="w-full h-[40px] rounded-[40px]">
            <div className="h-[38px] w-full"></div>
          </Skeleton>
          {Array.from({ length: 5 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-[#ccc]">No data at the moment</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[10px]">
            {Object.entries(eventsData['upcoming']).map(
              ([month, eventsList]) => {
                return (
                  <div key={month} className="flex flex-col gap-[10px]">
                    <div className="py-[8px] px-[14px] text-[18px] leading-[1.2] font-[500] text-center rounded-[40px] border border-b-w-10 backdrop-blur-[10px] bg-[rgba(34,34,34,0.8)] sticky top-[60px] z-[1000]">
                      {month}
                    </div>
                    {(eventsList as Event[]).map((event: Event) => (
                      <EventCard key={event.id} data={event} />
                    ))}
                  </div>
                );
              },
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EventList;
