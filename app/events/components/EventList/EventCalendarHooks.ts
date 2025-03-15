import { useMemo } from 'react';
import { DateValue } from '@heroui/react';
import { fromAbsolute, getLocalTimeZone, today } from '@internationalized/date';
import dayjs from 'dayjs';
import { Event } from '@/types';
import { ITimeEnum } from './EventListWithCalendar';

export function useCalendarConstraints(timeFilter: ITimeEnum) {
  return useMemo(() => {
    switch (timeFilter) {
      case ITimeEnum.UpComing:
        return {
          minValue: today(getLocalTimeZone()).add({ days: 1 }),
          maxValue: undefined,
        };
      case ITimeEnum.Past:
        return {
          minValue: undefined,
          maxValue: today(getLocalTimeZone()),
        };
      case ITimeEnum.OnGoing:
        return {
          minValue: undefined,
          maxValue: undefined,
        };
      default:
        return {
          minValue: today(getLocalTimeZone()).add({ days: 1 }),
          maxValue: undefined,
        };
    }
  }, [timeFilter]);
}

export function useEventsByTimeFilter(
  timeFilter: ITimeEnum,
  upcomingEvents: Event[] = [],
  pastEvents: Event[] = [],
  ongoingEvents: Event[] = []
) {
  return useMemo(() => {
    switch (timeFilter) {
      case ITimeEnum.UpComing:
        return upcomingEvents;
      case ITimeEnum.Past:
        return pastEvents;
      case ITimeEnum.OnGoing:
        return ongoingEvents;
      default:
        return upcomingEvents;
    }
  }, [timeFilter, upcomingEvents, pastEvents, ongoingEvents]);
}

export function useDateAvailability(
  events: Event[],
  calendarConstraints: { minValue?: DateValue; maxValue?: DateValue }
) {
  return (date: DateValue) => {
    if (
      calendarConstraints.minValue &&
      date < calendarConstraints.minValue
    ) {
      return true;
    }
    if (
      calendarConstraints.maxValue &&
      date > calendarConstraints.maxValue
    ) {
      return true;
    }

    return (
      (events ?? []).findIndex((item) => {
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
} 