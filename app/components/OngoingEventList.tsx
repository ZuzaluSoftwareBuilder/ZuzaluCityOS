import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { CaretDoubleRightIcon } from '@/components/icons';
import { Event } from '@/types';
import { SmallEventCard, SmallEventCardSkeleton } from './SmallEventCard';

interface OngoingEventListProps {
  data: Event[];
}

export default function OngoingEventList({ data }: OngoingEventListProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="On-Going Events"
        icon={<CaretDoubleRightIcon />}
        description="February - March 2025"
        buttonText="View All Events"
        buttonOnPress={() => router.push('/events')}
      />
      <div className="flex gap-[20px] overflow-auto px-[20px] cursor-pointer">
        {data.length > 0
          ? data.map((event) => <SmallEventCard key={event.id} data={event} />)
          : Array.from({ length: 6 }).map((_, index) => (
              <SmallEventCardSkeleton key={index} />
            ))}
      </div>
    </div>
  );
}
