'use client';

import { Sidebar } from '@/components/layout';
import { Stack } from '@mui/material';
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
    <Stack
      direction="row"
      sx={{ backgroundColor: '#222222', minHeight: 'calc(100vh - 50px)' }}
    >
      <div className="block tablet:hidden mobile:hidden">
        {showSidebar && <Sidebar selected={selected} />}
      </div>

      <Stack direction="column" flex={1} width="100%">
        {children}
      </Stack>
    </Stack>
  );
};

export default ExploreLayout;
