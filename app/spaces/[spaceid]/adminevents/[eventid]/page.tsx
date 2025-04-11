'use client';
import { Box, Stack, useMediaQuery } from '@mui/material';
import * as React from 'react';

import { useCeramicContext } from '@/context/CeramicContext';
import { getSpacesQuery } from '@/services/space';
import { Space } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Navbar, Tabbar } from 'components/layout';
import { useParams, useRouter } from 'next/navigation';
import { EventProvider, useEventContext } from './EventContext';
import { Announcements, Apps, Overview, Ticket, Venue } from './Tabs';
import {
  StatusProvider,
  useStatusContext,
} from './Tabs/Ticket/components/Common';

const EventContent: React.FC = () => {
  const [tabName, setTabName] = React.useState<string>('Overview');
  const { event, setEvent } = useEventContext();
  const { setStatus } = useStatusContext();

  const { composeClient, ceramic } = useCeramicContext();

  const pathname = useParams();
  const params = useParams();
  const router = useRouter();
  const spaceId = params.spaceid?.toString() ?? '';

  const { data: spaceData } = useQuery({
    queryKey: ['getSpaceByIDInAdminEvents', spaceId],
    queryFn: () => {
      return composeClient.executeQuery(getSpacesQuery, {
        id: spaceId,
      });
    },
    select: (data) => {
      return data?.data?.node as Space;
    },
  });

  const fetchEventById = async (id: string) => {
    const query = `
      query FetchEvent($id: ID!) {
        node(id: $id) {
          ...on ZucityEvent {
            title
            author {
              id
            }
            description
            status
            endTime
            spaceId
            tagline
            timezone
            createdAt
            imageUrl
            profile {
              avatar
              username
            }
            startTime
            description
            meetingUrl
            externalUrl
            tracks
            customLinks {
              title
              links
            }
            space {
              name
              gated
            }
            id
            applicationForms(first:1000) {
              edges {
                node {
                  id
                  answers
                  approveStatus
                  profile {
                    avatar
                    username
                  }
                }
              }
            }
            regAndAccess(first:1) {
              edges {
                node {
                  id
                  profileId
                  registrationAccess
                  registrationOpen
                  registrationWhitelist {
                    id
                  }
                  ticketType
                  checkinOpen
                  applyRule
                  applyOption
                  applicationForm
                  eventId
                  applicationForm
                  zuPassInfo {
                    access
                    eventId
                    eventName
                    registration
                  }
                  scrollPassContractFactoryID
                  scrollPassTickets {
                    type
                    status
                    checkin
                    image_url
                    description
                    contractAddress
                    tokenType
                    name
                    price
                    disclaimer
                  }
                  zuLottoInfo {
                    name
                    description
                    contractAddress
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variable = {
      id,
    };

    try {
      const result: any = await composeClient.executeQuery(query, variable);
      if (result.data) {
        if (result.data.node) {
          setEvent(result.data.node);
          const edges = result.data.node.regAndAccess.edges;
          if (edges.length > 0) {
            const regAndAccess = edges[0].node;
            setStatus({
              checkinOpen: regAndAccess?.checkinOpen === '1',
              registrationOpen: regAndAccess?.registrationOpen === '1',
            });
          }
        }
      }
    } catch (err) {
      console.log('ERROR: FETCH EVENT: ', err);
    }

    return {};
  };

  const isMobile = useMediaQuery('(max-width:768px)');

  const { refetch } = useQuery({
    queryKey: ['fetchEventById', pathname.eventid],
    queryFn: () => fetchEventById(pathname.eventid as string),
    enabled: !!pathname.eventid,
  });

  const refetchData = () => {
    pathname.eventid && refetch();
  };

  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return (
          <Overview
            event={event}
            refetch={refetchData}
            setTabName={setTabName}
          />
        );
      case 'Announcements':
        return <Announcements event={event} />;
      case 'Registration':
        return <Ticket event={event} />;
      /*case 'Event Sessions':
        return <Sessions />;*/
      case 'Venue':
        return <Venue event={event} />;
      case 'Apps':
        return <Apps event={event} />;
      default:
        return <Overview setTabName={setTabName} />;
    }
  };

  return (
    <Stack width="100%" id="111122">
      <Navbar spaceName={event?.space?.name} />
      <Tabbar tabName={tabName} setTabName={setTabName} event={event} />
      <Stack direction="row" justifyContent="center">
        <Box
          width={isMobile ? '100%' : '860px'}
          marginTop={3}
          sx={{ position: 'relative' }}
        >
          {/* {tabName === 'Registration' && <Navigation event={event} />} */}
          {renderPage()}
        </Box>
      </Stack>
    </Stack>
  );
};

const Home: React.FC = () => {
  return (
    <EventProvider>
      <StatusProvider>
        <EventContent />
      </StatusProvider>
    </EventProvider>
  );
};

export default Home;
