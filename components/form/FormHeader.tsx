import { ZuButton } from '@/components/core';
import { XMarkIcon } from '@/components/icons';
import { Box, Typography } from '@mui/material';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import React from 'react';

interface IProps {
  title: string;
  isBack?: boolean;
  handleClose: () => void;
}

export default function FormHeader({
  handleClose,
  title,
  isBack = false,
}: IProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      height="50px"
      borderBottom="1px solid #383838"
      paddingX={3}
      gap={2}
      bgcolor="rgba(34, 34, 34, 0.8)"
    >
      <ZuButton
        startIcon={isBack ? <ArrowLeftIcon /> : <XMarkIcon />}
        onClick={handleClose}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        {isBack ? 'Back' : 'Close'}
      </ZuButton>
      <Typography variant="subtitleSB">{title}</Typography>
    </Box>
  );
}
