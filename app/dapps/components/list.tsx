import { GearSixIcon } from '@/components/icons';
import ExploreSearch from '@/components/layout/explore/exploreSearch';
import {
  ResponsiveGrid,
  ResponsiveGridItem,
} from '@/components/layout/explore/responsiveGridItem';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useRepositories } from '@/context/RepositoryContext';
import { Dapp } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { Skeleton } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Item } from '.';
import Filter from './filter';

interface ListProps {
  onDetailClick: (_data: Dapp) => void;
  onOwnedDappsClick: () => void;
}

export default function List({ onDetailClick, onOwnedDappsClick }: ListProps) {
  const { profile } = useAbstractAuthContext();
  const { dappRepository } = useRepositories();
  const userDID = profile?.id;
  const [filter, setFilter] = useState<string[]>([]);
  const [searchVal, setSearchVal] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['GET_DAPP_LIST_QUERY'],
    queryFn: () => dappRepository.getDapps(),
  });

  const { data: legacyDappData, isLoading: legacyDappLoading } = useQuery({
    queryKey: ['GET_LEGACY_DAPP_LIST_QUERY'],
    queryFn: () => supabase.from('betaDapps').select('*'),
    select: (data: any) => {
      if (data.data) {
        return data.data.map((v: any) => ({
          ...v,
          description:
            JSON.stringify({
              content: v.description,
              type: 'doc',
              isEmpty: false,
            }) || '',
          categories: ['Legacy', ...v.categories.split(',')].join(','),
          isLegacy: true,
        }));
      }
      return [];
    },
  });

  const filterData = useMemo(() => {
    const tags = data
      ?.concat(legacyDappData)
      ?.map((dapp) => dapp?.categories?.split(','));
    return [...new Set(tags?.flat())];
  }, [data, legacyDappData]);

  const currentData = useMemo(() => {
    const allData = data?.concat(legacyDappData ?? []);
    if (filter.length === 0 && searchVal === '') {
      return allData;
    }

    let filteredData = allData || [];

    if (searchVal !== '') {
      filteredData = filteredData.filter((dapp) =>
        dapp.appName.toLowerCase().includes(searchVal.toLowerCase()),
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((dapp) => {
        const tags = dapp?.categories.split(',');
        return filter.some((tag) => tags.includes(tag));
      });
    }

    return filteredData;
  }, [data, filter, legacyDappData, searchVal]);

  const ownedDapps = useMemo(() => {
    return data?.filter((dapp) => dapp.profile.author.id === userDID) || [];
  }, [data, userDID]);

  const isAllLoading = isLoading || legacyDappLoading;

  return (
    <div className="flex flex-1 flex-col gap-[20px] p-[20px] mobile:gap-[10px] mobile:p-[20px_10px]">
      <div className="flex items-center gap-[10px] mobile:flex-col">
        {/* {!isMobile && <BroadcastIcon />} */}

        <ExploreSearch
          value={searchVal}
          onChange={setSearchVal}
          placeholder="Search dApps"
          className="mb-[10px]"
        />

        {ownedDapps?.length > 0 && (
          <div
            className={`box-content flex w-[210px] shrink-0 items-center justify-between p-[8px_14px] mobile:w-full ${ownedDapps?.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={() => {
              if (ownedDapps?.length > 0) {
                onOwnedDappsClick();
              }
            }}
          >
            <div className="flex flex-row items-center gap-[10px] opacity-70">
              <GearSixIcon />
              <p className="whitespace-nowrap text-[16px] leading-[1.6] text-white">
                Manage My dApps
              </p>
            </div>
            <p className="text-[13px] text-white opacity-40">
              {ownedDapps?.length || 0}
            </p>
          </div>
        )}
      </div>
      {isAllLoading ? (
        <Skeleton className="h-[30px] w-full rounded-[10px]" />
      ) : (
        <Filter filterData={filterData} onFilterChange={setFilter} />
      )}
      <ResponsiveGrid>
        {isAllLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ResponsiveGridItem key={index}>
                <div className="p-[10px]">
                  <Skeleton className="mb-[20px] aspect-[620/280] h-auto w-full rounded-[10px]" />
                  <Skeleton className="mb-[10px] h-[25px] w-full rounded-[6px]" />
                  <Skeleton className="mb-[10px] h-[36px] w-full rounded-[6px]" />
                  <div className="mb-[20px] flex flex-row gap-[5px]">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton
                        className="h-[18px] w-[56px] rounded-[4px]"
                        key={index}
                      />
                    ))}
                  </div>
                  <Skeleton className="h-[12px] w-full rounded-[4px]" />
                </div>
              </ResponsiveGridItem>
            ))
          : currentData?.map((data, index) => (
              <ResponsiveGridItem key={index}>
                <Item data={data} onClick={() => onDetailClick(data)} />
              </ResponsiveGridItem>
            ))}
      </ResponsiveGrid>
    </div>
  );
}
