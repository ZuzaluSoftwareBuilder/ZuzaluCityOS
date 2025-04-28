'use client';
import { EventCard } from '@/components/cards';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  filterPastEvents,
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, SpaceEventData } from '@/types';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useSpaceData } from '../components/context/spaceData';

const Home = () => {
  const params = useParams();
  const spaceId = params.spaceid?.toString() ?? '';

  const { spaceData, isSpaceDataLoading } = useSpaceData();
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const { composeClient } = useCeramicContext();

  const getEventsBySpaceID = async () => {
    setIsEventsLoading(true);
    const GET_EVENTS_QUERY = `
      query GetSpaceEvents($id: ID!) {
        node(id: $id) {
          ...on ZucitySpace {
            events(first: 10) {
              edges {
                node {
                  createdAt
                  description
                  endTime
                  timezone
                  status
                  tagline
                  imageUrl
                  externalUrl
                  gated
                  id
                  meetingUrl
                  profileId
                  spaceId
                  startTime
                  title
                  space {
                    avatar
                    name
                  }
                }
              }
            }
          }
        }
      }
      `;

    try {
      const response: any = await composeClient.executeQuery(GET_EVENTS_QUERY, {
        id: spaceId,
      });

      const eventData: SpaceEventData = response.data.node
        .events as SpaceEventData;
      const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('fetched events is fail:', error);
    } finally {
      setIsEventsLoading(false);
    }
  };

  useEffect(() => {
    getEventsBySpaceID();
  }, [spaceId]);

  useEffect(() => {
    if (spaceData?.name) {
      document.title = spaceData.name + ' - ' + 'Zuzalu City';
    }
  }, [spaceData]);

  return (
    <Stack direction="row" height="calc(100vh - 50px)" width="100%">
      <Stack
        flex={1}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {isEventsLoading || isSpaceDataLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '20px',
            }}
          >
            <Typography variant="subtitleSB">Upcoming Events</Typography>
            <EventCardMonthGroup bgColor={'transparent'}>
              <Skeleton width={60}></Skeleton>
            </EventCardMonthGroup>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <Typography variant="subtitleSB">Past Events</Typography>
            <EventCardMonthGroup bgColor={'transparent'}>
              <Skeleton width={60}></Skeleton>
            </EventCardMonthGroup>
            <EventCardSkeleton />
            <EventCardSkeleton />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '20px',
            }}
          >
            {Object.entries(
              groupEventsByMonth(filterUpcomingEvents(events)),
            ).map(([month, eventsList]) => {
              return (
                <Fragment key={month}>
                  <Typography variant="subtitleSB">
                    Upcoming Events ({filterUpcomingEvents(events).length})
                  </Typography>
                  <EventCardMonthGroup bgColor={'transparent'}>
                    {month}
                  </EventCardMonthGroup>
                  {eventsList.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </Fragment>
              );
            })}
            <Typography variant="subtitleSB">
              Past Events ({filterPastEvents(events).length})
            </Typography>
            {filterPastEvents(events).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Home;
