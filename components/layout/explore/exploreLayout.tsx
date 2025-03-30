'use client';

import { PropsWithChildren } from 'react';
import { Sidebar } from '@/components/layout';
import * as React from 'react';
import { Stack, useMediaQuery, useTheme } from '@mui/material';

export interface IExploreLayoutProps {
  selected: string
  showSidebar?: boolean
}


const ExploreLayout: React.FC<PropsWithChildren<IExploreLayoutProps>> = ({ children, selected, showSidebar = true }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Stack
      direction="row"
      sx={{ backgroundColor: '#222222', minHeight: 'calc(100vh - 50px)' }}
    >
      {!isTablet && showSidebar && <Sidebar selected={selected} />}

      <Stack direction="column" flex={1} width="100%">
        {children}
      </Stack>
    </Stack>
  );
};

export default ExploreLayout;
