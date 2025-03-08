'use client';

import Link, { LinkProps } from 'next/link';
import { cn } from '@heroui/react';
import { Lock, IconContext, DotOutline } from '@phosphor-icons/react';

export interface ITabItemProps extends Partial<LinkProps> {
  href?: string;
  icon: React.ReactNode;
  label: string;
  /**
   * match url
   */
  isActive: boolean;
  locked?: boolean;
  count?: number;
  onClick?: () => void;
}

const TabItem = ({
  href,
  icon,
  label,
  isActive,
  count,
  locked,
  onClick,
  ...props
}: ITabItemProps) => {
  const commonClassNames = cn(
    'flex items-center w-full h-[30px] px-2.5 gap-2.5 rounded-lg group',
    isActive ? 'bg-[#363636]' : 'bg-transparent',
    'hover:bg-[#2C2C2C]',
    locked && 'cursor-not-allowed',
  );

  const content = (
    <div
      className={cn(
        'flex-1 flex items-center gap-2.5 group-hover:opacity-100',
        isActive ? 'opacity-100' : 'opacity-60',
        locked && 'opacity-30',
      )}
    >
      {icon}
      <span
        className={
          'flex-1 text-[13px] font-medium leading-[18px] text-white truncate'
        }
      >
        {label}
      </span>
      {locked && <Lock size={18} weight={'fill'} format="Stroke" />}
    </div>
  );

  const countDisplay = count && (
    <span className={'font-medium text-[13px] leading-[18px] text-[#7DFFD1]'}>
      {count}
    </span>
  );

  return (
    <IconContext.Provider
      value={{
        size: 20,
        weight: 'fill',
        color: '#ffffff',
        format: 'Stroke',
      }}
    >
      {href ? (
        <Link
          href={href}
          className={commonClassNames}
          onClick={(e) => {
            if (locked) e.preventDefault();
            if (onClick) onClick();
          }}
          {...props}
        >
          {content}
          {countDisplay}
        </Link>
      ) : (
        <div
          className={cn(commonClassNames, 'cursor-pointer')}
          onClick={() => {
            if (!locked && onClick) onClick();
          }}
        >
          {content}
          {countDisplay}
        </div>
      )}
    </IconContext.Provider>
  );
};

export default TabItem;
