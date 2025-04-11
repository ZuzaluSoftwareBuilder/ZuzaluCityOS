'use client';

import { Sidebar } from '@/components/layout';
import * as React from 'react';
import { PropsWithChildren } from 'react';

export interface IExploreLayoutProps {
  selected: string;
  showSidebar?: boolean;
}

const ExploreLayout: React.FC<PropsWithChildren<IExploreLayoutProps>> = ({
  children,
  selected,
  showSidebar = true,
}) => {
  return (
    <div className="flex min-h-[calc(100vh-50px)] bg-[#222222]">
      <div className="block tablet:hidden mobile:hidden">
        {showSidebar && <Sidebar selected={selected} />}
      </div>

      <div className="flex w-full flex-1 flex-col">{children}</div>
    </div>
  );
};

export default ExploreLayout;
