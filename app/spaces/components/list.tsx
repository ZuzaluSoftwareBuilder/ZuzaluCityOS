import { Grid } from '@mui/material';
import { useMemo, useState } from 'react';
import { Space } from '@/types';
import { SpaceCard, SpaceCardSkeleton } from '@/components/biz/space/SpaceCard';

import ResponsiveGridItem from '@/components/layout/explore/responsiveGridItem';
import ExploreSearch from '@/components/layout/explore/exploreSearch';
import useUserSpace from '@/hooks/useUserSpace';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_ALL_SPACE_AND_MEMBER_QUERY } from '@/services/graphql/space';
import dayjs from '@/utils/dayjs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';

const SpaceList = () => {
  const [searchVal, setSearchVal] = useState<string>('');

  const { userJoinedSpaceIds, userFollowedSpaceIds } = useUserSpace();

  const { adminRole, memberRole, isRoleLoading } = useBuildInRole();

  const { data: spaces, isLoading } = useGraphQL(
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
      enabled: !!adminRole && !!memberRole,
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
    const sortedData = (spaces || [])
      .sort((a, b) => {
        return dayjs(b.createdAt).diff(dayjs(a.createdAt));
      })
      .concat(legacySpacesData || []);
    if (searchVal === '') {
      return sortedData;
    }
    return sortedData?.filter((space) =>
      space.name.toLowerCase().includes(searchVal.toLowerCase()),
    );
  }, [spaces, legacySpacesData, searchVal]);

  return (
    <div className="flex flex-1 flex-col gap-[20px] p-[20px] mobile:gap-[10px] mobile:p-[20px_10px]">
      <ExploreSearch
        value={searchVal}
        onChange={setSearchVal}
        placeholder="Search Spaces"
        className="mb-[10px]"
      />

      <Grid
        container
        spacing="20px"
        flex={1}
        sx={{
          '& .MuiGrid-item': {
            width: '100%',
            maxWidth: '100%',
          },
          alignContent: 'flex-start',
        }}
      >
        {isLoading || isRoleLoading || isLegacyLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ResponsiveGridItem key={index}>
                <SpaceCardSkeleton autoWidth={true} key={index} />
              </ResponsiveGridItem>
            ))
          : filteredSpacesData?.map((item) => (
              <ResponsiveGridItem key={item.id}>
                <SpaceCard
                  key={item.id}
                  data={item}
                  autoWidth={true}
                  isJoined={userJoinedSpaceIds.has(item.id)}
                  isFollowed={userFollowedSpaceIds.has(item.id)}
                />
              </ResponsiveGridItem>
            ))}
      </Grid>
    </div>
  );
};

export default SpaceList;
