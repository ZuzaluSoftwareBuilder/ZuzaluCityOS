import { SmallEventCardSkeleton } from '@/app/components/SmallEventCard';
import { Button, Calendar } from '@/components/base';
import { fromAbsolute, getLocalTimeZone, today } from '@internationalized/date';
import { ArrowsCounterClockwiseIcon, MapIcon } from '@/components/icons';
import { DateValue, Select, SelectItem } from '@heroui/react';
import React, { useMemo, useState } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { UPCOMING_EVENTS_QUERY } from '@/graphql/eventQueries';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import EventList from './EventList';
import { Ticket } from '@phosphor-icons/react';

const EventListWithCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('anywhere');

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
    <>
      <div className="flex items-center gap-[10px] bg-[rgba(34,34,34,0.90)] backdrop-blur-[10px] py-[10px] px-[20px]">
        <Ticket size={20} weight="fill" format="Stroke" />
        <p className="text-[25px] font-bold text-white leading-[30px] shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
          Events
        </p>
        <div className="pc:hidden tablet:hidden">

        </div>
      </div>

      <div className="flex justify-start items-start">
        <div className="flex-1">
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

        <div className="w-[360px] px-[20px] flex flex-col gap-[20px] mobile:hidden">
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
          <Select
            variant="bordered"
            className="max-w-xs"
            defaultSelectedKeys={['anywhere']}
            placeholder="Select location"
            startContent={<MapIcon size={5} />}
            classNames={{
              trigger: 'border-b-w-10',
            }}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setSelectedLocation(selectedKey);
            }}
          >
            {locations.map((location) => (
              <SelectItem key={location.key}>{location.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default EventListWithCalendar;
