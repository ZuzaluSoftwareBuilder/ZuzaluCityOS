import { SpaceCard, SpaceCardSkeleton } from '@/components/biz';
import { BuildingsIcon } from '@/components/icons';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useMediaQuery } from '@/hooks';
import { useGraphQL } from '@/hooks/useGraphQL';
import useUserSpace from '@/hooks/useUserSpace';
import { GET_ALL_SPACE_AND_MEMBER_QUERY } from '@/services/graphql/space';
import { Space } from '@/types';
import dayjs from '@/utils/dayjs';
import { supabase } from '@/utils/supabase/client';
import { ScrollShadow } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import CommonHeader from './CommonHeader';

export default function Communities() {
  const router = useRouter();
  const { isMobile } = useMediaQuery();

  const { userJoinedSpaceIds, userFollowedSpaceIds } = useUserSpace();
  const { adminRole, memberRole, isRoleLoading } = useBuildInRole();

  const { data: spacesData, isLoading } = useGraphQL(
    ['GET_ALL_SPACE_AND_MEMBER_QUERY'],
    GET_ALL_SPACE_AND_MEMBER_QUERY,
    {
      first: 100,
      userRolesFilters: {
        where: {
          roleId: {
            in: [adminRole, memberRole].map((role) => role?.id ?? ''),
          },
        },
      },
    },
    {
      select: (data) => {
        if (!data?.data?.zucitySpaceIndex?.edges) {
          return [];
        }
        return data.data.zucitySpaceIndex.edges.map(
          (edge) => edge!.node,
        ) as Space[];
      },
    },
  );

  const { data: legacySpacesData, isLoading: isLegacyLoading } = useQuery({
    queryKey: ['GET_LEGACY_SPACES_DATA'],
    queryFn: () => {
      return supabase.from('betaSpaces').select('*');
    },
    select: (data: any) => {
      if (!data.data) {
        return [];
      }
      return data.data.map((item: any) => ({
        ...item,
        isLegacy: true,
      })) as Space[];
    },
  });

  const filteredSpacesData = useMemo(() => {
    if (!spacesData || !legacySpacesData) {
      return [];
    }
    return spacesData
      .sort((a, b) => {
        return dayjs(b.createdAt).diff(dayjs(a.createdAt));
      })
      .concat(legacySpacesData);
  }, [spacesData, legacySpacesData]);

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
          {isLoading || isRoleLoading || isLegacyLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SpaceCardSkeleton key={index} />
              ))
            : filteredSpacesData?.map((item) => (
                <SpaceCard
                  key={item.id}
                  data={item}
                  isJoined={userJoinedSpaceIds.has(item.id)}
                  isFollowed={userFollowedSpaceIds.has(item.id)}
                />
              ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
