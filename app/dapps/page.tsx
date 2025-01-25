'use client';

import { Sidebar } from 'components/layout';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export default function DappsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return <div>{!isTablet && <Sidebar selected="dapps" />}</div>;
}
