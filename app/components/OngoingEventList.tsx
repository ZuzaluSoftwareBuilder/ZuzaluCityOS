import { CaretDoubleRightIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { ONGOING_EVENTS_QUERY } from '@/graphql/eventQueries';
import { useMediaQuery } from '@/hooks';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { ScrollShadow } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { SmallEventCard, SmallEventCardSkeleton } from './SmallEventCard';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

const getDateRangeDescription = (events: Event[]) => {
  if (events.length === 0) return '';

  const startTimes = events.map((event) => dayjs(event.startTime));
  const endTimes = events.map((event) => dayjs(event.endTime));

  const earliestStart = dayjs.min(startTimes);
  const latestEnd = dayjs.max(endTimes);

  if (!earliestStart || !latestEnd) return '';

  const startYear = earliestStart.year();
  const endYear = latestEnd.year();

  const startMonth = earliestStart.format('MMM');
  const endMonth = latestEnd.format('MMM');

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

export default function OngoingEventList() {
  const router = useRouter();
  const { composeClient } = useCeramicContext();
  const { isMobile } = useMediaQuery();

  const { data: ongoingCeramicEvents, isLoading } = useQuery({
    queryKey: ['ongoingEvents'],
    queryFn: async () => {
      try {
        const today = dayjs();
        const todayStart = today.format('YYYY-MM-DD') + 'T00:00:00Z';

        const response: any = await composeClient.executeQuery(
          ONGOING_EVENTS_QUERY,
          {
            referenceTime: todayStart,
          },
        );

        if (response?.data?.zucityEventIndex) {
          const events = response.data.zucityEventIndex.edges.map(
            (edge: any) => ({
              ...edge.node,
              source: 'ceramic',
            }),
          ) as Event[];
          const eventIds = events.map((event) => event.id);
          const { data } = await supabase
            .from('locations')
            .select('*')
            .in('eventId', eventIds);
          data?.forEach((location: any) => {
            const event = events.find((event) => event.id === location.eventId);
            if (event) {
              event.location = location.name;
            }
          });
          return events;
        }
        return [];
      } catch (error) {
        console.error('Error fetching ongoing events:', error);
        return [];
      }
    },
  });

  const ongoingEvents = [...(ongoingCeramicEvents || [])];
  const dateRangeDescription = getDateRangeDescription(ongoingEvents);

  if (!isLoading && ongoingEvents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="On-Going Events"
        icon={<CaretDoubleRightIcon size={isMobile ? 5 : 6} />}
        description={dateRangeDescription}
        buttonText="View All On-Going"
        buttonOnPress={() => router.push('/events')}
      />
      <ScrollShadow
        visibility="right"
        orientation="horizontal"
        size={80}
        className="flex-1 overflow-auto"
      >
        <div className="flex gap-[20px] overflow-auto px-[20px]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SmallEventCardSkeleton key={index} />
              ))
            : ongoingEvents.map((event) => (
                <SmallEventCard key={event.id} data={event} />
              ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
