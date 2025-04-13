import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  gap = 20,
  className = '',
  ...rest
}) => {
  const gapClass = gap ? `gap-[${gap}px]` : '';

  return (
    <div
      className={`grid w-full grid-cols-1 content-start ${gapClass} pc:grid-cols-3 tablet:grid-cols-2 [@media(min-width:1445px)]:grid-cols-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

interface ResponsiveGridItemProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`} {...rest}>
      {children}
    </div>
  );
};
