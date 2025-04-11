'use client';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import './calendar.css';

interface CalendarProps {
  eventsData: any[];
  onEventClick?: (event: any) => void;
}

export default function CalendarView({
  eventsData,
  onEventClick,
}: CalendarProps) {
  return (
    <div className="size-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        events={eventsData}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        dayMaxEvents={4}
        aspectRatio={2}
        eventClick={onEventClick}
      />
    </div>
  );
}
