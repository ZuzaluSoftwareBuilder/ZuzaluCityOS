import { Event } from '@/types';
import { DateValue } from '@heroui/react';
import { fromAbsolute, getLocalTimeZone, today } from '@internationalized/date';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { useMemo } from 'react';
import { ITimeEnum } from './EventListWithCalendar';

dayjs.extend(minMax);

export function useCalendarConstraints(timeFilter: ITimeEnum, events: Event[]) {
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
      case ITimeEnum.OnGoing: {
        if (events.length === 0) {
          return {
            minValue: today(getLocalTimeZone()),
            maxValue: today(getLocalTimeZone()),
          };
        }

        const startTimes = events.map((event) => dayjs(event.startTime));
        const endTimes = events.map((event) => dayjs(event.endTime));

        const earliestStart = (dayjs.min(startTimes) || startTimes[0])
          .subtract(1, 'day')
          .startOf('day');
        const latestEnd = (dayjs.max(endTimes) || endTimes[0]).endOf('day');

        return {
          minValue: fromAbsolute(
            earliestStart.unix() * 1000,
            getLocalTimeZone(),
          ),
          maxValue: fromAbsolute(latestEnd.unix() * 1000, getLocalTimeZone()),
        };
      }
      default:
        return {
          minValue: today(getLocalTimeZone()).add({ days: 1 }),
          maxValue: undefined,
        };
    }
  }, [timeFilter, events]);
}

export function useEventsByTimeFilter(
  timeFilter: ITimeEnum,
  upcomingEvents: Event[] = [],
  pastEvents: Event[] = [],
  ongoingEvents: Event[] = [],
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
  calendarConstraints: { minValue?: DateValue; maxValue?: DateValue },
) {
  return (date: DateValue) => {
    if (calendarConstraints.minValue && date < calendarConstraints.minValue) {
      return true;
    }
    if (calendarConstraints.maxValue && date > calendarConstraints.maxValue) {
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
