'use client';

import SpaceSidebar from '@/app/spaces/[spaceid]/components/sidebar/spaceSidebar';
import SpaceSubSidebar from '@/app/spaces/[spaceid]/components/sidebar/spaceSubSidebar/spaceSubSidebar';
import { useSelectedLayoutSegments } from 'next/navigation';

const SpaceLayout = () => {
  const segments = useSelectedLayoutSegments();
  const isSettingPage = segments?.includes('setting');

  return (
    <>
      <SpaceSidebar />

      {isSettingPage ? null : (
        <div className="border-r border-[rgba(255,255,255,0.1)] tablet:hidden mobile:hidden">
          <SpaceSubSidebar />
        </div>
      )}
    </>
  );
};

export default SpaceLayout;
