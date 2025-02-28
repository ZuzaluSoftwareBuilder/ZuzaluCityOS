import { TicketIcon } from '@/components/icons';
import CommonHeader from './CommonHeader';
import { useRouter } from 'next/navigation';
import { ZuCalendar } from '@/components/core';
import dayjs, { Dayjs } from 'dayjs';
import SlotDates from '@/components/calendar/SlotDate';
import { useState, useMemo } from 'react';
import { Event } from '@/types';

interface UpcomingEventListProps {
  events: Event[];
}

export default function UpcomingEventList({ events }: UpcomingEventListProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [dateForCalendar, setDateForCalendar] = useState<Dayjs>(
    dayjs(new Date()).add(1, 'day'),
  );

  const futureEvents = useMemo(() => {
    const today = dayjs().startOf('day');
    return events.filter((event) => {
      return dayjs(event.startTime).isAfter(today);
    });
  }, [events]);

  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="Upcoming Events"
        icon={<TicketIcon />}
        description=""
        buttonText="View All Events"
        buttonOnPress={() => router.push('/events')}
      />
      <div className="flex gap-[20px]">
        <div className="flex-1">
          <div>123</div>
        </div>
        <div className="w-[360px] px-[20px] flex flex-col gap-[20px]">
          <p className="py-[20px] px-[10px] text-[18px] font-[700] leading-[1.2] border-b border-b-w-10">
            Sort & Filter Events
          </p>
          <ZuCalendar
            onChange={(val) => {
              setSelectedDate(val);
            }}
            minDate={dayjs(new Date()).add(1, 'day')}
            slots={{ day: SlotDates }}
            slotProps={{
              day: {
                highlightedDays: futureEvents
                  .filter((event) => {
                    return (
                      dayjs(event.startTime).month() ===
                        dateForCalendar.month() &&
                      dayjs(event.startTime).year() === dateForCalendar.year()
                    );
                  })
                  .filter((event) => {
                    if (selectedDate) {
                      return (
                        dayjs(event.startTime).date() !== selectedDate.date()
                      );
                    }
                    return true;
                  })

                  .map((event) => {
                    return dayjs(event.startTime).utc().date();
                  }),
              } as any,
            }}
            onMonthChange={(val) => setDateForCalendar(val)}
            onYearChange={(val) => setDateForCalendar(val)}
          />
        </div>
      </div>
    </div>
  );
}
