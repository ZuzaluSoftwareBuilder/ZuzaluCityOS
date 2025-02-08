'use client';

import { Sidebar } from 'components/layout';
import { useTheme } from '@mui/material/styles';
import { Stack, useMediaQuery } from '@mui/material';
import { Header, List } from './components';
import { useCallback, useState } from 'react';
import Drawer from '@/components/drawer';
import DappForm from '@/components/form/DappForm';

export default function DappsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(true);

  const toggleDrawer = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  return (
    <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
      {!isTablet && <Sidebar selected="dapps" />}
      <Stack direction="column" flex={1}>
        <Header />
        <List />
        <Drawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
          <DappForm handleClose={toggleDrawer} refetch={() => toggleDrawer()} />
        </Drawer>
      </Stack>
    </Stack>
  );
}
