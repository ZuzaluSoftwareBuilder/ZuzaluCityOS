import { Box } from '@mui/material';
import React from 'react';
import type { Metadata } from 'next';
import SpaceLayoutSidebar from './components/SpaceSidebar/sidebar';
import NewSubSidebar from './components/SpaceSidebar/subSidebar';
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
    <Box
      sx={{ color: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '62px' }}
      minHeight={'calc(100vh - 50px)'}
    >
      <SpaceLayoutSidebar />
      <NewSubSidebar />
      <div className='flex-1 overflow-auto'>
        {children}
      </div>
    </Box>
  );
}
