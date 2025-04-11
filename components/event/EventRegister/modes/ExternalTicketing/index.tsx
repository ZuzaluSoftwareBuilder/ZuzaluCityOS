import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Stack } from '@mui/material';
import { ZuButton } from 'components/core';
import React from 'react';

const ExternalTicketingDefault: React.FC = () => {
  return (
    <Stack
      padding={'24px 20px'}
      borderRadius={'0px 0px 10px 10px'}
      margin={'0px !important'}
    >
      <ZuButton
        sx={{
          width: '100%',
          opacity: '0.7',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        }}
        startIcon={<ArrowCircleRightIcon />}
      >
        Buy Tickets
      </ZuButton>
    </Stack>
  );
};

export default ExternalTicketingDefault;
