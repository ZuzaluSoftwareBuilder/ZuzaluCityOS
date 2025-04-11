import CheckinConnectButton from '@/components/checkin/CheckinConnectButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { IconButton, Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import React, { Dispatch, SetStateAction } from 'react';
interface LinkAddressProps {
  handleStep: (step: number) => void;
  address: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  selectedOption: string;
  handleConfirm: () => void;
}

const LinkAddress: React.FC<LinkAddressProps> = ({
  handleStep,
  address,
  setSelectedOption,
  selectedOption,
  handleConfirm,
}) => {
  return (
    <Stack spacing={2.5} width="100%" padding="10px 20px 20px 20px">
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: 'pointer' }}
        onClick={() => {
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
      <Stack spacing={1.25}>
        <Typography
          sx={{
            color: 'white',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 600,
            lineHeight: '22.40px',
            wordWrap: 'break-word',
            paddingTop: '4px',
          }}
        >
          Link an address to this Ticket
        </Typography>
        <Typography
          textAlign={'left'}
          fontSize={'13px'}
          sx={{ opacity: '0.7' }}
        >
          You can optionally choose another address from your wallet for
          privacy. This will generate a new{' '}
          <a
            href="https://ceramic.network/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              borderBottom: '1px solid',
            }}
          >
            <u>Ceramic DID</u>
          </a>{' '}
          for Zuzalu.city.
        </Typography>
      </Stack>
      <Stack spacing={1.25}>
        {/* <Box
          sx={{
            width: '100%',
            height: '100%',
            padding: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box
            sx={{
              alignSelf: 'stretch',
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
           <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: '15.60px',
                }}
              >
                Current Signed-in Address
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                color: 'white',
                fontSize: '13px',
                lineHeight: '18.20px',
                letterSpacing: 0.13,
                paddingTop: '4px',
              }}
            >
              {address}
            </Typography>
          </Box>
          <Box
            sx={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                padding: 1,
                background:
                  selectedOption === 'same'
                    ? 'rgba(125, 255, 209, 0.10)'
                    : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                border:
                  selectedOption === 'same'
                    ? '1px solid rgba(125, 255, 209, 0.20)'
                    : '1px solid rgba(255, 255, 255, 0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    color: selectedOption === 'same' ? '#7DFFD1' : 'white',
                    fontWeight: 600,
                    lineHeight: '22.40px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedOption('same')}
                >
                  Link Same Address
                </Typography>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '1px solid',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background:
                      selectedOption === 'same'
                        ? '#7DFFD1'
                        : 'rgba(255, 255, 255, 0.01)',
                  }}
                  onClick={() => setSelectedOption('same')}
                >
                  {selectedOption === 'same' && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                padding: 1,
                background:
                  selectedOption === 'another'
                    ? 'rgba(125, 255, 209, 0.10)'
                    : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '10px',
                border:
                  selectedOption === 'another'
                    ? '1px solid rgba(125, 255, 209, 0.20)'
                    : '1px solid rgba(255, 255, 255, 0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    color: selectedOption === 'another' ? '#7DFFD1' : 'white',
                    fontWeight: 600,
                    lineHeight: '22.40px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedOption('another')}
                >
                  Link Another Address
                </Typography>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '1px solid',
                    background:
                      selectedOption === 'another'
                        ? '#7DFFD1'
                        : 'rgba(255, 255, 255, 0.01)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedOption('another')}
                >
                  {selectedOption === 'another' && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>*/}
        <CheckinConnectButton address={address} />
        <ZuButton
          startIcon={<ArrowCircleRightIcon />}
          sx={{
            width: '100%',
            color: '#D7FFC4',
            border: '1px solid rgba(215, 255, 196, 0.20)',
            backgroundColor: 'rgba(215, 255, 196, 0.10)',
          }}
          onClick={() => handleConfirm()}
        >
          Confirm This Address
        </ZuButton>
      </Stack>
    </Stack>
  );
};

export default LinkAddress;
