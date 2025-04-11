import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface ValidateCredentialProps {
  handleStep: (step: number) => void;
  onVerify: () => void;
  verifyButtonText?: string;
  verifyButtonIcon?: string | React.ReactNode;
  isValidating: boolean;
  isValid: boolean | undefined;
  setIsValid: Dispatch<SetStateAction<boolean | undefined>>;
  setIsValidating: Dispatch<SetStateAction<boolean>>;
}

const ValidateCredential: React.FC<ValidateCredentialProps> = ({
  handleStep,
  onVerify,
  verifyButtonText,
  verifyButtonIcon = '/user/wallet.png',
  isValidating,
  isValid,
  setIsValid,
  setIsValidating,
}) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isValid === true) {
      timer = setTimeout(() => {
        handleStep(2);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isValid, handleStep]);
  return (
    <Stack spacing={0.5} width="100%">
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: 'pointer', paddingLeft: '20px' }}
        onClick={() => {
          setIsValid(undefined);
          setIsValidating(false);
          handleStep(0);
        }}
      >
        <IconButton
          size="small"
          sx={{
            color: 'white',
            opacity: 0.5,
            '&:hover': { opacity: 1 },
            padding: 0,
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography
          sx={{
            color: 'white',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 600,
            lineHeight: '22.40px',
          }}
        >
          Back
        </Typography>
      </Stack>

      {isValid === undefined ? (
        <Typography
          sx={{
            color: 'white',
            fontSize: 13,
            fontFamily: 'Inter',
            fontWeight: '400',
            lineHeight: '18.20px',
            letterSpacing: '0.13px',
            wordWrap: 'break-word',
            paddingLeft: '20px',
            paddingTop: '4px',
          }}
        >
          Verifying your purchased credential only happens once. You will not
          need to do this again.
        </Typography>
      ) : isValid ? (
        <Typography
          sx={{
            color: '#7DFFD1',
            fontSize: 13,
            fontFamily: 'Inter',
            fontWeight: '400',
            lineHeight: '18.20px',
            letterSpacing: '0.13px',
            wordWrap: 'break-word',
            paddingLeft: '20px',
            paddingTop: '4px',
          }}
        >
          Your address is verified! Refreshing Page..
        </Typography>
      ) : (
        <Typography
          sx={{
            color: '#FF5E5E',
            fontSize: 13,
            fontFamily: 'Inter',
            fontWeight: '600',
            lineHeight: '18.20px',
            letterSpacing: '0.13px',
            wordWrap: 'break-word',
            paddingLeft: '20px',
            paddingTop: '4px',
          }}
        >
          <span style={{ fontWeight: 600 }}>
            Your Address does not have the valid credential.
          </span>{' '}
          Please check if you have the correct address and credential(s).
        </Typography>
      )}

      <Stack
        width="100%"
        gap="14px"
        height={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
        padding="20px"
      >
        <ZuButton
          startIcon={
            typeof verifyButtonIcon === 'string' ? (
              <Image
                src={verifyButtonIcon}
                alt="wallet"
                height={24}
                width={24}
              />
            ) : React.isValidElement(verifyButtonIcon) ? (
              verifyButtonIcon
            ) : null
          }
          onClick={onVerify}
          sx={{
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 600,
            lineHeight: '22.40px',
          }}
        >
          {isValidating ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Validating...
            </>
          ) : (
            verifyButtonText
          )}
        </ZuButton>
      </Stack>
    </Stack>
  );
};

export default ValidateCredential;
