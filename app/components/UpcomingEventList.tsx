import { TicketIcon } from '@/components/icons';
import CommonHeader from './CommonHeader';
import { useRouter } from 'next/navigation';
import { ZuCalendar } from '@/components/core';
import dayjs, { Dayjs } from 'dayjs';
import SlotDates from '@/components/calendar/SlotDate';
import { useState, useMemo, Fragment } from 'react';
import { Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';
import { SmallEventCardSkeleton } from './SmallEventCard';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { useTheme } from '@mui/material';
import { groupEventsByMonth } from '@/components/cards/EventCard';
import { EventCard } from './EventCard';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

interface EventListProps {
  events: Event[];
  isLoading: boolean;
  hasAllButton?: boolean;
  top?: number;
  headerStyle?: React.CSSProperties;
}

function EventList({ events, isLoading }: EventListProps) {
  const theme = useTheme();
  const eventsData = useMemo(() => {
    const groupedEvents = {
      upcoming: [] as Event[],
    };

    // 将所有事件放入 upcoming 数组中
    if (events && events.length > 0) {
      groupedEvents.upcoming = [...events];
    }

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
    data.upcoming = getData(groupedEvents.upcoming);

    return data;
  }, [events]);

  return (
    <div className="flex flex-col gap-[10px] pl-[20px] pb-[20px]">
      {isLoading ? (
        <>
          <div className="py-2 px-4 text-gray-400 font-medium">
            <div className="w-[60px] h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 bg-opacity-10 p-4 rounded-lg animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 w-12 h-12 rounded"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : events.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-[#ccc]">No data at the moment</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[20px]">
            {Object.entries(eventsData['upcoming']).map(
              ([month, eventsList]) => {
                return (
                  <Fragment key={month}>
                    <div className="py-[8px] px-[14px] text-[18px] leading-[1.2] font-[500] text-center rounded-[40px] border border-b-w-10 backdrop-blur-[10px] bg-[rgba(34,34,34,0.80)]">
                      {month}
                    </div>
                    {(eventsList as Event[]).map((event: Event) => (
                      <EventCard key={event.id} data={event} />
                    ))}
                  </Fragment>
                );
              },
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function UpcomingEventList() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [dateForCalendar, setDateForCalendar] = useState<Dayjs>(
    dayjs(new Date()).add(1, 'day'),
  );
  const { composeClient } = useCeramicContext();

  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      try {
        const tomorrow = dayjs().add(1, 'day');
        const tomorrowStart = tomorrow.format('YYYY-MM-DD') + 'T00:00:00Z';
        const getUpcomingEvents_QUERY = `
          query {
            zucityEventIndex(
              filters: {
                where: {
                  startTime: { greaterThanOrEqualTo: "${tomorrowStart}" }
                }
              },
              first: 100
            ) {
              edges {
                node {
                  createdAt
                  description
                  endTime
                  externalUrl
                  gated
                  id
                  imageUrl
                  meetingUrl
                  profileId
                  spaceId
                  startTime
                  status
                  tagline
                  timezone
                  title
                  profile {
                    username
                    avatar
                  }
                  tracks
                }
              }
            }
          }
        `;

        const response: any = await composeClient.executeQuery(
          getUpcomingEvents_QUERY,
        );

        if (response?.data?.zucityEventIndex) {
          return response.data.zucityEventIndex.edges.map((edge: any) => ({
            ...edge.node,
            source: 'ceramic',
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return [];
      }
    },
  });

  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="Upcoming Events"
        icon={<TicketIcon />}
        description=""
        buttonText="View All Events"
        buttonOnPress={() => router.push('/events')}
      />
      <div className="flex flex-col md:flex-row gap-[20px]">
        <div className="flex-1">
          {isLoading ? (
            <div className="flex gap-[20px] overflow-auto px-[20px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <SmallEventCardSkeleton key={index} />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <EventList
              events={upcomingEvents}
              headerStyle={{
                [theme.breakpoints.down('sm')]: {
                  top: '-13px',
                  padding: '10px 10px',
                  margin: '0 -10px',
                },
              }}
              isLoading={isLoading}
            />
          ) : (
            <div className="py-[20px] px-[10px] text-center">
              No upcoming events
            </div>
          )}
        </div>
        <div className="w-full md:w-[360px] px-[20px] flex flex-col gap-[20px]">
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
                highlightedDays: (upcomingEvents ?? [])
                  .filter((event: Event) => {
                    return (
                      dayjs(event.startTime).month() ===
                        dateForCalendar.month() &&
                      dayjs(event.startTime).year() === dateForCalendar.year()
                    );
                  })
                  .filter((event: Event) => {
                    if (selectedDate) {
                      return (
                        dayjs(event.startTime).date() !== selectedDate.date()
                      );
                    }
                    return true;
                  })
                  .map((event: Event) => {
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
