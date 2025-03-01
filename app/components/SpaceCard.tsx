import { Image, Avatar } from '@heroui/react';

import { Space } from '@/types';
import {
  ArrowSquareRightIcon,
  CheckCircleIcon,
  UsersIcon,
} from '@/components/icons';
import { Button } from '@/components/base';

export function SpaceCardSkeleton() {
  return <div>SpaceCardSkeleton</div>;
}

interface SpaceCardProps {
  data: Space;
}

export function SpaceCard({ data }: SpaceCardProps) {
  console.log(data);
  return (
    <div className="w-[276px] flex-shrink-0 rounded-[10px] border border-b-w-10 bg-[#262626] overflow-hidden">
      <div className="relative">
        <Image
          src={data.banner}
          alt={data.name}
          width="100%"
          height="108px"
          className="object-cover rounded-none"
        />
        <Avatar
          src={data.avatar}
          alt={data.name}
          classNames={{
            base: 'absolute left-[11px] w-[60px] h-[60px] bottom-[-21px] z-10 shadow-[0px_0px_0px_1px_rgba(34,34,34,0.10)]',
          }}
        />
        <div className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[4px] border border-b-w-10 bg-[rgba(34,34,34,0.60)] backdrop-filter backdrop-blur-[5px] absolute right-[10px] top-[10px] z-10">
          <CheckCircleIcon size={4} />
          <span className="text-[14px] font-[500]">Joined</span>
        </div>
      </div>
      <div className="p-[10px]">
        <div className="flex items-center gap-[6px] justify-end opacity-50 mb-[6px]">
          <UsersIcon size={4} />
          <span className="text-[13px] leading-[1.4]">1.4k</span>
        </div>
        <p className="text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] text-[18px] font-bold leading-[1.2] truncate mb-[6px]">
          {data.name}
        </p>
        <p className="text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] text-[13px] leading-[1.6] opacity-60 line-clamp-2 h-[42px] mb-[33px]">
          {data.tagline}
        </p>
        <div className="mb-[10px] flex items-center"></div>
        <Button
          startContent={<ArrowSquareRightIcon />}
          className="w-full text-[14px] bg-[#363636]"
        >
          View Community
        </Button>
      </div>
    </div>
  );
}
