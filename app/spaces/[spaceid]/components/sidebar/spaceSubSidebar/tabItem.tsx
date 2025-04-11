'use client';

import { cn } from '@heroui/react';
import { IconContext, Lock } from '@phosphor-icons/react';
import Link, { LinkProps } from 'next/link';

export interface ITabItemProps extends Partial<LinkProps> {
  href?: string;
  icon: React.ReactNode;
  label: string;
  /**
   * match url
   */
  isActive: boolean;
  /**
   * default height is 30px
   */
  height?: number;
  locked?: boolean;
  hideLockIcon?: boolean;
  count?: number;
  isSubTab?: boolean;
  onClick?: () => void;
}

const TabItem = ({
  href,
  icon,
  label,
  height,
  isActive,
  count,
  locked,
  hideLockIcon,
  onClick,
  isSubTab,
  ...props
}: ITabItemProps) => {
  const commonClassNames = cn(
    `flex items-center w-full px-2.5 gap-2.5 rounded-lg group`,
    isActive ? 'bg-[#363636]' : 'bg-transparent',
    locked ? 'cursor-not-allowed' : 'cursor-pointer',
    isSubTab
      ? 'opacity-50 hover:bg-[rgba(255,255,255,0.1)]'
      : locked
        ? 'hover:bg-[#363636]'
        : 'hover:bg-[#2C2C2C]',
  );

  const content = (
    <div
      className={cn(
        'flex-1 flex items-center gap-2.5 rounded-lg py-[5px]',
        isActive ? 'opacity-100' : 'opacity-65',
        locked
          ? isSubTab
            ? 'opacity-100'
            : 'opacity-30 group-hover:opacity-60'
          : 'group-hover:opacity-100',
      )}
    >
      {icon}
      <span
        className={
          'flex-1 truncate text-[13px] font-medium leading-[18px] text-white'
        }
      >
        {label}
      </span>
    </div>
  );

  const lockDisplay = locked && !hideLockIcon && (
    <Lock size={18} weight={'fill'} format="Stroke" className="opacity-80" />
  );

  const countDisplay = !!count && (
    <span className={'text-[13px] font-medium leading-[18px] text-[#7DFFD1]'}>
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
          style={{ height: `${height || 30}px` }}
          onClick={(e) => {
            if (locked) e.preventDefault();
            if (onClick) onClick();
          }}
          {...props}
        >
          {content}
          {lockDisplay}
          {countDisplay}
        </Link>
      ) : (
        <div
          className={commonClassNames}
          style={{ height: `${height || 30}px` }}
          onClick={() => {
            if (!locked && onClick) onClick();
          }}
        >
          {content}
          {lockDisplay}
          {countDisplay}
        </div>
      )}
    </IconContext.Provider>
  );
};

export default TabItem;
