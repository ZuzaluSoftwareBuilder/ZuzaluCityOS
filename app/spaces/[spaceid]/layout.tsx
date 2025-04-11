import SpaceLayout from '@/app/spaces/[spaceid]/components/spaceLayout';
import SpaceTopHeader from '@/app/spaces/[spaceid]/components/spaceTopHeader';
import type { Metadata } from 'next';
import React from 'react';
import { SpaceDataProvider } from './components/context/spaceData';
import { SpacePermissionProvider } from './components/permission';

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

type Props = {
  params: Promise<{ spaceid: string }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
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
        <div className="flex min-h-[calc(100vh-50px)] text-white pc:pl-[62px] tablet:pl-[62px]">
          <SpaceLayout />
          <div className="h-[calc(100vh-50px)] flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </SpaceDataProvider>
    </SpacePermissionProvider>
  );
}
