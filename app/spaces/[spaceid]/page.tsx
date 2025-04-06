'use client';

import { useParams } from 'next/navigation';
import SpaceSection from './components/home/spaceSection';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';
import { Event, Space } from '@/types';
import { useEffect, useMemo } from 'react';
import SpaceEventList from '@/app/spaces/[spaceid]/components/home/spaceEventList';
import SideNav from '@/app/spaces/[spaceid]/components/home/sideNav';
const SpaceHomePage: React.FC = () => {
  const params = useParams();
  const spaceId = params?.spaceid?.toString() ?? '';

  const { data: spaceData, isLoading } = useGraphQL(
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
    return (spaceData?.events?.edges.map((edge) => edge.node) || []) as Event[];
  }, [spaceData]);

  useEffect(() => {
    if (spaceData) {
      console.log('spaceData', spaceData);
    }
    if (eventsData.length > 0) {
      console.log('eventsData', eventsData);
    }
  }, [spaceData, eventsData]);

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <SpaceSection spaceData={spaceData} isLoading={isLoading} />
        {/* TODO remain old logic code for now, wait for new design */}
        <SpaceEventList eventsData={eventsData} isLoading={isLoading} />
      </div>

      <SideNav spaceData={spaceData} />
    </div>
  );
};

export default SpaceHomePage;
