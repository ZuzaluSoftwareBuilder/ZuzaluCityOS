'use client';
import { useCeramicContext } from '@/context/CeramicContext';
import { Stack, Typography, useTheme } from '@mui/material';
import { ZuButton } from 'components/core';
import { SpacePlusIcon } from 'components/icons';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import Dialog from '../Modal/Dialog';

const SpaceHeader = () => {
  const [showModal, setShowModal] = React.useState(false);
  const theme = useTheme();
  const router = useRouter();
  const { ceramic, isAuthenticated, showAuthPrompt } = useCeramicContext();

  const createButtonHandler = () => {
    if (isAuthenticated) {
      router.push('/spaces/create');
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  return (
    <Stack
      padding="40px 25px"
      direction="column"
      spacing={2}
      borderBottom="1px solid #383838"
    >
      <Typography color={theme.palette.text.primary} variant="h1">
        Spaces
      </Typography>
      <Typography color={theme.palette.text.primary} variant="bodyBB">
        Welcome to the new Zuzalu City
      </Typography>
      <ZuButton startIcon={<SpacePlusIcon />} onClick={createButtonHandler}>
        Create a Space
      </ZuButton>
      <Dialog
        title="Warning"
        message="Login to Create a Space"
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          showAuthPrompt();
          setShowModal(false);
        }}
      />
    </Stack>
  );
};

export default SpaceHeader;
