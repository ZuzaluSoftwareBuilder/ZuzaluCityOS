import { ArrowsCounterClockwiseIcon, CloseIcon } from '@/components/icons';
import { Box, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

interface FilterProps {
  filterData: string[];
  onFilterChange: (_filter: string[]) => void;
}

export default function Filter({ filterData, onFilterChange }: FilterProps) {
  const [filter, setFilter] = useState<string[]>([]);

  const toggleFilter = useCallback(
    (type: string) => {
      setFilter((prev) => {
        const newFilter = prev.includes(type)
          ? prev.filter((t) => t !== type)
          : [...prev, type];
        onFilterChange(newFilter);
        return newFilter;
      });
    },
    [onFilterChange],
  );

  const resetFilter = useCallback(() => {
    setFilter([]);
    onFilterChange([]);
  }, [onFilterChange]);

  return (
    <Stack direction={{ xs: 'row' }} gap="10px" flexWrap="wrap">
      <Box
        display="flex"
        alignItems="center"
        gap="5px"
        p="4px 8px"
        sx={{
          opacity: 0.5,
          borderRadius: '6px',
          border: '1px solid #fff',
          cursor: 'pointer',
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={resetFilter}
      >
        <ArrowsCounterClockwiseIcon />
        <Typography
          fontSize={14}
          lineHeight={1.6}
          color="white"
          sx={{ opacity: 0.8 }}
        >
          Reset Filters
        </Typography>
      </Box>
      {filterData.map((item) => {
        const isActive = filter.includes(item);
        return (
          <Box
            key={item}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => toggleFilter(item)}
            sx={{
              p: '4px 8px',
              borderRadius: '6px',
              border: '1px solid',
              backgroundColor: isActive
                ? 'rgba(255, 255, 255, 0.20)'
                : 'rgba(255, 255, 255, 0.05)',
              borderColor: isActive
                ? 'rgba(255, 255, 255, 0.40)'
                : 'rgba(255, 255, 255, 0.10)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '& svg': {
                opacity: 1,
              },
              '& p': {
                opacity: isActive ? 1 : 0.8,
              },
              '&:hover p': {
                opacity: 1,
              },
              pr: isActive ? '29px' : '8px',
            }}
          >
            <Typography fontSize={14} lineHeight={1.6} color="white">
              {item}
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                opacity: isActive ? 1 : 0,
                transition: 'all 0.1s linear',
                right: '8px',
              }}
            >
              <CloseIcon size={4} />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
