'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import MainSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/mainSubSidebar';
import React from 'react';
import MainSidebar from '@/app/spaces/[spaceid]/components/sidebar/mainSidebar';
import SettingSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/subSidebar/settingSubSidebar';

const SpaceLayout = () => {
  const segments = useSelectedLayoutSegments();
  const isSettingPage = segments.includes('edit');

  return (
    <>
      <MainSidebar />

      {isSettingPage ? <SettingSubSidebar /> : <MainSubSidebar />}
    </>
  );
};

export default SpaceLayout;
