'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Box, Stack } from '@mui/material';
import { EventHeader, CurrentEvents } from './components';
import { Event, Space } from '@/types';

import Drawer from '@/components/drawer';
import { EventForm } from '@/components/form/EventForm';
import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';
import { useGraphQL } from '@/hooks/useGraphQL';

export interface IEventArg {
  args: {
    eventId: string;
  };
}

const Home = () => {
  const params = useParams();
  const spaceId = params.spaceid?.toString() ?? '';

  const [open, setOpen] = useState(false);

  const { data: spaceData, refetch } = useGraphQL(
    ['getSpaceAndEvents', spaceId],
    GET_SPACE_AND_EVENTS_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => {
        return data?.data?.node as Space;
      },
    },
  );

  const eventsData = useMemo(() => {
    return spaceData?.events?.edges.map((edge) => edge.node) as Event[];
  }, [spaceData]);

  const toggleDrawer = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const handleFormClose = useCallback(() => {
    setOpen(false);
    refetch();
  }, [refetch]);

  return (
    <Stack direction="row" width={'100%'}>
      <Box width="100%" borderLeft="1px solid #383838">
        <EventHeader />
        <CurrentEvents events={eventsData ?? []} onToggle={toggleDrawer} />
        <Drawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
          <EventForm spaceId={spaceId} handleClose={handleFormClose} />
        </Drawer>
      </Box>
    </Stack>
  );
};

export default Home;
