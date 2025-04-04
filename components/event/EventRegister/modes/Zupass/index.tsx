import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import React, { Dispatch, SetStateAction } from 'react';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Anchor } from '@/types';
import VerifyAccess from '../components/verify';

export interface ZupassDefaultProps {
  applyRule: string;
  setSponsor: Dispatch<SetStateAction<boolean>>;
  setWhitelist: Dispatch<SetStateAction<boolean>>;
  onToggle: (anchor: Anchor, open: boolean) => void;
  handleStep: (step: number) => void;
  setApplication: React.Dispatch<React.SetStateAction<boolean>>;
  checkinOpen: string;
  registrationOpen: string;
}

const ZupassDefault: React.FC<ZupassDefaultProps> = ({
  applyRule,
  setSponsor,
  setWhitelist,
  onToggle,
  handleStep,
  setApplication,
  checkinOpen,
  registrationOpen,
}) => {
  return (
    <Stack
      padding={'24px 20px'}
      borderRadius={'0px 0px 10px 10px'}
      margin={'0px !important'}
      gap={'20px'}
    >
      {applyRule === 'Apply to Purchase' && registrationOpen === '1' && (
        <Stack spacing="10px">
          <Stack spacing={1}>
            <Typography
              sx={{
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                lineHeight: '22.4px',
                wordWrap: 'break-word',
              }}
            >
              Buy ticket
            </Typography>

            <Typography
              sx={{
                color: '#FFC77D',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                lineHeight: '20.8px',
                wordWrap: 'break-word',
              }}
            >
              This event requires approval from the administrator
            </Typography>
          </Stack>

          <ZuButton
            sx={{
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              marginTop: '10px',
              color: '#7DFFD1',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              lineHeight: '19.2px',
              wordWrap: 'break-word',
              textTransform: 'none',
              backgroundColor: 'rgba(125, 255, 209, 0.1)',
            }}
            startIcon={<ArrowCircleRightIcon sx={{ color: '#7DFFD1' }} />}
            onClick={() => {
              setWhitelist(false);
              setApplication(true);
              onToggle('right', true);
            }}
          >
            Apply to Join
          </ZuButton>
        </Stack>
      )}
      <VerifyAccess handleStep={handleStep} />
    </Stack>
  );
};

export default ZupassDefault;
