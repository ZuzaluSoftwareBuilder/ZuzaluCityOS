'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import MainSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/mainSubSidebar';
import React from 'react';
import MainSidebar from '@/app/spaces/[spaceid]/components/sidebar/mainSidebar';

const SpaceLayout = () => {
  const segments = useSelectedLayoutSegments();
  const isSettingPage = segments.includes('edit');

  return (
    <>
      <MainSidebar />

      {isSettingPage ? null : (
        <div className="mobile:hidden tablet:hidden">
          <MainSubSidebar />
        </div>
      )}
    </>
  );
};

export default SpaceLayout;
