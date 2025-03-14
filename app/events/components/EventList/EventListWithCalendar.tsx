import { Button, Calendar, Select } from '@/components/base';
import { fromAbsolute, getLocalTimeZone, today } from '@internationalized/date';
import { ArrowsCounterClockwiseIcon, MapIcon } from '@/components/icons';
import { DateValue } from '@heroui/react';
import React, { useMemo, useState } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { UPCOMING_EVENTS_QUERY } from '@/graphql/eventQueries';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import EventList from './EventList';
import { Ticket } from '@phosphor-icons/react';
import MobileNav from '@/app/events/components/MobileNav';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid'

const EventListWithCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('anywhere');
  const [timeFilter, setTimeFilter] = useState<string>('upcoming');

  const { composeClient } = useCeramicContext();

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

      const now = dayjs();
      const eventTime = dayjs(event.startTime);
      const timeMatches = 
        (timeFilter === 'upcoming' && eventTime.isAfter(now)) ||
        (timeFilter === 'past' && eventTime.isBefore(now));

      return dateMatches && locationMatches && timeMatches;
    });
  }, [upcomingEvents, selectedDate, selectedLocation, timeFilter]);

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
    <>
      {/* desktop navigation - hidden on mobile */}
      <div className="mobile:hidden flex items-center gap-[10px] bg-[rgba(34,34,34,0.90)] backdrop-blur-[10px] py-[10px] ">
        <Ticket size={24} weight="fill" format='Stroke' />
        <p className="text-[25px] tablet:text-[20px] font-bold text-white leading-[1.2] shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
          Events
        </p>
      </div>

      {/* mobile navigation - only visible on mobile */}
      <div className="hidden mobile:block">
        <MobileNav 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locations={locations}
          upcomingEvents={upcomingEvents || []}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />
      </div>

      <div className="flex justify-start items-start gap-[20px] mt-[10px]">
        
        <EventList events={filteredEvents} isLoading={isLoading} />

        <div className="mobile:hidden w-[320px] px-[20px] flex flex-col gap-[20px] ">
          <p className="py-[20px] px-[10px] text-[18px] font-[700] leading-[1.2] border-b border-b-w-10">
            Sort & Filter Events
          </p>
          <Calendar
            value={selectedDate}
            calendarWidth="320px"
            weekdayStyle="short"
            minValue={today(getLocalTimeZone()).add({ days: 1 })}
            isDateUnavailable={isDateUnavailable}
            bottomContent={
              <div className="p-[14px] w-full pt-0">
                <Button
                  border
                  variant="light"
                  fullWidth
                  className="text-[14px] h-[30px] opacity-80"
                  startContent={<ArrowsCounterClockwiseIcon />}
                  onPress={() => setSelectedDate(null)}
                >
                  Reset
                </Button>
              </div>
            }
            onChange={setSelectedDate}
          />

          <div className='w-full flex flex-col gap-[10px]'>
            <Select
              options={[
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'past', label: 'Past' }
              ]}
              defaultSelectedKey="upcoming"
              placeholder="Select time filter"
              startContent={<AdjustmentsHorizontalIcon className='size-[20px] text-white' />}
              onSelectionChange={(key) => {
                setTimeFilter(key);
              }}
            />

            <Select
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
