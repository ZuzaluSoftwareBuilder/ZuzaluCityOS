import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  Typography,
  IconButton,
  Box,
  Modal,
  Button,
  Stack,
  CircularProgress,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { client } from '@/context/WalletContext';
import { CeramicResponseType } from '@/types';
import { EventEdge } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { getWalletAddressFromDid } from '@/utils/did';
const QrReader = require('react-qr-scanner');

// ERC721 ABI (只包含我们需要的函数)
const abi = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

interface IScanQRModal {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  backgroundColor: 'rgba(52, 52, 52, 0.80)',
  border: '2px solid rgba(255, 255, 255, 0.10)',
  padding: '20px',
  boxShadow: 24,
};

const ScanQRModal = ({ showModal, setShowModal }: IScanQRModal) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [failedInfo, setFailedInfo] = useState({
    isFailed: false,
    errorMessage: '',
  });
  const { composeClient } = useCeramicContext();

  const verifyNFTOwnership = async (
    walletAddress: string,
    ticketAddress: string,
  ) => {
    try {
      const balance = await client.readContract({
        address: ticketAddress as `0x${string}`,
        abi,
        functionName: 'balanceOf',
        args: [walletAddress],
      });

      if (typeof balance === 'bigint') {
        return balance > BigInt(0);
      }
      return false;
    } catch (error) {
      console.error('Error verifying NFT ownership:', error);
      return false;
    }
  };

  const getEventDetailInfo = async (
    eventId: string,
    ticketAddress: string,
    profileId: string,
  ) => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on ZucityEvent {
                  id
                  regAndAccess(first: 1) {
                    edges {
                      node {
                        id
                        scrollPassTickets {
                          contractAddress
                        }
                        scannedList {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
      `,
          {
            id: eventId,
          },
        )) as CeramicResponseType<EventEdge>;
      if (response.data) {
        if (response.data.node) {
          const regAndAccess =
            response.data.node.regAndAccess?.edges?.[0]?.node;
          if (!regAndAccess) {
            return 'Failed to fetch event';
          }
          const { scannedList = [], scrollPassTickets = [], id } = regAndAccess;
          if (
            scannedList.findIndex((item: any) => item.id === profileId) > -1
          ) {
            return 'You have already scanned this ticket';
          }
          if (
            scrollPassTickets.findIndex(
              (item: any) => item.contractAddress === ticketAddress,
            ) === -1
          ) {
            return 'This ticket is not for this event';
          }
          return { scannedList, id };
        }
      }
      return 'Failed to fetch event';
    } catch (err) {
      console.log('Failed to fetch event: ', err);
      return 'Failed to fetch event';
    }
  };

  const handleScan = useCallback(
    async (data: any) => {
      if (data && data.text && !isLoading) {
        try {
          setIsLoading(true);
          const { eventId, ticketAddress, authorId, createdAt } = JSON.parse(
            data.text,
          );
          const scannedDate = dayjs.unix(createdAt);
          if (!scannedDate.isValid()) {
            throw new Error('Invalid QR Code');
          }
          // if (dayjs().diff(scannedDate, 'minute') > 1) {
          //   throw new Error('QR Code has expired');
          // }
          const walletAddress = getWalletAddressFromDid(authorId);

          const [hasNFT, result] = await Promise.all([
            verifyNFTOwnership(walletAddress, ticketAddress),
            getEventDetailInfo(eventId, ticketAddress, authorId),
          ]);

          if (!hasNFT) {
            throw new Error(`User doesn't have this ticket`);
          }

          if (typeof result === 'string') {
            throw new Error(result);
          }

          const { scannedList, id: regAndAccessId } = result;
          await updateRegAndAccess({
            id: regAndAccessId,
            type: 'scannedList',
            eventId,
            scannedList: [...(scannedList ?? []), authorId],
          });
          setIsSuccess(true);
        } catch (error: any) {
          console.error('Error processing QR code data:', error);
          setFailedInfo({
            isFailed: true,
            errorMessage: error.message || 'Invalid QR code data',
          });
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isLoading],
  );

  const handleError = (err: string) => {
    console.log(err);
    setError(err);
  };

  return (
    <>
      <VerificationSuccess
        isSuccess={isSuccess}
        setShowModal={setShowModal}
        setIsSuccess={setIsSuccess}
      />
      <VerificationFailed
        isFailed={failedInfo.isFailed}
        setIsFailed={setFailedInfo}
        setShowModal={setShowModal}
        errorMessage={failedInfo.errorMessage}
      />
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            ...modalStyle,
            [theme.breakpoints.down('sm')]: {
              left: '10px',
              right: '10px',
              transform: 'translate(0, -50%)',
              width: 'auto',
            },
          }}
        >
          <Typography
            fontSize="20px"
            fontWeight={700}
            lineHeight={1.2}
            color="#fff"
            mb="20px"
            textAlign="center"
          >
            Scan Ticket
          </Typography>
          <IconButton
            onClick={() => setShowModal(false)}
            sx={{
              color: 'white',
              paddingRight: 0,
              position: 'absolute',
              right: '20px',
              top: '12px',
            }}
          >
            <CloseIcon />
          </IconButton>
          {error ? (
            <Typography textAlign="center" color="white">
              Please check your camera accessibility or QR Code
            </Typography>
          ) : (
            <Stack position="relative">
              <QrReader
                style={{
                  width: '100%',
                  // height: '360px',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onError={handleError}
                onScan={handleScan}
              />
              {isLoading && (
                <Stack
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                  }}
                >
                  <CircularProgress size="3rem" />
                </Stack>
              )}
            </Stack>
          )}
          <Typography
            textAlign="center"
            fontWeight={700}
            fontSize="18px"
            color="white"
            mt="20px"
          >
            {isLoading ? 'Verifying...' : 'Scanning...'}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

interface IVerificationSuccess {
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const VerificationSuccess = ({
  isSuccess,
  setIsSuccess,
  setShowModal,
}: IVerificationSuccess) => {
  const theme = useTheme();
  return (
    <Modal open={isSuccess} onClose={() => setIsSuccess(false)}>
      <Box
        sx={{
          ...modalStyle,
          [theme.breakpoints.down('sm')]: {
            left: '10px',
            right: '10px',
            transform: 'translate(0, -50%)',
            width: 'auto',
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.75}
        >
          <Typography variant="h6" color="white">
            Scan Ticket
          </Typography>
          <IconButton
            onClick={() => setIsSuccess(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <svg
          width="100%"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="360"
            height="360"
            rx="10"
            fill="#7DFFD1"
            fillOpacity="0.1"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M131.25 180C131.25 153.076 153.076 131.25 180 131.25C206.924 131.25 228.75 153.076 228.75 180C228.75 206.924 206.924 228.75 180 228.75C153.076 228.75 131.25 206.924 131.25 180ZM198.051 170.93C199.255 169.244 198.865 166.902 197.18 165.699C195.494 164.495 193.152 164.885 191.948 166.57L175.771 189.218L167.652 181.098C166.187 179.634 163.813 179.634 162.348 181.098C160.884 182.563 160.884 184.937 162.348 186.402L173.598 197.652C174.378 198.431 175.461 198.828 176.559 198.737C177.658 198.646 178.661 198.077 179.302 197.18L198.051 170.93Z"
            fill="#1BA27A"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M131.25 180C131.25 153.076 153.076 131.25 180 131.25C206.924 131.25 228.75 153.076 228.75 180C228.75 206.924 206.924 228.75 180 228.75C153.076 228.75 131.25 206.924 131.25 180ZM198.051 170.93C199.255 169.244 198.865 166.902 197.18 165.699C195.494 164.495 193.152 164.885 191.948 166.57L175.771 189.218L167.652 181.098C166.187 179.634 163.813 179.634 162.348 181.098C160.884 182.563 160.884 184.937 162.348 186.402L173.598 197.652C174.378 198.431 175.461 198.828 176.559 198.737C177.658 198.646 178.661 198.077 179.302 197.18L198.051 170.93Z"
            fill="url(#paint0_linear_5186_11150)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_5186_11150"
              x1="131.25"
              y1="131.25"
              x2="180"
              y2="228.75"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <Typography
          mt={2.5}
          textAlign="center"
          fontWeight={700}
          fontSize="18px"
          color="#7DFFD1"
        >
          Verified
        </Typography>
        <Button
          onClick={() => {
            setIsSuccess(false);
            setShowModal(true);
          }}
          fullWidth
          sx={{
            px: 1.75,
            py: 1,
            borderRadius: '10px',
            fontWeight: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            mt: '10px',
          }}
        >
          Re-Scan
        </Button>
      </Box>
    </Modal>
  );
};

interface IVerificationFailed {
  isFailed: boolean;
  setIsFailed: Dispatch<
    SetStateAction<{ isFailed: boolean; errorMessage: string }>
  >;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
}

const VerificationFailed = ({
  isFailed,
  setIsFailed,
  setShowModal,
  errorMessage,
}: IVerificationFailed) => {
  const theme = useTheme();
  const handleReScan = () => {
    setShowModal(true);
    setIsFailed({ isFailed: false, errorMessage: '' });
  };
  return (
    <Modal
      open={isFailed}
      onClose={() => setIsFailed({ isFailed: false, errorMessage: '' })}
    >
      <Box
        sx={{
          ...modalStyle,
          [theme.breakpoints.down('sm')]: {
            left: '10px',
            right: '10px',
            transform: 'translate(0, -50%)',
            width: 'auto',
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.75}
        >
          <Typography variant="h6" color="white">
            Scan Ticket
          </Typography>
          <IconButton
            onClick={() => setIsFailed({ isFailed: false, errorMessage: '' })}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <svg
          width="100%"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="360"
            height="360"
            rx="10"
            fill="#FF5E5E"
            fillOpacity="0.1"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M180 131.25C153.076 131.25 131.25 153.076 131.25 180C131.25 206.924 153.076 228.75 180 228.75C206.924 228.75 228.75 206.924 228.75 180C228.75 153.076 206.924 131.25 180 131.25ZM171.402 166.098C169.937 164.634 167.563 164.634 166.098 166.098C164.634 167.563 164.634 169.937 166.098 171.402L174.697 180L166.098 188.598C164.634 190.063 164.634 192.437 166.098 193.902C167.563 195.366 169.937 195.366 171.402 193.902L180 185.303L188.598 193.902C190.063 195.366 192.437 195.366 193.902 193.902C195.366 192.437 195.366 190.063 193.902 188.598L185.303 180L193.902 171.402C195.366 169.937 195.366 167.563 193.902 166.098C192.437 164.634 190.063 164.634 188.598 166.098L180 174.697L171.402 166.098Z"
            fill="#FF5E5E"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M180 131.25C153.076 131.25 131.25 153.076 131.25 180C131.25 206.924 153.076 228.75 180 228.75C206.924 228.75 228.75 206.924 228.75 180C228.75 153.076 206.924 131.25 180 131.25ZM171.402 166.098C169.937 164.634 167.563 164.634 166.098 166.098C164.634 167.563 164.634 169.937 166.098 171.402L174.697 180L166.098 188.598C164.634 190.063 164.634 192.437 166.098 193.902C167.563 195.366 169.937 195.366 171.402 193.902L180 185.303L188.598 193.902C190.063 195.366 192.437 195.366 193.902 193.902C195.366 192.437 195.366 190.063 193.902 188.598L185.303 180L193.902 171.402C195.366 169.937 195.366 167.563 193.902 166.098C192.437 164.634 190.063 164.634 188.598 166.098L180 174.697L171.402 166.098Z"
            fill="url(#paint0_linear_5186_11161)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_5186_11161"
              x1="131.25"
              y1="131.25"
              x2="180"
              y2="228.75"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <Typography
          mb={3.5}
          mt={2.5}
          textAlign="center"
          fontWeight={700}
          fontSize="18px"
          color="#FF5E5E"
        >
          {errorMessage}
        </Typography>
        <Button
          onClick={handleReScan}
          fullWidth
          sx={{
            px: 1.75,
            py: 1,
            borderRadius: '10px',
            fontWeight: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
          }}
        >
          Re-Scan
        </Button>
      </Box>
    </Modal>
  );
};

export { ScanQRModal };
