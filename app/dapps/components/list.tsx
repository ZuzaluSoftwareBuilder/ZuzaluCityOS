import { GearSixIcon, SearchIcon } from '@/components/icons';
import {
  InputAdornment,
  OutlinedInput,
  Grid,
  useTheme,
  useMediaQuery,
  Skeleton,
  Typography,
} from '@mui/material';

import { Stack } from '@mui/material';
import { useState, useMemo } from 'react';
import { Item } from '.';
import Filter from './filter';
import { Dapp } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { GET_DAPP_LIST_QUERY } from '@/services/graphql/dApp';
import { useGraphQL } from '@/hooks/useGraphQL';
import ResponsiveGridItem from '@/components/layout/explore/responsiveGridItem';

interface ListProps {
  onDetailClick: (data: Dapp) => void;
  onOwnedDappsClick: () => void;
}

export default function List({ onDetailClick, onOwnedDappsClick }: ListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { ceramic } = useCeramicContext();
  const userDID = ceramic.did?.parent;
  const [filter, setFilter] = useState<string[]>([]);
  const [searchVal, setSearchVal] = useState<string>('');

  const { data, isLoading } = useGraphQL(
    ['GET_DAPP_LIST_QUERY'],
    GET_DAPP_LIST_QUERY,
    {
      first: 100,
    },
    {
      select: (data) => {
        if (data.data.zucityDappInfoIndex?.edges) {
          return data.data.zucityDappInfoIndex.edges.map(
            (edge: any) => edge.node,
          );
        }
        return [];
      },
    },
  );

  const filterData = useMemo(() => {
    const tags = data?.map((dapp) => dapp.categories.split(','));
    return [...new Set(tags?.flat())];
  }, [data]);

  const currentData = useMemo(() => {
    if (filter.length === 0 && searchVal === '') {
      return data;
    }

    let filteredData = data || [];

    if (searchVal !== '') {
      filteredData = filteredData.filter((dapp) =>
        dapp.appName.toLowerCase().includes(searchVal.toLowerCase()),
      );
    }

    if (filter.length > 0) {
      filteredData = filteredData.filter((dapp) => {
        const tags = dapp.categories.split(',');
        return filter.some((tag) => tags.includes(tag));
      });
    }

    return filteredData;
  }, [data, filter, searchVal]);

  const ownedDapps = useMemo(() => {
    return data?.filter((dapp) => dapp.profile.author.id === userDID) || [];
  }, [data, userDID]);

  return (
    <Stack
      direction="column"
      flex={1}
      p={isMobile ? '20px 10px' : '20px'}
      gap={isMobile ? '10px' : '20px'}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        gap="10px"
        alignItems="center"
      >
        {/* {!isMobile && <BroadcastIcon />} */}
        <OutlinedInput
          placeholder="Search dApps"
          sx={{
            backgroundColor: 'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
            p: '12px 14px',
            borderRadius: '10px',
            height: '40px',
            width: '100%',
            border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
            opacity: 0.7,
            color: 'white',
            fontSize: '16px',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          onChange={(e) => setSearchVal(e.target.value)}
          startAdornment={
            <InputAdornment position="start" sx={{ opacity: 0.6 }}>
              <SearchIcon />
            </InputAdornment>
          }
        />
        {ownedDapps?.length > 0 && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width={isMobile ? '100%' : '210px'}
            flexShrink={0}
            p="8px 14px"
            boxSizing="content-box"
            sx={{ cursor: ownedDapps?.length > 0 ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (ownedDapps?.length > 0) {
                onOwnedDappsClick();
              }
            }}
          >
            <Stack
              direction="row"
              gap="10px"
              alignItems="center"
              sx={{ opacity: 0.7 }}
            >
              <GearSixIcon />
              <Typography
                fontSize={16}
                lineHeight={1.6}
                color="white"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Manage My dApps
              </Typography>
            </Stack>
            <Typography fontSize={13} color="white" sx={{ opacity: 0.4 }}>
              {ownedDapps?.length || 0}
            </Typography>
          </Stack>
        )}
      </Stack>
      {isLoading ? (
        <Skeleton variant="rounded" height="30px" width="100%" />
      ) : (
        <Filter filterData={filterData} onFilterChange={setFilter} />
      )}
      <Grid
        container
        spacing="20px"
        flex={1}
        sx={{
          '& .MuiGrid-item': {
            width: '100%',
            maxWidth: '100%',
          },
          alignContent: 'flex-start'
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ResponsiveGridItem key={index}>
                <Stack p="10px">
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height="auto"
                    sx={{ aspectRatio: '620/280', mb: '20px' }}
                  />
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height="25px"
                    sx={{ mb: '10px' }}
                  />
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height="36px"
                    sx={{ mb: '10px' }}
                  />
                  <Stack direction="row" gap="5px" mb="20px">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton
                        variant="rounded"
                        width="56px"
                        height="18px"
                        key={index}
                      />
                    ))}
                  </Stack>
                  <Skeleton variant="rounded" width="100%" height="12px" />
                </Stack>
              </ResponsiveGridItem>
            ))
          : currentData?.map((data, index) => (
              <ResponsiveGridItem key={index}>
                <Item data={data} onClick={() => onDetailClick(data)} />
              </ResponsiveGridItem>
            ))}
      </Grid>
    </Stack>
  );
}
