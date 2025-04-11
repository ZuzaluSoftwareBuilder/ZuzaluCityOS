import { Chip } from '@mui/material';
import React from 'react';

interface TopicChipProps {
  label: string;
  selected: boolean;
  onClick?: () => void;
}

const TopicChip: React.FC<TopicChipProps> = ({ label, selected, onClick }) => {
  return (
    <Chip
      label={label}
      variant="filled"
      size="small"
      color={selected ? 'primary' : 'secondary'}
      sx={{
        borderRadius: '10px',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: 'primary.dark',
        padding: '4px 8px',
      }}
      onClick={onClick}
    />
  );
};

export default TopicChip;
