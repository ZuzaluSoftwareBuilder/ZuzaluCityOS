import { Image, Avatar, Skeleton } from '@heroui/react';
import { useMemo } from 'react';

import { Space } from '@/types';
import {
  ArrowSquareRightIcon,
  CheckCircleIcon,
  UsersIcon,
} from '@/components/icons';
import { Button } from '@/components/base';
import { useRouter } from 'next/navigation';
import useUserJoinSpace from '@/hooks/useUserJoin';

export function SpaceCardSkeleton() {
  return (
    <div className="w-[276px] flex-shrink-0 rounded-[10px] border border-b-w-10 bg-[#262626] overflow-hidden">
      <div className="relative">
        <Skeleton className="rounded-none">
          <div className="w-full h-[108px]"></div>
        </Skeleton>
        <Skeleton className="absolute left-[11px] w-[60px] h-[60px] bottom-[-21px] z-10 rounded-full" />
      </div>
      <div className="p-[10px]">
        <div className="flex items-center gap-[6px] justify-end opacity-50 mb-[7px] h-[18px]">
          <Skeleton className="w-[16px] h-[16px] rounded-full" />
          <Skeleton className="w-[30px] h-[13px] rounded-[4px]" />
        </div>
        <Skeleton className="mb-[6px] rounded-[4px]">
          <div className="h-[21px]"></div>
        </Skeleton>
        <Skeleton className="mb-[20px] rounded-[4px]">
          <div className="h-[42px]"></div>
        </Skeleton>
        <div className="mb-[10px] flex items-center gap-[10px]">
          <Skeleton className="w-[40px] h-[12px] rounded-[4px]" />
          <Skeleton className="w-[40px] h-[12px] rounded-[4px]" />
        </div>
        <Skeleton className="rounded-[8px]">
          <div className="w-full h-[40px]"></div>
        </Skeleton>
      </div>
    </div>
  );
}

const formatMemberCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`.replace('.0k', 'k');
  }
  return count.toString();
};

interface SpaceCardProps {
  data: Space;
}

export function SpaceCard({ data }: SpaceCardProps) {
  const { banner, name, tagline, avatar, tags, id } = data;
  const router = useRouter();
  const { joined: isUserJoined } = useUserJoinSpace({ spaceId: id });

  const formattedMemberCount = useMemo(() => {
    const totalMembers = 1;
    return formatMemberCount(totalMembers);
  }, []);

  return (
    <div className="w-[276px] flex-shrink-0 rounded-[10px] border border-b-w-10 bg-[#262626] overflow-hidden hover:bg-white/5 transition-colors">
      <div className="relative">
        <Image
          src={banner}
          alt={name}
          width="100%"
          height="108px"
          className="object-cover rounded-none"
        />
        <Avatar
          src={avatar}
          alt={name}
          classNames={{
            base: 'absolute left-[11px] w-[60px] h-[60px] bottom-[-21px] z-10 shadow-[0px_0px_0px_1px_rgba(34,34,34,0.10)]',
          }}
        />
        {isUserJoined && (
          <div className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-[4px] border border-b-w-10 bg-[rgba(34,34,34,0.60)] backdrop-filter backdrop-blur-[5px] absolute right-[10px] top-[10px] z-10">
            <CheckCircleIcon size={4} />
            <span className="text-[14px] font-[500]">Joined</span>
          </div>
        )}
      </div>
      <div className="p-[10px]">
        <div className="flex items-center gap-[6px] justify-end opacity-50 mb-[6px]">
          <UsersIcon size={4} />
          <span className="text-[13px] leading-[1.4]">
            {formattedMemberCount}
          </span>
        </div>
        <p className="text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] text-[18px] font-bold leading-[1.2] truncate mb-[6px]">
          {name}
        </p>
        <p className="text-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] text-[13px] leading-[1.6] opacity-60 line-clamp-2 h-[42px] mb-[20px]">
          {tagline}
        </p>
        <div className="mb-[10px] flex items-center gap-[10px] opacity-40">
          {tags?.slice(0, 2).map((item) => (
            <span
              key={item.tag}
              className="text-[10px] leading-[1.2] uppercase"
            >
              {item.tag}
            </span>
          ))}
          {tags && tags.length > 2 && (
            <span className="text-[10px] leading-[1.2]">
              +{tags.length - 2}
            </span>
          )}
        </div>
        <Button
          startContent={<ArrowSquareRightIcon />}
          className="w-full text-[14px] bg-[#363636] py-[6px]"
          onPress={() => router.push(`/spaces/${data.id}`)}
        >
          View Community
        </Button>
      </div>
    </div>
  );
}
