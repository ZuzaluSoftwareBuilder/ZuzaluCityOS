import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { CaretDoubleRightIcon } from '@/components/icons';
import { Event } from '@/types';
import { SmallEventCard, SmallEventCardSkeleton } from './SmallEventCard';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';

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

  const startMonth = earliestStart.format('MMMM');
  const endMonth = latestEnd.format('MMMM');

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

export default function OngoingEventList() {
  const router = useRouter();
  const { composeClient } = useCeramicContext();

  const { data: ongoingCeramicEvents, isLoading } = useQuery({
    queryKey: ['ongoingEvents'],
    queryFn: async () => {
      try {
        const today = dayjs();
        const todayStart = today.format('YYYY-MM-DD') + 'T00:00:00Z';
        const getOngoingEvents_QUERY = `
          query {
            zucityEventIndex(
              filters: {
                where: {
                  startTime: { lessThanOrEqualTo: "${todayStart}" },
                  endTime: { greaterThanOrEqualTo: "${todayStart}" }
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
          getOngoingEvents_QUERY,
        );

        if (response?.data?.zucityEventIndex) {
          return response.data.zucityEventIndex.edges.map((edge: any) => ({
            ...edge.node,
            source: 'ceramic',
          }));
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
        icon={<CaretDoubleRightIcon />}
        description={dateRangeDescription}
        buttonText="View All On-Going"
        buttonOnPress={() => router.push('/events')}
      />
      <div className="flex gap-[20px] overflow-auto px-[20px] cursor-pointer">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SmallEventCardSkeleton key={index} />
            ))
          : ongoingEvents.map((event) => (
              <SmallEventCard key={event.id} data={event} />
            ))}
      </div>
    </div>
  );
}
