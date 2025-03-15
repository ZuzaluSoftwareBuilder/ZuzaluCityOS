import React from 'react';
import { Calendar, Button } from '@/components/base';
import { DateValue } from '@heroui/react';
import { ArrowsCounterClockwiseIcon } from '@/components/icons';
import { ArrowsCounterClockwise } from '@phosphor-icons/react';

interface EventCalendarProps {
  value: DateValue | null;
  onChange: (date: DateValue) => void;
  onReset: () => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable: (date: DateValue) => boolean;
  calendarWidth?: string;
  isMobile?: boolean;
  className?: string;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  value,
  onChange,
  onReset,
  minValue,
  maxValue,
  isDateUnavailable,
  calendarWidth = '320px',
  isMobile = false,
  className = '',
}) => {
  return (
    <Calendar
      value={value}
      calendarWidth={calendarWidth}
      weekdayStyle="short"
      minValue={minValue}
      maxValue={maxValue}
      isDateUnavailable={isDateUnavailable}
      bottomContent={
        <div className="p-[14px] w-full pt-0">
          <Button
            border
            variant="light"
            fullWidth
            className="text-[14px] h-[30px] opacity-80"
            startContent={isMobile ? <ArrowsCounterClockwise size={16} /> : <ArrowsCounterClockwiseIcon />}
            onPress={onReset}
          >
            Reset
          </Button>
        </div>
      }
      onChange={onChange}
      className={className}
      classNames={isMobile ? {
        base: 'border-b-w-10 border-1 rounded-larg shadow-none bg-transparent',
        headerWrapper: 'bg-transparent',
        title: 'text-white',
        gridHeader: 'bg-transparent',
        gridHeaderRow: 'justify-between pb-0 text-white/80',
        gridBodyRow: 'justify-between px-[14px]',
        cellButton: '!no-underline',
      } : undefined}
    />
  );
};

export default EventCalendar; 