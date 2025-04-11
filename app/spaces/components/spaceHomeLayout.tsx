'use client';

import ExploreLayout from '@/components/layout/explore/exploreLayout';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

const SpaceHomeLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const shouldShowSidebar = pathname === '/spaces';

  return (
    <ExploreLayout selected={'Spaces'} showSidebar={shouldShowSidebar}>
      {children}
    </ExploreLayout>
  );
};

export default SpaceHomeLayout;
