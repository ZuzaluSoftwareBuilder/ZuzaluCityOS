'use client';

import { TwitterIcon, WhatsappIcon } from '@/components/icons';
import { CopyIcon } from '@/components/icons/Copy';
import { Modal, Snackbar, TextField, Typography } from '@mui/material';

import { FarcasterIcon } from '@/components/icons';
import { Box, Stack } from '@mui/material';

import { ZuButton } from '@/components/core';
import { IconButton } from '@mui/material';

import { useState } from 'react';

interface ShareModalProps {
  discussionTitle: string;
  openShareModal: boolean;
  setOpenShareModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareModal = ({
  discussionTitle,
  openShareModal,
  setOpenShareModal,
}: ShareModalProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseShareModal = () => setOpenShareModal(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const getEncodedText = () => {
    const textEncoded = encodeURIComponent(
      `Zuzalu, follow this discussion ${discussionTitle} on ${window.location.href}`,
    );
    return textEncoded;
  };

  const shareToTwitter = () => {
    const textEncoded = getEncodedText();
    window.open(
      `https://twitter.com/intent/tweet?text=${textEncoded}`,
      '_blank',
    );
  };

  const shareToFarcaster = () => {
    const textEncoded = getEncodedText();
    window.open(`https://warpcast.com/~/compose?text=${textEncoded}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const textEncoded = getEncodedText();
    window.open(`https://wa.me/?text=${textEncoded}`, '_blank');
  };

  return (
    <>
      <Modal
        open={openShareModal}
        onClose={handleCloseShareModal}
        aria-labelledby="share-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.default',
            border: '2px solid #222222',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="share-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Share this discussion
          </Typography>
          <TextField
            fullWidth
            value={window.location.href}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={copyToClipboard}>
                  <CopyIcon />
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <ZuButton
              onClick={shareToTwitter}
              sx={{
                color: 'white',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '20px 10px',
              }}
            >
              <TwitterIcon />
            </ZuButton>
            <ZuButton
              onClick={shareToFarcaster}
              sx={{
                color: 'white',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '20px 10px',
              }}
            >
              <FarcasterIcon />
            </ZuButton>
            <ZuButton
              onClick={shareToWhatsApp}
              sx={{
                color: 'white',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '20px 10px',
              }}
            >
              <WhatsappIcon />
            </ZuButton>
          </Stack>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />
    </>
  );
};

export default ShareModal;
