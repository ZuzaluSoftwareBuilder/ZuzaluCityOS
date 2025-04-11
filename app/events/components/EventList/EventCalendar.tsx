import { Calendar } from '@/components/base';
import { ArrowsCounterClockwiseIcon } from '@/components/icons';
import { DateValue } from '@heroui/react';
import { ArrowsCounterClockwise } from '@phosphor-icons/react';
import React from 'react';
import CalendarButton from './CalendarButton';

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
        <div className="w-full p-[14px] pt-0">
          <CalendarButton
            border
            variant="light"
            fullWidth
            className="h-[30px] text-[14px] opacity-80"
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
          'border-1 border-[rgba(255,255,255,0.1)] mobile:border-none',
          inDropdown ? 'mb-[-6px] border-none rounded-[10px]' : '',
        ],
      }}
    />
  );
};

export default EventCalendar;
