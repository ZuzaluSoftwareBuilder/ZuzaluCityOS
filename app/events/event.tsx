'use client';
import React, { useState, useEffect } from 'react';
import {
  useTheme,
  useMediaQuery,
  Stack,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { Sidebar } from 'components/layout';
import SidebarLeft from './components/Sidebar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCeramicContext } from '../../context/CeramicContext';
import { Event } from '@/types';
import { SearchIcon } from '@/components/icons';
import EventHeader from './components/EventHeader';
import { supabase } from '@/utils/supabase/client';
import EventList from '@/components/event/EventList';

const EventsPage: React.FC = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState('Events');
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [searchVal, setSearchVal] = useState('');
  const { composeClient } = useCeramicContext();

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
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setIsEventsLoading(false);
    }
  };

  useEffect(() => {
    getEvents()
      .catch((error) => console.error('Failed to fetch events:', error))
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, []);

  const onSearch = () => {
    getEvents()
      .catch((error) => console.error('Failed to fetch events:', error))
      .finally(() => {
        setIsEventsLoading(false);
      });
  };

  const debounceGetEventsCity = debounce(getEvents, 1000);

  useEffect(() => {
    if (searchVal) {
      // @ts-ignore
      debounceGetEventsCity()
        .catch((error) => console.error('An error occurred:', error))
        .finally(() => {
          setIsEventsLoading(false);
        });
    }
  }, [searchVal]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
        {!isTablet && <Sidebar selected={selected} />}
        <Stack direction="column" borderLeft="1px solid #383838" flex={1}>
          <EventHeader />
          <Stack p="20px">
            <EventList
              top={50}
              hasAllButton={false}
              events={events}
              isLoading={isEventsLoading}
            />
          </Stack>
          <Stack
            sx={{
              display: 'none',
              flexDirection: 'column',
              gap: '10px',
              [theme.breakpoints.down('md')]: {
                display: 'flex',
              },
              padding: '0 20px',
            }}
          >
            <OutlinedInput
              placeholder="Search Events"
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  onSearch();
                }
              }}
              sx={{
                backgroundColor:
                  'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
                paddingX: '15px',
                paddingY: '13px',
                borderRadius: '10px',
                height: '35px',
                border:
                  '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
                fontFamily: 'Inter',
                opacity: 0.7,
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
              onChange={(e) => setSearchVal(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ opacity: 0.6 }}>
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </Stack>
        </Stack>
        <SidebarLeft
          onSearch={onSearch}
          onTextChange={(text) => setSearchVal(text)}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default EventsPage;
