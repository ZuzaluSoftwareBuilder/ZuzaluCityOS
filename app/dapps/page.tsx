'use client';

import { Sidebar } from 'components/layout';
import { useTheme } from '@mui/material/styles';
import { Stack, useMediaQuery } from '@mui/material';
import { Header, List } from './components';

export default function DappsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
      {!isTablet && <Sidebar selected="dapps" />}
      <Stack direction="column" flex={1}>
        <Header />
        <List />
      </Stack>
    </Stack>
  );
}
