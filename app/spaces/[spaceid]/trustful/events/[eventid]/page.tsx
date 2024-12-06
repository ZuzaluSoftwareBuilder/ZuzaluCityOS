/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Box } from '@mui/material';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, Space, SpaceEventData } from '@/types';
import SubSidebar from '@/components/layout/Sidebar/SubSidebar';
import { useTrustful } from '@/context/TrustfulContext';
import {
  CardEventDetails,
  CardSession,
  DropdownEventSelected,
} from '@/app/spaces/[spaceid]/trustful/events/[eventid]/components';
import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from '@/theme/lib/chakra-ui';

const TrustfulPageEventId = () => {
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [space, setSpace] = useState<Space>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { composeClient, ceramic, profile, username } = useCeramicContext();
  const { setUserRole } = useTrustful();

  const getSpaceByID = async () => {
    setIsEventsLoading(true);
    const GET_SPACE_QUERY = `
      query GetSpace($id: ID!) {
        node(id: $id) {
          ...on Space {
            avatar
            banner
            description
            name
            profileId
            tagline
            website
            twitter
            telegram
            nostr
            lens
            github
            discord
            ens
            admins {
              id
            }
            superAdmin {
              id
            }
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

    const response: any = await composeClient.executeQuery(GET_SPACE_QUERY, {
      id: spaceId,
    });
    const spaceData: Space = response.data.node as Space;
    setSpace(spaceData);
    const eventData: SpaceEventData = response.data.node
      .events as SpaceEventData;
    const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
    setEvents(fetchedEvents);
    return spaceData;
  };
  useEffect(() => {
    const fetchData = async () => {
      const space = await getSpaceByID();
      document.title = space?.name + ' - ' + 'Zuzalu City';
      const admins =
        space?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const superAdmins =
        space?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) ||
        [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (admins.includes(userDID) || superAdmins.includes(userDID)) {
        setIsAdmin(true);
      }
    };

    fetchData()
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, []);

  const address = useMemo(() => {
    if (profile) {
      const id = profile.author?.id.split(':');
      return id?.[id?.length - 1];
    }
  }, [profile]);

  return (
    <Stack direction="row" height="calc(100vh - 50px)" width="100%">
      <SubSidebar
        avatar={space?.avatar}
        banner={space?.banner}
        title={space?.name}
        spaceId={params.spaceid.toString()}
        isAdmin={isAdmin}
      />
      <Stack
        flex={1}
        sx={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
          }}
        >
          <ChakraProvider theme={chakraTheme}>
            <DropdownEventSelected />
          </ChakraProvider>
          <CardEventDetails />
          <CardSession />
        </Box>
      </Stack>
    </Stack>
  );
};

export default TrustfulPageEventId;
