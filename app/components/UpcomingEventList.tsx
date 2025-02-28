import { TicketIcon } from '@/components/icons';
import CommonHeader from './CommonHeader';
import { useRouter } from 'next/navigation';

export default function UpcomingEventList() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="Upcoming Events"
        icon={<TicketIcon />}
        description=""
        buttonText="View All Events"
        buttonOnPress={() => router.push('/events')}
      />
      <div className="flex gap-[20px]">
        <div className="flex-1">
          <div>123</div>
        </div>
        <div className="flex-1 w-[280px] pr-[20px]">
          <div>123</div>
        </div>
      </div>
    </div>
  );
}
