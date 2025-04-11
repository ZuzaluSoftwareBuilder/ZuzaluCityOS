import { Event } from '@/types';
import {
  Accordion,
  AccordionItem,
  DateValue,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button as HeroButton,
  cn,
} from '@heroui/react';
import { CalendarBlank, CaretUp, Funnel, Ticket } from '@phosphor-icons/react';
import React, { useState } from 'react';
import EventCalendar from './EventCalendar';
import {
  useCalendarConstraints,
  useDateAvailability,
  useEventsByTimeFilter,
} from './EventCalendarHooks';
import { ITimeEnum, TimeFilterOptions } from './EventListWithCalendar';

interface MobileNavProps {
  selectedDate: DateValue | null;
  setSelectedDate: (date: DateValue | null) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locations: { key: string; label: string }[];
  upcomingEvents: Event[];
  pastEvents?: Event[];
  ongoingEvents?: Event[];
  timeFilter: ITimeEnum;
  setTimeFilter: (filter: ITimeEnum) => void;
}

const GreenDot = () => {
  return <span className="size-[10px] rounded-full bg-[#7DFFD1]"></span>;
};

const MobileNav: React.FC<MobileNavProps> = ({
  selectedDate,
  setSelectedDate,
  selectedLocation,
  setSelectedLocation,
  locations,
  upcomingEvents = [],
  pastEvents = [],
  ongoingEvents = [],
  timeFilter,
  setTimeFilter,
}) => {
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false);

  const filterCount =
    (selectedLocation !== 'anywhere' ? 1 : 0) +
    (selectedDate ? 1 : 0) +
    (timeFilter !== ITimeEnum.UpComing ? 1 : 0);

  const currentEvents = useEventsByTimeFilter(
    timeFilter,
    upcomingEvents,
    pastEvents || [],
    ongoingEvents || [],
  );

  const calendarDateConstraints = useCalendarConstraints(
    timeFilter,
    currentEvents,
  );

  const isDateUnavailable = useDateAvailability(
    currentEvents,
    calendarDateConstraints,
  );

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
  };

  const handleResetDate = () => {
    setSelectedDate(null);
    setIsCalendarDropdownOpen(false);
  };

  const handleTimeFilterChange = (key: React.Key) => {
    setTimeFilter(key as ITimeEnum);
    setSelectedDate(null);
    setIsTimeDropdownOpen(false);
  };

  const handleLocationChange = (key: React.Key) => {
    setSelectedLocation(key as string);
    setIsLocationDropdownOpen(false);
  };

  const blurBgClassNames = [
    'bg-[rgba(34,34,34,0.8)] backdrop-blur-[12px]',
    'border-2 border-[rgba(255,255,255,0.1)]',
    'rounded-[10px]',
  ];
  const dropdownContentClassNames = [
    'bg-transparent',
    'shadow-none',
    'p-0',
    'rounded-none',
  ];

  const dropdownClassNames = {
    base: ['p-[10px] min-w-[202px]', ...blurBgClassNames],
    content: dropdownContentClassNames,
  };
  const dropdownMotionProp = {
    variants: {
      enter: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.15, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.1, ease: 'easeIn' },
      },
    },
  };
  const OptimizedDropdownStyles = {
    willChange: 'opacity, transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
  };
  const dropdownMenuClassNames = {
    base: ['p-0'],
    list: ['gap-[4px]'],
  };
  const dropdownItemBaseClassName =
    'px-[10px] rounded-[8px] text-white text-[13px] leading-[1.2] font-[500]';

  const filterButtonBaseStyle =
    'flex items-center min-w-[auto] h-[32px] gap-[5px] px-[10px] rounded-[5px] bg-[#363636] active:bg-[#4A4A4A] hover:bg-[#4A4A4A]';

  return (
    <div className="sticky top-[95px] z-[1000] hidden bg-[rgba(34,34,34,0.90)] pb-[10px] backdrop-blur-[10px] tablet:block mobile:block">
      <Accordion
        className="w-full"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: 'easeOut' },
            },
            exit: {
              y: -10,
              opacity: 0,
              transition: { duration: 0.2, ease: 'easeIn' },
            },
          },
        }}
      >
        <AccordionItem
          key="filter"
          aria-label="Filter options"
          classNames={{
            base: 'border-none bg-transparent',
            trigger: 'py-[10px] px-0',
            content: 'py-[10px]',
          }}
          disableIndicatorAnimation={true}
          indicator={({ isOpen }) => (
            <div
              className={`flex items-center gap-[5px] ${isOpen ? 'opacity-100' : 'opacity-50'}`}
            >
              {filterCount > 0 && <GreenDot />}
              <Funnel
                size={20}
                weight="fill"
                format="Stroke"
                color="#FFFFFF"
                className="shrink-0"
              />
              <CaretUp
                size={16}
                weight="light"
                format="Stroke"
                color="#FFFFFF"
                className={`shrink-0 transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          )}
          startContent={
            <div className="flex items-center gap-[10px]">
              <Ticket size={20} weight="fill" format="Outline" />
              <p className="text-[20px] font-bold leading-[24px] text-white shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
                Events
              </p>
            </div>
          }
        >
          <div className="flex items-center justify-between gap-[10px] bg-[rgba(34,34,34,0.90)] backdrop-blur-[10px]">
            <div className="flex gap-[10px]">
              <Dropdown
                isOpen={isLocationDropdownOpen}
                onOpenChange={(open) => setIsLocationDropdownOpen(open)}
                classNames={dropdownClassNames}
                motionProps={dropdownMotionProp}
              >
                <DropdownTrigger>
                  <HeroButton className={filterButtonBaseStyle}>
                    <span className="text-[14px] text-white">Location</span>
                    {selectedLocation !== 'anywhere' && <GreenDot />}
                  </HeroButton>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Location options"
                  selectedKeys={[selectedLocation]}
                  selectionMode="single"
                  classNames={dropdownMenuClassNames}
                  onAction={handleLocationChange}
                  style={OptimizedDropdownStyles}
                >
                  {locations.map((location) => (
                    <DropdownItem
                      key={location.key}
                      className={cn(
                        dropdownItemBaseClassName,
                        selectedLocation === location.key &&
                          'bg-[rgba(255,255,255,0.1)]',
                      )}
                    >
                      {location.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Dropdown
                isOpen={isTimeDropdownOpen}
                onOpenChange={(open) => setIsTimeDropdownOpen(open)}
                classNames={dropdownClassNames}
                motionProps={dropdownMotionProp}
              >
                <DropdownTrigger>
                  <HeroButton className={filterButtonBaseStyle}>
                    <span className="text-[14px] text-white">Time</span>
                    {timeFilter !== ITimeEnum.UpComing && <GreenDot />}
                  </HeroButton>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Time options"
                  classNames={dropdownMenuClassNames}
                  onAction={handleTimeFilterChange}
                  selectedKeys={[timeFilter]}
                  style={OptimizedDropdownStyles}
                >
                  {TimeFilterOptions.map((option) => (
                    <DropdownItem
                      key={option.key}
                      className={cn(
                        dropdownItemBaseClassName,
                        timeFilter === option.key
                          ? 'bg-[rgba(255,255,255,0.1)]'
                          : '',
                      )}
                    >
                      <div className={'flex items-center justify-between'}>
                        <span> {option.label}</span>
                        {timeFilter === option.key && (
                          <span className="ml-[5px]">✓</span>
                        )}
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <Dropdown
              isOpen={isCalendarDropdownOpen}
              onOpenChange={(open) => setIsCalendarDropdownOpen(open)}
              placement="bottom-end"
              classNames={{
                base: ['p-0', ...blurBgClassNames],
                content: dropdownContentClassNames,
              }}
              motionProps={dropdownMotionProp}
            >
              <DropdownTrigger>
                <HeroButton
                  className={cn(
                    filterButtonBaseStyle,
                    `${selectedDate ? 'bg-[#4A4A4A]' : 'bg-[#363636]'}`,
                  )}
                >
                  <CalendarBlank size={20} weight="fill" color="#FFFFFF" />
                  {selectedDate && <GreenDot />}
                </HeroButton>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Calendar"
                className="w-[280px] bg-transparent"
                closeOnSelect={false}
                classNames={dropdownMenuClassNames}
                style={OptimizedDropdownStyles}
                itemClasses={{
                  base: [
                    'p-0',
                    'data-[hover=true]:bg-transparent',
                    'dark:data-[hover=true]:bg-transparent',
                  ],
                }}
              >
                <DropdownItem
                  key="calendar-item"
                  className="rounded-[10px] bg-transparent p-0 outline-none"
                >
                  <EventCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    onReset={handleResetDate}
                    minValue={calendarDateConstraints.minValue}
                    maxValue={calendarDateConstraints.maxValue}
                    isDateUnavailable={isDateUnavailable}
                    calendarWidth="100%"
                    isMobile={true}
                    inDropdown={true}
                  />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MobileNav;
