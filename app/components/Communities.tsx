import { Button } from '@/components/base';
import SpaceCard from '@/components/cards/SpaceCard';
import { ArrowCircleRightIcon, BuildingsIcon } from '@/components/icons';
import { Space } from '@/types';
import { useRouter } from 'next/navigation';

interface Community {
  data: Space[];
}

export default function Communities({ data }: Community) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10">
      <div className="flex items-center justify-between py-[10px] px-[20px]">
        <div className="flex gap-[10px] items-center">
          <BuildingsIcon />
          <span className="text-[25px] font-[700] leading-[1.2]">
            Communities
          </span>
          <span className="text-[14px] opacity-60">Newest Communities</span>
        </div>
        <Button
          variant="light"
          endContent={<ArrowCircleRightIcon />}
          onPress={() => router.push('/spaces')}
        >
          View All Spaces
        </Button>
      </div>
      <div className="flex gap-[20px] overflow-auto px-[20px]">
        {data.map((item) => (
          <SpaceCard
            id={item.id}
            key={`SpaceCard-${item.id}`}
            logoImage={
              item.avatar !== 'undefined' &&
              item.avatar &&
              !item.avatar.includes('blob')
                ? item.avatar
                : '/1.webp'
            }
            bgImage={
              item.banner !== 'undefined' &&
              item.banner &&
              !item.banner.includes('blob')
                ? item.banner
                : '/5.webp'
            }
            title={item.name}
            description={item.description}
            members={item.members}
            categories={item.category}
            tagline={item.tagline}
          />
        ))}
      </div>
    </div>
  );
}
