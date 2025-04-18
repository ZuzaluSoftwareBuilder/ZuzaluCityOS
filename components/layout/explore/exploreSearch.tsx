import { SearchIcon } from '@/components/icons';
import { InputAdornment, OutlinedInput } from '@mui/material';
import React from 'react';

interface IExploreSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  className?: string;
}

const ExploreSearch: React.FC<IExploreSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
}) => {
  return (
    <div className={`flex h-[40px] ${className}`}>
      <OutlinedInput
        value={value}
        placeholder={placeholder}
        sx={{
          background: 'transparent',
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
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start" sx={{ opacity: 0.6 }}>
            <SearchIcon />
          </InputAdornment>
        }
      />
    </div>
  );
};

export default ExploreSearch;
