import CalendarSelect from '@/app/events/components/EventList/CalendarSelect';
import { Button, Calendar } from '@/components/base';
import { EventCard } from '@/components/biz';
import {
  EventCardSkeleton,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import {
  ArrowCircleRightIcon,
  ArrowsCounterClockwiseIcon,
  MapIcon,
  TicketIcon,
} from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { UPCOMING_EVENTS_QUERY } from '@/graphql/eventQueries';
import { useMediaQuery } from '@/hooks';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import {
  Accordion,
  AccordionItem,
  DateValue,
  Select as HSelect,
  SelectItem,
  Skeleton,
} from '@heroui/react';
import { fromAbsolute, getLocalTimeZone, today } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import CommonHeader from './CommonHeader';
import { SmallEventCardSkeleton } from './SmallEventCard';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

interface EventListProps {
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
    <div className="flex flex-col gap-[10px] px-[20px] pb-[20px] pc:pr-0">
      {isLoading ? (
        <div className="flex w-full flex-col gap-[20px]">
          <Skeleton className="h-[40px] w-full rounded-[40px]">
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
          <div className="flex flex-col gap-[20px]">
            {Object.entries(eventsData['upcoming']).map(
              ([month, eventsList]) => {
                return (
                  <div key={month} className="flex flex-col gap-[20px]">
                    <div className="sticky top-[60px] z-[1000] rounded-[40px] border border-b-w-10 bg-[rgba(34,34,34,0.8)] px-[14px] py-[8px] text-center text-[18px] font-[500] leading-[1.2] backdrop-blur-[10px]">
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

export default function UpcomingEventList() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);

  const { composeClient } = useCeramicContext();
  const { isMobile } = useMediaQuery();

  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      try {
        const tomorrow = dayjs().add(1, 'day');
        const tomorrowStart = tomorrow.format('YYYY-MM-DD') + 'T00:00:00Z';

        const response: any = await composeClient.executeQuery(
          UPCOMING_EVENTS_QUERY,
          {
            startTime: tomorrowStart,
          },
        );

        if (response?.data?.zucityEventIndex) {
          const events = response.data.zucityEventIndex.edges.map(
            (edge: any) => ({
              ...edge.node,
              source: 'ceramic',
            }),
          ) as Event[];
          const eventIds = events.map((event) => event.id);
          const { data } = await supabase
            .from('locations')
            .select('*')
            .in('eventId', eventIds);
          data?.forEach((location: any) => {
            const event = events.find((event) => event.id === location.eventId);
            if (event) {
              event.location = location.name;
            }
          });
          return events;
        }
        return [];
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
      }
    },
  });

  const locations = useMemo(() => {
    if (!upcomingEvents || upcomingEvents.length === 0)
      return [{ key: 'anywhere', label: 'Anywhere' }];

    const locationSet = new Set<string>();
    upcomingEvents.forEach((event) => {
      if (event.location) {
        locationSet.add(event.location);
      }
    });

    const locationOptions = Array.from(locationSet).map((location) => ({
      key: location.toLowerCase().replace(/\s+/g, '-'),
      label: location.toUpperCase(),
    }));

    return [{ key: 'anywhere', label: 'Anywhere' }, ...locationOptions];
  }, [upcomingEvents]);

  const [selectedLocation, setSelectedLocation] = useState<string>('anywhere');

  const filteredEvents = useMemo(() => {
    if (!upcomingEvents) return [];

    return upcomingEvents.filter((event: Event) => {
      const dateMatches =
        !selectedDate ||
        (dayjs(event.startTime).date() === selectedDate.day &&
          dayjs(event.startTime).month() + 1 === selectedDate.month &&
          dayjs(event.startTime).year() === selectedDate.year);

      const locationMatches =
        selectedLocation === 'anywhere' ||
        (event.location &&
          event.location.toLowerCase().replace(/\s+/g, '-') ===
            selectedLocation);

      return dateMatches && locationMatches;
    });
  }, [upcomingEvents, selectedDate, selectedLocation]);

  let isDateUnavailable = (date: any) => {
    return (
      (upcomingEvents ?? []).findIndex((item) => {
        const date1 = fromAbsolute(
          dayjs(item.startTime).unix() * 1000,
          getLocalTimeZone(),
        );
        return (
          date1.month === date.month &&
          date1.year === date.year &&
          date1.day === date.day
        );
      }) === -1
    );
  };

  return (
    <div className="flex flex-col gap-[10px] pb-[20px]">
      <CommonHeader
        title="Upcoming Events"
        icon={<TicketIcon size={isMobile ? 5 : 6} />}
        description=""
        rightContent={
          isMobile ? (
            <div className="flex w-full items-center justify-between">
              <Accordion fullWidth>
                <AccordionItem
                  key="1"
                  title={
                    <Button
                      endContent={<ArrowCircleRightIcon size={5} />}
                      onPress={() => router.push('/events')}
                      className="h-[34px] mobile:p-[4px] mobile:text-[14px]"
                    >
                      View All Events
                    </Button>
                  }
                  classNames={{
                    trigger: 'p-0',
                    base: 'mx-[-0.5rem]',
                    content: 'py-0 pt-[5px]',
                  }}
                >
                  <HSelect
                    defaultSelectedKeys={['anywhere']}
                    placeholder="Select location"
                    startContent={<MapIcon size={5} />}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setSelectedLocation(selectedKey);
                    }}
                    classNames={{
                      trigger: 'bg-[#4A4A4A]',
                    }}
                    popoverProps={{
                      offset: 10,
                      classNames: {
                        content:
                          'backdrop-blur-[12px] border-b-w-10 border-[2px] bg-[rgba(34,34,34,0.8)]',
                      },
                    }}
                  >
                    {locations.map((location) => (
                      <SelectItem key={location.key}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </HSelect>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <Button
              endContent={<ArrowCircleRightIcon size={5} />}
              onPress={() => router.push('/events')}
              className="h-[34px] mobile:p-[4px] mobile:text-[14px]"
            >
              View All Events
            </Button>
          )
        }
      />
      <div className="flex flex-row gap-[20px]">
        <div className="w-full flex-1">
          {isLoading ? (
            <div className="flex gap-[20px] overflow-auto px-[20px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <SmallEventCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <EventList events={filteredEvents} isLoading={isLoading} />
          )}
        </div>
        <div className="mr-[20px] flex w-[320px] flex-col gap-[20px] px-[20px] tablet:hidden mobile:hidden">
          <p className="border-b border-b-w-10 px-[10px] py-[20px] text-[18px] font-[700] leading-[1.2]">
            Sort & Filter Events
          </p>
          <Calendar
            value={selectedDate}
            calendarWidth="280px"
            weekdayStyle="short"
            minValue={today(getLocalTimeZone()).add({ days: 1 })}
            isDateUnavailable={isDateUnavailable}
            bottomContent={
              <div className="w-full p-[14px] pt-0">
                <Button
                  color="functional"
                  variant="light"
                  fullWidth
                  className="h-[30px] text-[14px] opacity-80"
                  startContent={<ArrowsCounterClockwiseIcon />}
                  onPress={() => setSelectedDate(null)}
                >
                  Reset
                </Button>
              </div>
            }
            onChange={setSelectedDate}
          />

          <div className="flex w-full flex-col gap-[10px]">
            <CalendarSelect
              options={locations}
              defaultSelectedKey="anywhere"
              placeholder="Select location"
              startContent={<MapIcon size={5} />}
              onSelectionChange={(key) => {
                setSelectedLocation(key);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
