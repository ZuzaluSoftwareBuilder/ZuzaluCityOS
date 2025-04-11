import { Event } from '@/types';
import { Box, Link, Skeleton, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Fragment, useMemo } from 'react';
import EventCard, {
  EventCardMonthGroup,
  EventCardSkeleton,
  groupEventsByMonth,
} from '../cards/EventCard';
import { EventIcon, RightArrowCircleIcon } from '../icons';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
  hasAllButton?: boolean;
  top?: number;
  headerStyle?: React.CSSProperties;
}

export default function EventList({
  events,
  isLoading,
  hasAllButton = true,
  top = -30,
  headerStyle,
}: EventListProps) {
  const theme = useTheme();
  const eventsData = useMemo(() => {
    const now = dayjs();
    const groupedEvents = {
      ongoing: [] as Event[],
      upcoming: [] as Event[],
      past: [] as Event[],
      legacy: [] as Event[],
    };

    events.forEach((event) => {
      const startTime = dayjs(event.startTime);
      const endTime = dayjs(event.endTime);

      if (event.source === 'Legacy') {
        groupedEvents.legacy.push(event);
      } else if (startTime.isBefore(now) && endTime.isAfter(now)) {
        groupedEvents.ongoing.push(event);
      } else if (startTime.isAfter(now)) {
        groupedEvents.upcoming.push(event);
      } else {
        groupedEvents.past.push(event);
      }
    });

    const getData = (events: Event[]) => {
      const data = groupEventsByMonth(events);
      let keys = Object.keys(data).sort((a, b) => {
        const dateA = dayjs(a, 'MMMM YYYY');
        const dateB = dayjs(b, 'MMMM YYYY');
        return dateA.isBefore(dateB) ? 1 : -1;
      });

      const invalidDateIndex = keys.findIndex((key) => key === 'Invalid Date');
      if (invalidDateIndex !== -1) {
        const invalidDate = keys.splice(invalidDateIndex, 1)[0];
        keys.push(invalidDate);
      }

      const groupedEvents: { [key: string]: Event[] } = {};
      keys.forEach((key) => {
        const value = data[key];
        value.sort((a, b) => {
          const dateA = dayjs(a.startTime);
          const dateB = dayjs(b.startTime);
          return dateA.isAfter(dateB) ? 1 : -1;
        });
        groupedEvents[key] = value;
      });
      return groupedEvents;
    };

    const data = {
      ongoing: {} as { [key: string]: Event[] },
      upcoming: {} as { [key: string]: Event[] },
      past: {} as { [key: string]: Event[] },
      legacy: {} as { [key: string]: Event[] },
    };
    data.ongoing = getData(groupedEvents.ongoing);
    data.upcoming = getData(groupedEvents.upcoming);
    data.past = getData(groupedEvents.past);
    data.legacy = getData(groupedEvents.legacy);

    return data;
  }, [events]);
  return (
    <Box
      position="relative"
      flexGrow={1}
      display="flex"
      flexDirection="column"
      gap="20px"
      sx={{ inset: '0' }}
    >
      {isLoading ? (
        <>
          <EventCardMonthGroup>
            <Skeleton width={60}></Skeleton>
          </EventCardMonthGroup>
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </>
      ) : events.length === 0 ? (
        <Box
          display={'flex'}
          height={200}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography color={'#ccc'}>No data at the moment</Typography>
        </Box>
      ) : (
        [
          { title: 'Ongoing Event', key: 'ongoing' },
          { title: 'Upcoming Event', key: 'upcoming' },
          { title: 'Past Event', key: 'past' },
          { title: 'Legacy Event', key: 'legacy' },
        ].map((item) => {
          if (
            Object.keys(eventsData[item.key as keyof typeof eventsData])
              .length === 0
          )
            return null;
          return (
            <div key={item.key} className="flex w-full flex-col gap-[20px]">
              <Box
                sx={{
                  backgroundColor: 'rgba(34, 34, 34, 0.9)',
                  backdropFilter: 'blur(10px)',
                  position: 'sticky',
                  top: `${top}px`,
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  ...headerStyle,
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap="10px">
                    <EventIcon />
                    <Typography
                      color="white"
                      variant="subtitleLB"
                      sx={{
                        [theme.breakpoints.down('sm')]: {
                          fontSize: '20px',
                        },
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  {hasAllButton && (
                    <Link
                      href={'/events'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'blink',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap="10px">
                        <Typography
                          color="white"
                          variant="bodyB"
                          sx={{
                            [theme.breakpoints.down('sm')]: {
                              fontSize: '14px',
                            },
                          }}
                        >
                          View All Events
                        </Typography>
                        <RightArrowCircleIcon />
                      </Box>
                    </Link>
                  )}
                </Box>
              </Box>
              {Object.entries(
                eventsData[item.key as keyof typeof eventsData],
              ).map(([month, eventsList]) => {
                return (
                  <Fragment key={month}>
                    <EventCardMonthGroup>{month}</EventCardMonthGroup>
                    {(eventsList as Event[]).map(
                      (event: Event, index: number) => (
                        <EventCard key={`EventCard-${index}`} event={event} />
                      ),
                    )}
                  </Fragment>
                );
              })}
            </div>
          );
        })
      )}
    </Box>
  );
}
