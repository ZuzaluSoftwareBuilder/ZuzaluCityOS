import { Button } from '@/components/base';
import SpaceChip from '@/components/biz/space/SpaceChip';
import {
  ArrowSquareRightIcon,
  CheckCircleIcon,
  UsersIcon,
} from '@/components/icons';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { Space } from '@/models/space';
import { Avatar, Image, Skeleton, cn } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function SpaceCardSkeleton({ autoWidth }: { autoWidth?: boolean }) {
  return (
    <div
      className={cn(
        autoWidth ? 'w-full' : 'w-[276px]',
        'flex-shrink-0 rounded-[10px] border border-b-w-10 bg-[#262626] overflow-hidden',
      )}
    >
      <div className="relative">
        <Skeleton className="rounded-none">
          <div className="aspect-[2.5] w-full"></div>
        </Skeleton>
        <Skeleton className="absolute bottom-[-21px] left-[11px] z-10 size-[60px] rounded-full" />
      </div>
      <div className="p-[10px]">
        <div className="mb-[7px] flex h-[18px] items-center justify-end gap-[6px] opacity-50">
          <Skeleton className="size-[16px] rounded-full" />
          <Skeleton className="h-[13px] w-[30px] rounded-[4px]" />
        </div>
        <Skeleton className="mb-[6px] rounded-[4px]">
          <div className="h-[24px] w-[90px]"></div>
        </Skeleton>
        <Skeleton className="mb-[6px] rounded-[4px]">
          <div className="h-[21px]"></div>
        </Skeleton>
        <Skeleton className="mb-[20px] rounded-[4px]">
          <div className="h-[42px]"></div>
        </Skeleton>
        <div className="mb-[10px] flex items-center gap-[10px]">
          <Skeleton className="h-[12px] w-[40px] rounded-[4px]" />
          <Skeleton className="h-[12px] w-[40px] rounded-[4px]" />
        </div>
        <Skeleton className="rounded-[8px]">
          <div className="h-[40px] w-full"></div>
        </Skeleton>
      </div>
    </div>
  );
}

export const formatMemberCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`.replace('.0k', 'k');
  }
  return count.toString();
};

interface SpaceCardProps {
  data: Space;
  isJoined: boolean;
  isFollowed: boolean;
  autoWidth?: boolean;
  showFooter?: boolean;
}

export function SpaceCard({
  data,
  autoWidth,
  isJoined,
  isFollowed,
  showFooter = true,
}: SpaceCardProps) {
  const {
    banner,
    name,
    tagline,
    avatar,
    tags,
    userRoles,
    category,
    isLegacy,
    owner,
  } = data;
  const router = useRouter();
  const { profile } = useAbstractAuthContext();

  const formattedMemberCount = useMemo(() => {
    const totalMembers = userRoles?.length ?? 0;
    return formatMemberCount(totalMembers + 1);
  }, [userRoles]);

  const tagsContent = useMemo(() => {
    const currentTags = isLegacy
      ? (category as string).split(',').map((item) => ({ tag: item }))
      : tags;
    return (
      <>
        {currentTags?.slice(0, 2).map((item) => (
          <span key={item.tag} className="text-[10px] uppercase leading-[1.2]">
            {item.tag}
          </span>
        ))}
        {currentTags && currentTags.length > 2 && (
          <span className="text-[10px] leading-[1.2]">
            +{currentTags.length - 2}
          </span>
        )}
      </>
    );
  }, [tags, category, isLegacy]);

  const isLegacyOwner = useMemo(() => {
    if (!isLegacy) return false;
    // TODO wait supabase update, confirm did of space
    return (owner as unknown as string) === profile?.did;
  }, [isLegacy, owner, profile?.did]);

  const handleClick = useCallback(() => {
    if (isLegacyOwner) {
      router.push(`/spaces/create`);
    } else {
      router.push(`/spaces/${data.id}`);
    }
  }, [isLegacyOwner, router, data.id]);

  return (
    <div
      className={cn(
        autoWidth ? 'w-full' : 'w-[276px]',
        'flex-shrink-0 rounded-[10px] border border-b-w-10 bg-[#262626] overflow-hidden hover:bg-white/5 transition-colors',
      )}
    >
      <div className="relative">
        <Image
          src={banner}
          alt={name}
          width={'100%'}
          height={'100%'}
          className="aspect-[2.5] w-full rounded-none object-cover"
        />
        <Avatar
          src={avatar}
          alt={name}
          icon={null}
          classNames={{
            base: 'absolute left-[11px] w-[60px] h-[60px] bottom-[-21px] z-10 shadow-[0px_0px_0px_1px_rgba(34,34,34,0.10)]',
          }}
        />
        {isJoined && (
          <div className="absolute right-[10px] top-[10px] z-10 flex items-center gap-[5px] rounded-[4px] border border-b-w-10 bg-[rgba(34,34,34,0.60)] px-[10px] py-[5px] backdrop-blur-[5px]">
            <CheckCircleIcon size={4} />
            <span className="text-[14px] font-[500]">
              {isFollowed ? 'Followed' : 'Joined'}
            </span>
          </div>
        )}
      </div>
      <div className="p-[10px]">
        <div className="mb-[6px] flex items-center justify-end gap-[6px] opacity-50">
          <UsersIcon size={4} />
          <span className="text-[13px] leading-[1.4]">
            {formattedMemberCount}
          </span>
        </div>
        <div className="mb-[6px] flex">
          <SpaceChip category={category} iconSize={16} />
        </div>
        <p className=" mb-[6px] truncate text-[18px] font-bold leading-[1.2]">
          {name}
        </p>
        <p className=" mb-[20px] line-clamp-2 h-[42px] text-[13px] leading-[1.6] opacity-60">
          {tagline}
        </p>
        <div className="mb-[10px] flex items-center gap-[10px] opacity-40">
          {tagsContent}
        </div>

        {showFooter && (
          <Button
            startContent={!isLegacy && <ArrowSquareRightIcon />}
            className="w-full bg-[#363636] py-[6px] text-[14px]"
            disabled={isLegacy && !isLegacyOwner}
            onPress={handleClick}
          >
            {!isLegacy
              ? 'View Space'
              : isLegacyOwner
                ? 'Recreate Space'
                : 'Legacy Space'}
          </Button>
        )}
        {!showFooter && (
          <div className="flex h-[40px] w-full items-center gap-[10px] rounded-[8px] bg-[#363636]" />
        )}
      </div>
    </div>
  );
}
