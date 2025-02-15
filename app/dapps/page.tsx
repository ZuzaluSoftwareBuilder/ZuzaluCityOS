'use client';

import { Sidebar } from 'components/layout';
import { useTheme } from '@mui/material/styles';
import { Stack, useMediaQuery } from '@mui/material';
import { Header, List, Nav, DappDetail } from './components';
import { useCallback, useState } from 'react';
import Drawer from '@/components/drawer';
import DappForm from '@/components/form/DappForm';

const mockData = {
  appName: 'Mock Dapp',
  developerName: 'Mock Developer',
  tagline:
    'A private, token-gated, decentralized social network built by AKASHA coreA private, token-gated, decentralized social network built by AKASHA coreA private, token-gated, decentralized social network built by AKASHA core',
  description: JSON.stringify({
    time: Date.now(),
    blocks: [
      {
        id: 'mockBlock1',
        type: 'paragraph',
        data: {
          text: 'This is a mock description for the dapp.',
        },
      },
    ],
    version: '2.27.2',
  }),
  bannerUrl:
    'https://images.wsj.net/im-43460061?width=608&height=405&pixel_ratio=2',
  categories:
    'Defi,Gaming,Defi,Gaming,Defi,Gaming,Defi,Gaming,Defi,Gaming,Defi,GamingDefi,Gaming,Defi,Gaming,Defi,Gaming',
  developmentStatus: '1',
  openSource: true,
  repositoryUrl: 'https://github.com/mock/repository',
  appUrl: 'https://mockapp.com',
  websiteUrl: 'https://mockwebsite.com',
  docsUrl: 'https://docs.mockapp.com',
};

export default function DappsPage() {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const toggleForm = useCallback(() => {
    setOpenForm((v) => !v);
  }, []);
  const toggleDetail = useCallback(() => {
    setOpenDetail((v) => !v);
  }, []);
  const handleDetailClick = useCallback(() => {
    toggleDetail();
  }, [toggleDetail]);

  return (
    <Stack direction="row" sx={{ backgroundColor: '#222222' }}>
      {!isTablet && <Sidebar selected="dapps" />}
      <Stack direction="column" flex={1} width="100%">
        <Header onAdd={toggleForm} />
        <Nav />
        <List onDetailClick={handleDetailClick} />
        <Drawer open={openForm} onClose={toggleForm} onOpen={toggleForm}>
          <DappForm handleClose={toggleForm} refetch={() => toggleForm()} />
        </Drawer>
        <Drawer open={openDetail} onClose={toggleDetail} onOpen={toggleDetail}>
          <DappDetail handleClose={toggleDetail} data={mockData} />
        </Drawer>
      </Stack>
    </Stack>
  );
}
