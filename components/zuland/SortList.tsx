import React from 'react';
import { Chip, Stack, Box, Typography } from '@mui/material';
import { ClockIcon, SparklesIcon } from '@/components/icons';

interface SortListProps {
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
}

const SortList: React.FC<SortListProps> = ({
  selectedSort,
  setSelectedSort,
}) => {
  return (
    <Stack spacing="10px">
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '160%',
          }}
        >
          Sort by
        </Typography>
        <SortChip
          label="Oldest"
          selected={selectedSort === 'OLDEST'}
          onClick={() => setSelectedSort('OLDEST')}
          icon={<ClockIcon size={5} />}
        />
        <SortChip
          label="New"
          selected={selectedSort === 'NEW'}
          onClick={() => setSelectedSort('NEW')}
          icon={<SparklesIcon size={4} />}
        />
      </Box>
    </Stack>
  );
};

interface SortChipProps {
  icon: React.ReactElement;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const SortChip: React.FC<SortChipProps> = ({
  label,
  selected,
  onClick,
  icon,
}) => {
  return (
    <Chip
      label={label}
      variant="filled"
      size="small"
      color={selected ? 'primary' : 'secondary'}
      icon={icon}
      onClick={onClick}
      sx={{
        borderRadius: '10px',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'primary.dark',
        padding: '4px 8px',
      }}
    />
  );
};

export default SortList;
