import { CloseIcon, SearchIcon } from '@/components/icons';
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Typography,
  Grid,
} from '@mui/material';

import { Stack } from '@mui/material';
import { useState } from 'react';
import { Item } from '.';

// 在组件顶部添加类型定义
type FilterType = 'Dapps' | 'NFTs' | 'DeFi'; // 示例过滤器类型，可根据实际需求扩展

export default function List() {
  // 修改状态类型为FilterType数组
  const [filter, setFilter] = useState<FilterType[]>([]);

  // 添加过滤器切换逻辑
  const toggleFilter = (type: FilterType) => {
    setFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <Stack direction="column" flex={1} p="20px" gap="20px">
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
      <Stack direction="row" gap="10px">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => toggleFilter('Dapps')}
          sx={{
            p: '4px 8px',
            borderRadius: '6px',
            border: '1px solid',
            backgroundColor: filter.includes('Dapps')
              ? 'rgba(255, 255, 255, 0.20)'
              : 'rgba(255, 255, 255, 0.05)',
            borderColor: filter.includes('Dapps')
              ? 'rgba(255, 255, 255, 0.40)'
              : 'rgba(255, 255, 255, 0.10)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '& svg': {
              opacity: 0.5,
            },
            '&:hover svg': {
              opacity: 1,
            },
            pl: filter.includes('Dapps') ? '29px' : '8px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '16px',
              height: '16px',
              opacity: filter.includes('Dapps') ? 1 : 0,
              transition: 'all 0.1s linear',
              left: '8px',
            }}
          >
            <CloseIcon size={4} />
          </Box>
          <Typography
            fontSize={14}
            lineHeight={1.6}
            color="white"
            sx={{
              opacity: 0.8,
            }}
          >
            Dapps
          </Typography>
        </Box>
      </Stack>
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
          <Grid item xl={3} lg={4} md={6} sm={12} xs={24} key={index}>
            <Item />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
