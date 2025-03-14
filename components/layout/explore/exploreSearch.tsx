import { OutlinedInput, InputAdornment } from '@mui/material';
import { SearchIcon } from '@/components/icons';
import { Broadcast } from '@phosphor-icons/react';
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
  placeholder = "Search",
  leftIcon = <Broadcast size={24} weight={'fill'} format={'Stroke'} />,
  className = "",
}) => {
  return (
    <div className={`flex h-[40px] ${className}`}>
      <div className="w-[40px] h-[40px] flex justify-center items-center opacity-50">
        {leftIcon}
      </div>
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