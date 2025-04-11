import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import React from 'react';

interface SuccessVerifyProps {
  handleStep: (step: number) => void;
  handleLogout: () => void;
}

const SuccessVerify: React.FC<SuccessVerifyProps> = ({
  handleStep,
  handleLogout,
}) => {
  return (
    <Stack
      width="100%"
      height={'300px'}
      alignItems={'center'}
      margin={'0px !important'}
    >
      <Stack
        padding="10px 20px"
        gap={'4px'}
        alignItems={'center'}
        width={'100%'}
        bgcolor={'rgba(215, 255, 196, 0.10)'}
      >
        <Typography
          color={'#D7FFC4'}
          fontSize={'14px'}
          fontWeight={600}
          textAlign={'center'}
        >
          You have Checked-in
        </Typography>
        <Typography
          textAlign={'center'}
          fontSize={'13px'}
          color={'#D7FFC4'}
          sx={{ opacity: '0.8' }}
        >
          You are now signed-in to the event
        </Typography>
      </Stack>
      <Stack
        padding="14px 20px 20px 20px"
        gap={'20px'}
        alignItems={'center'}
        height={'230px'}
        justifyContent={'center'}
      >
        <ZuButton
          startIcon={<ArrowCircleRightIcon />}
          sx={{
            width: '100%',
            border: '1px solid rgba(235, 87, 87, 0.30)',
            backgroundColor: '#2F2121',
            color: '#FF5E5E',
          }}
          onClick={() => {
            handleLogout();
          }}
        >
          Sign out
        </ZuButton>
        <Typography
          fontSize={'14px'}
          textAlign={'center'}
          sx={{
            opacity: '0.7',
          }}
        >
          you can be signed in multiple events with different wallets in order
          to preserve your privacy
        </Typography>
      </Stack>
    </Stack>
  );
};

export default SuccessVerify;
