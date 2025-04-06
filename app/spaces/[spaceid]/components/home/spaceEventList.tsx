import { Box, Skeleton } from '@mui/material';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import React, { Fragment } from 'react';
import { EventCard } from '@/components/cards';
import { Event } from '@/types';

export interface ISpaceEventListProps {
  eventsData: Event[];
  isLoading: boolean;
}

const SpaceEventList = ({ isLoading, eventsData }: ISpaceEventListProps) => {
  return (
    <div className="p-[20px] mobile:p-[10px]">
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <EventCardMonthGroup>
            <Skeleton width={60}></Skeleton>
          </EventCardMonthGroup>
          <EventCardSkeleton />
          <EventCardSkeleton />
        </Box>
      ) : eventsData.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Box
              sx={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#919191',
              }}
            >
              Upcoming Events ({filterUpcomingEvents(eventsData).length})
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {Object.entries(
              groupEventsByMonth(filterUpcomingEvents(eventsData)),
            ).map(([key, value], index) => {
              return (
                <Fragment key={key + index}>
                  <EventCardMonthGroup>{key}</EventCardMonthGroup>
                  {value.map((event) => {
                    return <EventCard key={event.id} event={event} />;
                  })}
                </Fragment>
              );
            })}
          </Box>
          <Box
            sx={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          ></Box>
        </Box>
      ) : null}
    </div>
  );
};

export default SpaceEventList;
