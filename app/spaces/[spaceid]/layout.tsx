import React from 'react';
import type { Metadata } from 'next';
import SpaceLayout from '@/app/spaces/[spaceid]/components/spaceLayout';
import SpaceTopHeader from '@/app/spaces/[spaceid]/components/spaceTopHeader';
import { SpacePermissionProvider } from './components/permission';
import { SpaceDataProvider } from './components/context/spaceData';

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

type Props = {
  params: { spaceid: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const id = params.spaceid;

  return {
    title: 'Zuzalu City',
    description: 'Zuzalu City Powered By Ethereum Community Fund',
    openGraph: {
      images: [`/api/og?id=${id}&type=space`],
    },
  };
};

export default function SpacePageLayout({
  children,
}: SpacePageLayoutPropTypes) {
  return (
    <SpacePermissionProvider>
      <SpaceDataProvider>
        <SpaceTopHeader />
        <div className="flex pc:pl-[62px] tablet:pl-[62px] text-white min-h-[calc(100vh-50px)]">
          <SpaceLayout />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </SpaceDataProvider>
    </SpacePermissionProvider>
  );
}
