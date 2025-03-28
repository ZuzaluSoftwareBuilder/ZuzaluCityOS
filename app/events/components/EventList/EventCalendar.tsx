import React from 'react';
import { Calendar, CalendarButton } from '@/components/base';
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
  inDropdown?: boolean;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  value,
  onChange,
  onReset,
  minValue,
  maxValue,
  isDateUnavailable,
  calendarWidth = '280px',
  isMobile = false,
  className = '',
  inDropdown = false,
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
          <CalendarButton
            border
            variant="light"
            fullWidth
            className="text-[14px] h-[30px] opacity-80"
            startContent={
              isMobile ? (
                <ArrowsCounterClockwise size={16} />
              ) : (
                <ArrowsCounterClockwiseIcon />
              )
            }
            onPress={onReset}
          >
            Reset
          </CalendarButton>
        </div>
      }
      onChange={onChange}
      className={className}
      classNames={{
        base: [
          '!bg-transparent',
          'rounded-[14px]',
          'border-none',
          inDropdown ? 'mb-[-6px] rounded-[10px]' : '',
        ],
      }}
    />
  );
};

export default EventCalendar;
