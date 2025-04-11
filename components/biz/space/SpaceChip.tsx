import { Categories } from '@/app/spaces/create/components/constant';
import { cn } from '@heroui/react';
import React, { ReactNode, useMemo } from 'react';

export interface ISpaceChipProps {
  category?: string;
  icon?: ReactNode;
  iconSize?: number;
  classNames?: {
    base?: string;
    label?: string;
  };
}

const SpaceChip = ({
  category,
  icon,
  iconSize,
  classNames,
}: ISpaceChipProps) => {
  const categoryInfo = useMemo(
    () => Categories.find((c) => c.value === category),
    [category],
  );
  const displayIcon = React.cloneElement(
    categoryInfo ? categoryInfo.icon : Categories[0].icon,
    {
      size: iconSize || 20,
      weight: 'fill',
    },
  );
  const displayLabel = categoryInfo ? categoryInfo.label : Categories[0].label;

  return (
    <div
      className={cn(
        'flex items-center h-[24px] bg-white/[0.05] rounded-[4px] px-[4px] gap-[5px]',
        classNames?.base || '',
      )}
    >
      {icon || displayIcon}
      <span
        className={cn(
          'text-[10px] leading-[1.2] text-white',
          classNames?.label || '',
        )}
      >
        {displayLabel}
      </span>
    </div>
  );
};

export default SpaceChip;
