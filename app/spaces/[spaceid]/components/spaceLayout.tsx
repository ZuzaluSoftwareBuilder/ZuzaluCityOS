'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import React from 'react';
import SpaceSidebar from '@/app/spaces/[spaceid]/components/sidebar/spaceSidebar';
import SpaceSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/spaceSubSidebar/spaceSubSidebar';

const SpaceLayout = () => {
  const segments = useSelectedLayoutSegments();
  const isSettingPage = segments.includes('edit');

  return (
    <>
      <SpaceSidebar />

      {isSettingPage ? null : (
        <div className="mobile:hidden tablet:hidden">
          <SpaceSubSidebar />
        </div>
      )}
    </>
  );
};

export default SpaceLayout;
