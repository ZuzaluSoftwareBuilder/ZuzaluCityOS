'use client';

import { ZuButton } from '@/components/core';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface AkashaConnectModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

export default function AkashaConnectModal({
  showModal,
  setShowModal,
  onSuccess,
}: AkashaConnectModalProps) {
  const onClose = () => {
    setShowModal(false);
  };

  return (
    <Dialog
      open={showModal}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '692px',
          height: 'auto',
          padding: '20px 16px',
          backgroundColor: 'rgba(34, 34, 34, 0.9)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '20px',
          margin: '0px',
          maxWidth: 'unset',
          zIndex: 0,
        },
      }}
    >
      <DialogTitle
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          fontSize: '25px',
          fontWeight: 'bold',
        }}
      >
        To be able to write and comment on posts, you need to connect to Akasha
        ecosystem.
      </DialogTitle>
      <DialogContent style={{ width: '100%', color: 'white', padding: '10px' }}>
        <Stack
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <Typography fontSize={'18px'}>
            Please click on sign in to proceed
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'center',
          width: '100%',
          padding: 0,
          flexDirection: 'column',
        }}
      >
        <ZuButton
          sx={{
            width: '100%',
            fontSize: '18px',
          }}
          onClick={onSuccess}
        >
          Sign In
        </ZuButton>
      </DialogActions>
    </Dialog>
  );
}
