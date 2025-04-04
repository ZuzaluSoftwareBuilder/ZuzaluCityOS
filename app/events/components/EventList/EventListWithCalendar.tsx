import CalendarSelect from './CalendarSelect';
import { MapIcon } from '@/components/icons';
import { DateValue } from '@heroui/react';
import React, { FC, useMemo, useState } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  UPCOMING_EVENTS_QUERY,
  PAST_EVENTS_QUERY,
  ONGOING_EVENTS_QUERY,
} from '@/graphql/eventQueries';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import EventList from './EventList';
import { Ticket } from '@phosphor-icons/react';
import MobileNav from '@/app/events/components/EventList/MobileNav';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';
import {
  useCalendarConstraints,
  useEventsByTimeFilter,
  useDateAvailability,
} from './EventCalendarHooks';
import EventCalendar from './EventCalendar';

export enum ITimeEnum {
  UpComing = 'upcoming',
  Past = 'past',
  OnGoing = 'onGoing',
}

export const TimeFilterOptions = [
  { key: ITimeEnum.UpComing, label: 'Upcoming' },
  { key: ITimeEnum.Past, label: 'Past' },
  { key: ITimeEnum.OnGoing, label: 'On Going' },
];

export interface IEventListWithCalendarProps {
  searchVal?: string;
}

const EventListWithCalendar: FC<IEventListWithCalendarProps> = ({
  searchVal,
}) => {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('anywhere');
  const [timeFilter, setTimeFilter] = useState<ITimeEnum>(ITimeEnum.UpComing);

  const { composeClient } = useCeramicContext();

  const fetchEvents = async (
    query: any,
    params: Record<string, string>,
    eventType: string,
  ): Promise<Event[]> => {
    try {
      const response: any = await composeClient.executeQuery(query, params);

      if (response?.data?.zucityEventIndex) {
        const events = response.data.zucityEventIndex.edges.map(
          (edge: any) => ({
            ...edge.node,
            source: 'ceramic',
          }),
        ) as Event[];
        return await addLocationsToEvents(events);
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${eventType} events:`, error);
      return [];
    }
  };

  const { data: upcomingEvents, isLoading: isUpcomingLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    enabled: timeFilter === ITimeEnum.UpComing,
    queryFn: async () => {
      const tomorrow = dayjs().add(1, 'day');
      const tomorrowStart = tomorrow.format('YYYY-MM-DD') + 'T00:00:00Z';

      return fetchEvents(
        UPCOMING_EVENTS_QUERY,
        { startTime: tomorrowStart },
        'upcoming',
      );
    },
  });

  const { data: pastEvents, isLoading: isPastLoading } = useQuery({
    queryKey: ['pastEvents'],
    enabled: timeFilter === ITimeEnum.Past,
    queryFn: async () => {
      const now = dayjs();
      const nowFormatted =
        now.format('YYYY-MM-DD') + 'T' + now.format('HH:mm:ss') + 'Z';

      return fetchEvents(PAST_EVENTS_QUERY, { endTime: nowFormatted }, 'past');
    },
  });

  const { data: ongoingEvents, isLoading: isOngoingLoading } = useQuery({
    queryKey: ['ongoingEvents'],
    enabled: timeFilter === ITimeEnum.OnGoing,
    queryFn: async () => {
      const today = dayjs();
      const todayStart = today.format('YYYY-MM-DD') + 'T00:00:00Z';

      return fetchEvents(
        ONGOING_EVENTS_QUERY,
        { referenceTime: todayStart },
        'ongoing',
      );
    },
  });

  const addLocationsToEvents = async (events: Event[]) => {
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
  };

  const currentEvents = useEventsByTimeFilter(
    timeFilter,
    upcomingEvents || [],
    pastEvents || [],
    ongoingEvents || [],
  );

  const isLoading = useMemo(() => {
    switch (timeFilter) {
      case ITimeEnum.UpComing:
        return isUpcomingLoading;
      case ITimeEnum.Past:
        return isPastLoading;
      case ITimeEnum.OnGoing:
        return isOngoingLoading;
      default:
        return isUpcomingLoading;
    }
  }, [timeFilter, isUpcomingLoading, isPastLoading, isOngoingLoading]);

  const locations = useMemo(() => {
    if (!currentEvents || currentEvents.length === 0)
      return [{ key: 'anywhere', label: 'Anywhere' }];

    const locationSet = new Set<string>();
    currentEvents.forEach((event) => {
      if (event.location) {
        locationSet.add(event.location);
      }
    });

    const locationOptions = Array.from(locationSet).map((location) => ({
      key: location.toLowerCase().replace(/\s+/g, '-'),
      label: location.toUpperCase(),
    }));

    return [{ key: 'anywhere', label: 'Anywhere' }, ...locationOptions];
  }, [currentEvents]);

  const filteredEvents = useMemo(() => {
    if (!currentEvents) return [];

    let events: Event[] = currentEvents;

    if (searchVal) {
      events = events.filter((event) =>
        event.title.toLowerCase().includes(searchVal.toLowerCase()),
      );
    }

    return events.filter((event: Event) => {
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
  }, [currentEvents, searchVal, selectedDate, selectedLocation]);

  const calendarDateConstraints = useCalendarConstraints(
    timeFilter,
    currentEvents,
  );

  const isDateUnavailable = useDateAvailability(
    currentEvents,
    calendarDateConstraints,
  );

  return (
    <>
      {/* pc/tablet navigation */}
      <div className="flex items-center gap-[10px] bg-[rgba(34,34,34,0.90)] py-[10px] backdrop-blur-[10px] tablet:hidden mobile:hidden ">
        <Ticket size={24} weight="fill" format="Stroke" />
        <p className="text-[25px] font-bold leading-[1.2] text-white shadow-[0px_5px_10px_rgba(0,0,0,0.15)] tablet:text-[20px]">
          Events
        </p>
      </div>

      {/* mobile navigation */}
      <MobileNav
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locations={locations}
        upcomingEvents={upcomingEvents || []}
        pastEvents={pastEvents || []}
        ongoingEvents={ongoingEvents || []}
        timeFilter={timeFilter}
        setTimeFilter={(key) => {
          setTimeFilter(key as ITimeEnum);
          setSelectedDate(null);
        }}
      />

      <div className="mt-[10px] flex items-start justify-start gap-[20px]">
        <EventList events={filteredEvents} isLoading={isLoading} />

        <div className="flex w-[320px] flex-col gap-[20px] px-[20px] tablet:hidden mobile:hidden ">
          <p className="border-b border-b-w-10 px-[10px] py-[20px] text-[18px] font-[700] leading-[1.2]">
            Sort & Filter Events
          </p>

          <EventCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            onReset={() => setSelectedDate(null)}
            minValue={calendarDateConstraints.minValue}
            maxValue={calendarDateConstraints.maxValue}
            isDateUnavailable={isDateUnavailable}
          />

          <div className="flex w-full flex-col gap-[10px]">
            <CalendarSelect
              options={TimeFilterOptions}
              defaultSelectedKey={ITimeEnum.UpComing}
              placeholder="Select time filter"
              startContent={
                <AdjustmentsHorizontalIcon className="size-[20px] text-white" />
              }
              onSelectionChange={(key) => {
                setTimeFilter(key as ITimeEnum);
                setSelectedDate(null);
              }}
            />

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
    </>
  );
};

export default EventListWithCalendar;
