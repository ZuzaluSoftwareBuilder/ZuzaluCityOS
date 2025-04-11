'use client';
import { Stack } from '@mui/material';
import { Overview } from './Tabs';

export default function SpaceEditPage() {
  return (
    <Stack width={'100%'} height={'calc(100vh - 50px)'}>
      <Stack sx={{ width: '100%', overflowY: 'auto' }}>
        <Overview />
      </Stack>
    </Stack>
  );
}
