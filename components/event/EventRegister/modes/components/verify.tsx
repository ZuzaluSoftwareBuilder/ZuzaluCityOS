import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { KeyIcon } from 'components/icons';
import React from 'react';

interface VerifyAccessProps {
  handleStep: (step: number) => void;
}

const VerifyAccess: React.FC<VerifyAccessProps> = ({ handleStep }) => {
  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <hr
        style={{
          border: 'none',
          borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
          margin: '10px 0',
        }}
      />
      <Typography
        sx={{
          opacity: 0.6,
          color: 'white',
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          textTransform: 'uppercase',
          lineHeight: '12px',
          letterSpacing: '0.2px',
          textAlign: 'center',
        }}
      >
        Have you already purchased?
      </Typography>
      <ZuButton
        startIcon={<KeyIcon />}
        onClick={() => handleStep(1)}
        sx={{
          width: '100%',
          padding: '6px 10px',
          background: 'rgba(125, 255, 209, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(125, 255, 209, 0.3)',
          color: '#7DFFD1',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          lineHeight: '22.4px',
          textTransform: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3px',
          '&:hover': {
            background: 'rgba(125, 255, 209, 0.1)',
          },
        }}
      >
        Verify Access
      </ZuButton>
    </Stack>
  );
};

export default VerifyAccess;
