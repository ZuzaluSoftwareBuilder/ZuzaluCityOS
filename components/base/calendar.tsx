import { CalendarProps } from '@heroui/react';

import { Calendar as HCalendar } from '@heroui/react';

function Calendar({ classNames, ...props }: CalendarProps) {
  return (
    <HCalendar
      classNames={{
        base: 'border-b-w-10 border-1 border-[rgba(255,255,255,0.1)] rounded-[14px] shadow-none !bg-transparent',
        headerWrapper: 'bg-transparent',
        title: 'text-white',
        gridHeader: 'bg-transparent',
        gridHeaderRow: 'justify-between pb-0 text-white/80',
        gridBodyRow: 'justify-between px-[14px]',
        cellButton: '!no-underline',
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
