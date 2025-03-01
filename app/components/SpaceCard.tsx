import { Image, Avatar } from '@heroui/react';
import { useMemo } from 'react';

import { Space } from '@/types';
import {
  ArrowSquareRightIcon,
  CheckCircleIcon,
  UsersIcon,
} from '@/components/icons';
import { Button } from '@/components/base';
import { useCeramicContext } from '@/context/CeramicContext';
import { useRouter } from 'next/navigation';
export function SpaceCardSkeleton() {
  return <div>SpaceCardSkeleton</div>;
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
  const {
    banner,
    name,
    tagline,
    avatar,
    members,
    admins,
    superAdmin,
    category,
  } = data;
  const { profile } = useCeramicContext();
  const router = useRouter();

  const currentUserId = profile?.author?.id;

  const isUserJoined = useMemo(() => {
    return (
      currentUserId &&
      (members?.some((member) => member.id === currentUserId) ||
        admins?.some((admin) => admin.id === currentUserId) ||
        superAdmin?.some((admin) => admin.id === currentUserId))
    );
  }, [currentUserId, members, admins, superAdmin]);

  const formattedMemberCount = useMemo(() => {
    const totalMembers =
      (members?.length || 0) +
      (admins?.length || 0) +
      (superAdmin?.length || 0);
    return formatMemberCount(totalMembers);
  }, [members?.length, admins?.length, superAdmin?.length]);

  return (
    <div className="w-[276px] flex-shrink-0 rounded-[10px] border border-b-w-10 bg-[#262626] overflow-hidden">
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
          {category
            ?.split(',')
            .slice(0, 2)
            .map((item) => (
              <span key={item} className="text-[10px] leading-[1.2] uppercase">
                {item}
              </span>
            ))}
          {category && category.split(',').length > 2 && (
            <span className="text-[10px] leading-[1.2]">
              +{category.split(',').length - 2}
            </span>
          )}
        </div>
        <Button
          startContent={<ArrowSquareRightIcon />}
          className="w-full text-[14px] bg-[#363636]"
          onPress={() => router.push(`/spaces/${data.id}`)}
        >
          View Community
        </Button>
      </div>
    </div>
  );
}
