'use client';
import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { Overview, Invite } from './Tabs';
import { Button } from '@heroui/react';
import { CaretLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

export default function SpaceEditPage() {
  const [tabName, setTabName] = useState<string>('Overview');
  const router = useRouter();

  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview />;
      case 'Invite':
        return <Invite />;
      default:
        return <Overview />;
    }
  };

  return (
    <Stack width={'100%'} height={'calc(100vh - 50px)'}>
      <Stack sx={{ width: '100%', overflowY: 'auto' }}>{renderPage()}</Stack>
    </Stack>
  );
}
