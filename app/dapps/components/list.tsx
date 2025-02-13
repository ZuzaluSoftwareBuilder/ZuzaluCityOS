import { BroadcastIcon, SearchIcon } from '@/components/icons';
import { InputAdornment, OutlinedInput, Grid } from '@mui/material';

import { Stack } from '@mui/material';
import { useState, useCallback } from 'react';
import { Item } from '.';
import Filter from './filter';

export default function List() {
  const [filterData, setFilterData] = useState<string[]>([
    'Dapps',
    'NFTs',
    'DeFi',
  ]);
  const [filter, setFilter] = useState<string[]>([]);

  return (
    <Stack direction="column" flex={1} p="20px" gap="20px">
      <Stack direction="row" gap="8px" alignItems="center">
        <BroadcastIcon />
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
      <Filter filterData={filterData} onFilterChange={setFilter} />
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
        {Array.from({ length: 10 }).map((_, index) => (
          <Grid item xl={3} lg={4} md={6} sm={12} xs={24} gap={20} key={index}>
            <Item />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
