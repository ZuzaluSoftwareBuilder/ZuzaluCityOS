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
import { useQuery } from '@tanstack/react-query';
import { Dapp } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';

interface ListProps {
  onDetailClick: (data: Dapp) => void;
  onOwnedDappsClick: () => void;
}

export default function List({ onDetailClick, onOwnedDappsClick }: ListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { composeClient, ceramic } = useCeramicContext();
  const userDID = ceramic.did?.parent;

  const [filter, setFilter] = useState<string[]>([]);
  const [searchVal, setSearchVal] = useState<string>('');

  const { data, isLoading } = useQuery<Dapp[]>({
    queryKey: ['getDappInfoList'],
    queryFn: async () => {
      const response: any = await composeClient.executeQuery(`
      query {
        zucityDappInfoIndex(first: 100) {
          edges {
            node {
              id
              appName
              tagline
              developerName
              description
              bannerUrl
              categories
              devStatus
              openSource
              repositoryUrl
              appUrl
              websiteUrl
              docsUrl
              profile {
                author {
                  id
                }
              }
            }
          }
        }
      }
    `);

      if (response && response.data && 'zucityDappInfoIndex' in response.data) {
        return response.data.zucityDappInfoIndex.edges.map(
          (edge: any) => edge.node,
        );
      }
      return [];
    },
  });

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

  console.log(ownedDapps);

  return (
    <Stack
      direction="column"
      flex={1}
      p={isMobile ? '20px 10px' : '20px'}
      gap="20px"
    >
      <Stack direction="row" gap="10px" alignItems="center">
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="260px"
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
          <Typography
            fontSize={13}
            lineHeight={1.4}
            color="white"
            sx={{ opacity: 0.4 }}
          >
            {ownedDapps?.length || 0}
          </Typography>
        </Stack>
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
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid
                item
                xl={3}
                lg={4}
                md={6}
                sm={12}
                xs={24}
                gap={20}
                key={index}
              >
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
              </Grid>
            ))
          : currentData?.map((data, index) => (
              <Grid
                item
                xl={3}
                lg={4}
                md={6}
                sm={12}
                xs={24}
                gap={20}
                key={index}
              >
                <Item data={data} onClick={() => onDetailClick(data)} />
              </Grid>
            ))}
      </Grid>
    </Stack>
  );
}
