import { SpaceCard, SpaceCardSkeleton } from './SpaceCard';
import { Space, SpaceData } from '@/types';
import { useRouter } from 'next/navigation';
import CommonHeader from './CommonHeader';
import { BuildingsIcon } from '@/components/icons';
import { getSpacesQuery } from '@/services/space';
import { useCeramicContext } from '@/context/CeramicContext';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ScrollShadow } from '@heroui/react';
import { useMediaQuery } from '@/hooks';

export default function Communities() {
  const router = useRouter();
  const { composeClient } = useCeramicContext();
  const { isMobile } = useMediaQuery();

  const { data: spacesData, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      try {
        const response: any = await composeClient.executeQuery(getSpacesQuery);
        if ('zucitySpaceIndex' in response.data) {
          const spaceData: SpaceData = response.data as SpaceData;
          const spaces = spaceData.zucitySpaceIndex.edges.map(
            (edge) => edge.node,
          );

          return spaces;
        } else {
          console.error('Invalid data structure:', response.data);
          return [];
        }
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        throw error;
      }
    },
  });

  const filteredSpacesData = useMemo(() => {
    const getCreatedTime = (space: Space): number | null => {
      if (!space.customAttributes?.length) return null;

      for (const attr of space.customAttributes) {
        if (!attr || !('tbd' in attr)) continue;

        try {
          const parsedAttr = JSON.parse(attr.tbd);
          if (parsedAttr.key === 'createdTime' && parsedAttr.value) {
            return new Date(parsedAttr.value).getTime();
          }
        } catch {
          // do nothing
        }
      }
      return null;
    };

    return spacesData?.sort((a, b) => {
      const timeA = getCreatedTime(a);
      const timeB = getCreatedTime(b);

      if (timeA && timeB) return timeB - timeA;
      if (timeA) return -1;
      if (timeB) return 1;
      return 0;
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
                <SpaceCard key={item.id} data={item} />
              ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
