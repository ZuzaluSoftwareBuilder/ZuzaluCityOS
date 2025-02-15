import { BroadcastIcon, SearchIcon } from '@/components/icons';
import {
  InputAdornment,
  OutlinedInput,
  Grid,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';

import { Stack } from '@mui/material';
import { useState, useCallback, useMemo } from 'react';
import { Item } from '.';
import Filter from './filter';
import { useQuery } from '@tanstack/react-query';
import { Dapp } from '@/types';
import { DAPP_TAGS } from '@/constant';

interface ListProps {
  onDetailClick: () => void;
}

const mockData = {
  appName: 'Mock Dapp',
  developerName: 'Mock Developer',
  description: JSON.stringify({
    time: Date.now(),
    blocks: [
      {
        id: 'mockBlock1',
        type: 'paragraph',
        data: {
          text: 'This is a mock description for the dapp.',
        },
      },
    ],
    version: '2.27.2',
  }),
  bannerUrl:
    'https://images.wsj.net/im-43460061?width=608&height=405&pixel_ratio=2',
  categories:
    'Defi,Gaming,Defi,Gaming,Defi,Gaming,Defi,Gaming,Defi,Gaming,Defi,GamingDefi,Gaming,Defi,Gaming,Defi,Gaming',
  developmentStatus: '1',
  openSource: true,
  repositoryUrl: 'https://github.com/mock/repository',
  appUrl: 'https://mockapp.com',
  websiteUrl: 'https://mockwebsite.com',
  docsUrl: 'https://docs.mockapp.com',
};

export default function List({ onDetailClick }: ListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filter, setFilter] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['getDapps'],
    queryFn: async () => {
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(Array.from({ length: 10 }, () => mockData));
        }, 2000);
      });
      return res as Dapp[];
    },
  });

  const filterData = useMemo(() => {
    // const tags = data?.map((dapp) => dapp.categories.split(','));
    return DAPP_TAGS.map((tag) => tag.label);
  }, [data]);

  const currentData = useMemo(() => {
    if (filter.length === 0) {
      return data;
    }
    return data?.filter((dapp) => {
      const tags = dapp.categories.split(',');
      return filter.some((tag) => tags.includes(tag));
    });
  }, [data, filter]);

  return (
    <Stack
      direction="column"
      flex={1}
      p={isMobile ? '20px 10px' : '20px'}
      gap="20px"
    >
      <Stack direction="row" gap="8px" alignItems="center">
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
          // onChange={(e) => setSearchVal(e.target.value)}
          startAdornment={
            <InputAdornment position="start" sx={{ opacity: 0.6 }}>
              <SearchIcon />
            </InputAdornment>
          }
        />
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
          : currentData?.map((_, index) => (
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
                <Item onClick={onDetailClick} />
              </Grid>
            ))}
      </Grid>
    </Stack>
  );
}
