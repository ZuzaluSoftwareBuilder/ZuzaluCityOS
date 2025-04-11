import { Input } from '@/components/base';
import { MagnifyingGlass } from '@phosphor-icons/react';
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
    <Input
      value={value}
      placeholder={placeholder}
      onValueChange={onChange}
      className={className}
      classNames={{
        inputWrapper:
          'bg-transparent rounded-[10px] hover:bg-transparent data-[hover=true]:bg-transparent focus-within:bg-transparent data-[focus=true]:bg-transparent group-data-[focus=true]:bg-transparent',
        innerWrapper: 'gap-[4px]',
        input: 'text-[16px] pl-0',
      }}
      startContent={
        <MagnifyingGlass
          weight="light"
          format="Stroke"
          size={20}
          className="opacity-60"
        />
      }
    />
  );
};

export default ExploreSearch;
