import React, { useState } from 'react';
import { Funnel, CaretUp, CalendarBlank, Ticket } from '@phosphor-icons/react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button as HeroButton,
  cn,
} from '@heroui/react';
import { DateValue } from '@heroui/react';
import { Event } from '@/types';
import { ITimeEnum, TimeFilterOptions } from './EventListWithCalendar';
import {
  useCalendarConstraints,
  useEventsByTimeFilter,
  useDateAvailability,
} from './EventCalendarHooks';
import EventCalendar from './EventCalendar';

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
  return <span className="w-[10px] h-[10px] rounded-full bg-[#7DFFD1]"></span>;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false);

  const filterCount =
    (selectedLocation !== 'anywhere' ? 1 : 0) +
    (selectedDate ? 1 : 0) +
    (timeFilter !== ITimeEnum.UpComing ? 1 : 0);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (!isFilterOpen) {
      setIsCalendarDropdownOpen(false);
      setIsTimeDropdownOpen(false);
      setIsLocationDropdownOpen(false);
    }
  };

  const currentEvents = useEventsByTimeFilter(
    timeFilter,
    upcomingEvents,
    pastEvents || [],
    ongoingEvents || [],
  );

  const calendarDateConstraints = useCalendarConstraints(timeFilter);

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

  const dropdownClassNames = { content: ['bg-transparent', 'shadow-none'] };
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
    base: [
      'p-[10px] min-w-[202px]',
      'bg-[rgba(34,34,34,0.8)] backdrop-blur-[12px]',
      'border-2 border-[rgba(255,255,255,0.1)]',
      'rounded-[10px]',
    ],
    list: ['gap-[4px]'],
  };
  const dropdownItemBaseClassName =
    'px-[10px] rounded-[8px] text-white text-[13px] leading-[1.2] font-[500]';

  const filterButtonBaseStyle =
    'flex items-center min-w-[auto] h-[32px] gap-[5px] px-[10px] rounded-[5px] bg-[#363636] active:bg-[#4A4A4A] hover:bg-[#4A4A4A]';

  return (
    <>
      <div className="flex items-center gap-[10px] bg-[rgba(34,34,34,0.90)] backdrop-blur-[10px] py-[10px]">
        <Ticket size={20} weight="fill" format="Outline" />
        <p className="text-[20px] font-bold text-white leading-[24px] shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
          Events
        </p>
        <div className="flex-1"></div>

        <div
          className="flex items-center gap-[5px] relative cursor-pointer"
          onClick={toggleFilter}
        >
          {filterCount > 0 && <GreenDot />}

          <div
            className={`flex items-center ${filterCount > 0 ? 'opacity-100' : 'opacity-50'} gap-[5px]`}
          >
            <Funnel size={20} weight="fill" format="Stroke" color="#FFFFFF" />
            <CaretUp
              size={16}
              weight="light"
              format="Stroke"
              color="#FFFFFF"
              className={`${!isFilterOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="flex justify-between items-center gap-[10px] bg-[rgba(34,34,34,0.90)] backdrop-blur-[10px] mt-[10px]">
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
                      `${selectedLocation === location.key ?? 'bg-[rgba(255,255,255,0.1)]'}`,
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
                      `${timeFilter === option.key} ?? bg-[rgba(255,255,255,0.1)]`,
                    )}
                  >
                    {option.label}
                    {timeFilter === option.key && (
                      <span className="ml-[5px]">✓</span>
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          <Dropdown
            isOpen={isCalendarDropdownOpen}
            onOpenChange={(open) => setIsCalendarDropdownOpen(open)}
            placement="bottom-end"
            classNames={dropdownClassNames}
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
              classNames={{
                base: [
                  'p-0',
                  'bg-[rgba(34,34,34,0.8)] backdrop-blur-[12px]',
                  'border-2 border-[rgba(255,255,255,0.1)]',
                  'rounded-[10px]',
                ],
                list: ['gap-0'],
              }}
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
                className="p-0 outline-none bg-transparent"
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
                />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </>
  );
};

export default MobileNav;
