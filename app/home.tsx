'use client';
import SlotDates from '@/components/calendar/SlotDate';
import { SpaceCardSkeleton } from '@/components/cards/SpaceCard';
import { ZuCalendar } from '@/components/core';
import { dashboardEvent } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, EventData, Space, SpaceData } from '@/types';
import { Dayjs, dayjs } from '@/utils/dayjs';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Carousel from 'components/Carousel';
import {
  RightArrowCircleIcon,
  RightArrowIcon,
  SpaceIcon,
} from 'components/icons';
import { Sidebar } from 'components/layout';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getSpacesQuery } from '@/services/space';
import Banner from './components/Banner';
import { supabase } from '@/utils/supabase/client';
import EventList from '@/components/event/EventList';
import COMMON_STYLES from 'style/common';
import { cn } from '@heroui/react';
import { Button } from 'components/base';
import Communities from './components/Communities';

const Home: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [eventsForCalendar, setEventsForCalendar] = useState<Event[]>([]);
  const [isPast, setIsPast] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [targetEventView, setTargetEventView] = useState<boolean>(false);
  const [targetEvent, setTargetEvent] = useState<Event>();

  const [dateForCalendar, setDateForCalendar] = useState<Dayjs>(
    dayjs(new Date()),
  );

  const { ceramic, composeClient } = useCeramicContext();

  const getSpaces = async () => {
    try {
      const response: any = await composeClient.executeQuery(getSpacesQuery);
      if ('zucitySpaceIndex' in response.data) {
        const spaceData: SpaceData = response.data as SpaceData;
        let fetchedSpaces: Space[] = spaceData.zucitySpaceIndex.edges.map(
          (edge) => edge.node,
        );
        const shuffledSpaces = [...fetchedSpaces].sort(
          () => Math.random() - 0.5,
        );
        setSpaces(shuffledSpaces);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    }
  };

  const getEvents = async () => {
    try {
      setIsEventsLoading(true);

      const ceramicResponse: any = await composeClient.executeQuery(`
      query {
        zucityEventIndex(first: 20, sorting: { createdAt: DESC }) {
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
              members{
              id
              }
              admins{
              id
              }
              superAdmin{
              id
              }
              profile {
                username
                avatar
              }
              space {
                name
                avatar
              }
              tracks
            }
          }
        }
      }
    `);

      const { data: legacyEvents, error } = await supabase
        .from('legacyEvents')
        .select('*');

      if (error) throw error;

      let allEvents: Event[] = [];
      if (ceramicResponse?.data?.zucityEventIndex) {
        const ceramicEvents: Event[] =
          ceramicResponse.data.zucityEventIndex.edges.map((edge: any) => ({
            ...edge.node,
            source: 'ceramic',
          }));
        allEvents = [...ceramicEvents];
      }

      if (legacyEvents) {
        const convertedLegacyEvents: Event[] = legacyEvents
          .filter((legacy): legacy is NonNullable<typeof legacy> => !!legacy.id)
          .map((legacy) => ({
            id: legacy.id,
            title: legacy.name ?? '',
            description: legacy.description ?? '',
            startTime: legacy.start_date ?? '',
            endTime: legacy.end_date ?? '',
            status: legacy.status ?? '',
            tagline: legacy.tagline ?? '',
            imageUrl: legacy.image_url ?? '',
            profileId: '',
            spaceId: '',
            timezone: 'UTC',
            tracks: legacy.event_type || [],
            source: 'Legacy',
            participantCount: 0,
            minParticipant: 0,
            maxParticipant: 0,
            createdAt: legacy.start_date,
            gated: false,
            externalUrl: '',
            meetingUrl: '',
            legacyData: {
              event_space_type: legacy.event_space_type,
              format: legacy.format,
              experience_level: legacy.experience_level,
              social_links: legacy.social_links,
              extra_links: legacy.extra_links,
            },
          }));
        allEvents = [...allEvents, ...convertedLegacyEvents];
      }

      allEvents.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );

      setEvents(allEvents);
      setIsEventsLoading(false);

      const getEvent = allEvents.find((event) => event.id === dashboardEvent);
      if (getEvent) {
        setTargetEvent(getEvent);
        const userDid = ceramic.did?.parent.toString().toLowerCase() || '';
        if (getEvent) {
          const memberIds = new Set(
            getEvent.members?.map((member) => member.id.toLowerCase()),
          );
          const adminIds = new Set(
            getEvent.admins?.map((admin) => admin.id.toLowerCase()),
          );
          const superAdminIds = new Set(
            getEvent.superAdmin?.map((sa) => sa.id.toLowerCase()),
          );

          const canView =
            memberIds.has(userDid) ||
            adminIds.has(userDid) ||
            superAdminIds.has(userDid);
          if (canView) {
            setTargetEventView(canView);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setIsEventsLoading(false);
    }
  };

  const getEventsByDate = async () => {
    try {
      // TODO: clean selectedDate
      if (selectedDate) {
        const getEventsByDate_QUERY = `
          query ($input:ZucityEventFiltersInput!) {
          zucityEventIndex(filters:$input, first: 20){
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
        setIsEventsLoading(true);
        const response: any = await composeClient.executeQuery(
          getEventsByDate_QUERY,
          {
            input: {
              where: {
                startTime: {
                  lessThanOrEqualTo:
                    selectedDate.format('YYYY-MM-DD') + 'T23:59:59Z',
                  greaterThanOrEqualTo:
                    selectedDate.format('YYYY-MM-DD') + 'T00:00:00Z',
                },
              },
            },
          },
        );
        if (response && response.data && 'zucityEventIndex' in response.data) {
          const eventData: EventData = response.data as EventData;
          const fetchedEvents: Event[] = eventData.zucityEventIndex.edges.map(
            (edge) => edge.node,
          );
          setEvents(fetchedEvents);
        } else {
          console.error('Invalid data structure:', response.data);
        }
        setIsEventsLoading(false);
      }
    } catch (error) {
      setIsEventsLoading(false);
      console.error('Failed to fetch events:', error);
    }
  };

  const getEventsInMonth = async () => {
    const getEventsByDate_QUERY = `
        query ($input:ZucityEventFiltersInput!) {
        zucityEventIndex(filters:$input, first: 20){
          edges {
            node {
              description
              externalUrl
              gated
              imageUrl
              meetingUrl
              profileId
              spaceId
              status
              tagline
              timezone
              title
              profile {
                username
                avatar
              }
              createdAt
              endTime
              id
              startTime
              tracks
            }
          }
        }
      }
    `;
    const response: any = await composeClient.executeQuery(
      getEventsByDate_QUERY,
      {
        input: {
          where: {
            startTime: {
              lessThanOrEqualTo: dateForCalendar
                ?.endOf('month')
                .format('YYYY-MM-DDTHH:mm:ss[Z]'),
              greaterThanOrEqualTo: dateForCalendar
                ?.startOf('month')
                .format('YYYY-MM-DDTHH:mm:ss[Z]'),
            },
          },
        },
      },
    );
    if (response && response.data && 'zucityEventIndex' in response.data) {
      const eventData: EventData = response.data as EventData;
      const fetchedEvents: Event[] = eventData.zucityEventIndex.edges.map(
        (edge) => edge.node,
      );
      setEventsForCalendar(fetchedEvents);
    } else {
      console.error('Invalid data structure:', response.data);
    }
  };

  useEffect(() => {
    document.title = 'Zuzalu City';
    Promise.all([getSpaces(), getEvents()]).catch((error) => {
      console.error('An error occurred:', error);
    });
  }, [ceramic.did?.parent]);

  useEffect(() => {
    getEventsByDate().catch((error) => {
      console.error('An error occurred:', error);
    });
  }, [selectedDate]);

  useEffect(() => {
    getEventsInMonth().catch((e) => {
      console.error('Failed to fetch events:', e);
    });
  }, [dateForCalendar]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width={'100vw'} minHeight={'calc(100vh - 50px)'}>
        <Box
          display="grid"
          gridTemplateColumns={'auto 1fr'}
          sx={{
            backgroundColor: 'rgba(34, 34, 34, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
          height={'calc(100vh - 50px)'}
        >
          {!isTablet && <Sidebar selected="Home" />}
          <div className="flex-1 w-full lg:w-[calc(100vw-260px)] h-full overflow-y-auto overflow-x-hidden text-white">
            <Banner />
            <Communities data={spaces} />
          </div>
          {/* <Box
            flex={1}
            padding={isMobile ? '10px' : '30px'}
            width={isTablet ? '100vw' : 'calc(100vw - 260px)'}
            height={'100%'}
            sx={{
              overflowY: 'auto',
              overflowX: 'hidden',
              maxWidth: '1160px',
              margin: '0 auto',
            }}
          >
            <Banner />
            <Box marginTop="30px">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  backgroundColor: 'rgba(34, 34, 34, 0.9)',
                  backdropFilter: 'blur(10px)',
                  position: 'sticky',
                  top: '-30px',
                  zIndex: 100,
                  [theme.breakpoints.down('sm')]: {
                    top: '-13px',
                    padding: '10px 10px',
                    margin: '0 -10px',
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap="10px">
                  <SpaceIcon />
                  <Typography
                    variant={isMobile ? 'subtitleMB' : 'subtitleLB'}
                    color="white"
                  >
                    Communities
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap="10px"
                  onClick={() => router.push('/spaces')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography color="white" variant="bodyM">
                    View All Spaces
                  </Typography>
                  <RightArrowCircleIcon />
                </Box>
              </Box>
              <Box margin="0 0 20px">
                <Typography
                  color="white"
                  variant="bodyM"
                  sx={{ opacity: '0.5', fontSize: '12px' }}
                >
                  Random Spaces
                </Typography>
              </Box>
              {spaces.length > 0 ? (
                <Carousel items={spaces} />
              ) : (
                <Box display={'flex'} gap={'10px'}>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                  <SpaceCardSkeleton></SpaceCardSkeleton>
                </Box>
              )}
            </Box>
            <Box
              display="flex"
              gap="20px"
              marginTop="20px"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  gap: 0,
                },
              }}
            >
              <EventList
                events={events}
                headerStyle={{
                  [theme.breakpoints.down('sm')]: {
                    top: '-13px',
                    padding: '10px 10px',
                    margin: '0 -10px',
                  },
                }}
                isLoading={isEventsLoading}
              />
              <Box>
                {!isTablet && (
                  <Box
                    width="360px"
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    sx={{
                      position: 'sticky',
                      top: 60,
                    }}
                  >
                    <Typography
                      color="white"
                      variant="subtitleS"
                      padding="20px 10px"
                      borderBottom="1px solid #383838"
                    >
                      Sort & Filter Events
                    </Typography>
                    <Box>
                      <ZuCalendar
                        onChange={(val) => {
                          setSelectedDate(val);
                        }}
                        slots={{ day: SlotDates }}
                        slotProps={{
                          day: {
                            highlightedDays: eventsForCalendar
                              .filter((event) => {
                                // filter event.startTime month equal to selected month
                                return (
                                  dayjs(event.startTime).month() ===
                                    dateForCalendar.month() &&
                                  dayjs(event.startTime).year() ===
                                    dateForCalendar.year()
                                );
                              })
                              .filter((event) => {
                                if (selectedDate) {
                                  return (
                                    dayjs(event.startTime).date() !==
                                    selectedDate.date()
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
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box> */}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Home;
