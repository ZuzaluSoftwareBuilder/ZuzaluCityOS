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
      <div className="pc:hidden flex items-center gap-[10px] p-5 bg-[#2C2C2C]">
        <Button
          className="h-[34px] bg-[#363636] hover:bg-[#363636] rounded-lg py-2 px-3.5 flex items-center gap-[5px]"
          onPress={() => router.back()}
        >
          <CaretLeft size={20} weight="bold" />
          <span className="text-white text-[13px] font-medium">Back</span>
        </Button>
        <span className="text-white text-[14px]">Space Settings</span>
      </div>
      <Stack sx={{ width: '100%', overflowY: 'auto' }}>{renderPage()}</Stack>
    </Stack>
  );
}
