import { SpaceCard } from './SpaceCard';
import { Space } from '@/types';
import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { BuildingsIcon } from '@/components/icons';
interface Community {
  data: Space[];
}

export default function Communities({ data }: Community) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="Communities"
        icon={<BuildingsIcon />}
        description="Newest Communities"
        buttonText="View All Spaces"
        buttonOnPress={() => router.push('/spaces')}
      />
      <div className="flex gap-[20px] overflow-auto px-[20px]">
        {data.map((item) => (
          <SpaceCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
