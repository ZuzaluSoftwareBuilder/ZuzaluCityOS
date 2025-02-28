import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { CaretDoubleRightIcon } from '@/components/icons';
import { Event } from '@/types';
import { SmallEventCard, SmallEventCardSkeleton } from './SmallEventCard';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';

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

const filterOngoingEvents = (events: Event[]) => {
  return events
    .filter((event) => {
      const now = dayjs();
      const startTime = dayjs(event.startTime);
      const endTime = dayjs(event.endTime);
      return now.isSameOrAfter(startTime) && now.isSameOrBefore(endTime);
    })
    .sort((a, b) => {
      const aEndTime = dayjs(a.endTime);
      const bEndTime = dayjs(b.endTime);
      return aEndTime.isBefore(bEndTime) ? -1 : 1;
    });
};

interface OngoingEventListProps {
  data: Event[];
}

export default function OngoingEventList({ data }: OngoingEventListProps) {
  const router = useRouter();
  const ongoingEvents = filterOngoingEvents(data);
  const dateRangeDescription = getDateRangeDescription(ongoingEvents);

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
        {ongoingEvents.length > 0
          ? ongoingEvents.map((event) => (
              <SmallEventCard key={event.id} data={event} />
            ))
          : Array.from({ length: 6 }).map((_, index) => (
              <SmallEventCardSkeleton key={index} />
            ))}
      </div>
    </div>
  );
}
