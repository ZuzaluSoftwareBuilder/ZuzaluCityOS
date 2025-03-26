import { SpaceCard, SpaceCardSkeleton } from './SpaceCard';
import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { BuildingsIcon } from '@/components/icons';
import { useMemo } from 'react';
import { ScrollShadow } from '@heroui/react';
import { useMediaQuery } from '@/hooks';
import dayjs from '@/utils/dayjs';
import useAllSpaceAndEvent from '@/hooks/useAllSpaceAndEvent';
import useUserSpaceAndEvent from '@/hooks/useUserSpaceAndEvent';

export default function Communities() {
  const router = useRouter();
  const { isMobile } = useMediaQuery();

  const { allSpaces: spacesData, isAllSpaceLoading: isLoading } = useAllSpaceAndEvent()
  const { userJoinedSpaceIds, userFollowedResourceIds } = useUserSpaceAndEvent()

  const filteredSpacesData = useMemo(() => {
    if (!spacesData) {
      return [];
    }
    return spacesData.sort((a, b) => {
      return dayjs(b.createdAt).diff(dayjs(a.createdAt));
    });
  }, [spacesData]);

  return (
    <div className="flex flex-col gap-[10px] border-b border-b-w-10 pb-[20px]">
      <CommonHeader
        title="Communities"
        icon={<BuildingsIcon size={isMobile ? 5 : 6} />}
        description="Newest Communities"
        buttonText="View All Spaces"
        buttonOnPress={() => router.push('/spaces')}
      />
      <ScrollShadow
        visibility="right"
        orientation="horizontal"
        className="flex-1 overflow-auto"
      >
        <div className="flex gap-[20px] overflow-auto px-[20px]">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
              <SpaceCardSkeleton key={index} />
            ))
            : filteredSpacesData?.map((item) => (
              <SpaceCard key={item.id} data={item} isJoined={userJoinedSpaceIds.has(item.id)} isFollowed={userFollowedResourceIds.has(item.id)} />
            ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
