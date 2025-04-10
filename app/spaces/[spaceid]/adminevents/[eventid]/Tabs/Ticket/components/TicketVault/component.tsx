import { mUSDC_TOKEN, isDev } from '@/constant';
import { client, config } from '@/context/WalletContext';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { TICKET_WITH_WHITELIST_ABI } from '@/utils/ticket_with_whitelist_abi';
import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import { Address, isAddress } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import {
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from 'wagmi/actions';
import { ZuButton } from '@/components/core';
import {
  ArrowDownSquare,
  CloseIcon,
  RightArrowIcon,
  SendIcon,
  ChevronDownIcon,
  XCricleIcon,
  CopyIcon,
  GoToExplorerIcon,
  Square2StackIcon,
  ArrowTopRightSquareIcon,
  PlusIcon,
  RefreshIcon,
} from '@/components/icons';
import {
  Box,
  Button,
  Input,
  Stack,
  TextField,
  Typography,
  Step,
  Stepper,
  StepLabel,
  Modal,
  IconButton,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import gaslessFundAndUpload from '@/utils/gaslessFundAndUpload';
import { generateNFTMetadata } from '@/utils/generateNFTMetadata';
import { createFileFromJSON } from '@/utils/generateNFTMetadata';
import { fetchEmailJsConfig } from '@/utils/emailService';
import { send } from '@emailjs/browser';
import { Contract, Event } from '@/types';
import { formatAddressString } from '@/components/layout/Header/UserProfileSection';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as yup from 'yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ButtonGroup } from '../Common';
import { useToast } from '@/components/toast/ToastContext';

interface IProps {
  amount?: string;
  recipient?: string;
}

interface IWithdrawToken {
  tokenSymbol: string;
  balance: number;
  tokenAddress: string;
  ticketAddress: string;
  ticket: Array<any>;
  refetch?: () => void;
}

interface IConfirmWithdrawalTransaction {
  showWithdrawalModal: boolean;
  setShowWithdrawalModal: Dispatch<React.SetStateAction<boolean>>;
  handleWithdraw: any;
  amount?: number;
  recipient?: string;
}

interface IConfirmSendNFTTicketTransaction {
  showNFTTicketModal: boolean;
  setShowNFTTicketModal: Dispatch<React.SetStateAction<boolean>>;
  handleSendNFTTicket: any;
  recipient: string;
  ticket: Array<any>;
}
interface ISendNFTTicketComplete {
  showNFTTicketComplete: boolean;
  setShowNFTTicketComplete: Dispatch<React.SetStateAction<boolean>>;
  tokenId: string;
  recipient: string;
  ticket: Array<any>;
  ticketAddress: string;
}

interface ISendNFTTicket {
  ticketAddress: string;
  ticket: Array<any>;
  eventContract: Contract;
}
interface ITicketVault {
  vaultIndex: number;
  ticketAddresses: Array<string>;
  tickets: Array<any>;
  refetch?: () => void;
  onClose?: () => void;
  event?: Event;
}
export const WithdrawToken = ({
  tokenSymbol,
  balance,
  tokenAddress,
  ticketAddress,
  ticket,
  refetch,
}: IWithdrawToken) => {
  const [showWithdrawalModal, setShowWithdrawalModal] = React.useState(false);
  const [withdrawInfo, setWithdrawInfo] = React.useState<IProps>();
  const [decimal, setDecimal] = React.useState<number>(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setWithdrawInfo({
      ...withdrawInfo,
      [name]: value,
    });
  };

  const getDecimal = async () => {
    const decimals = (await client.readContract({
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number;

    setDecimal(decimals);
  };

  useEffect(() => {
    getDecimal();
  }, []);

  const handleWithdraw = async () => {
    try {
      const ABI = ticket[8]?.result ? TICKET_WITH_WHITELIST_ABI : TICKET_ABI;
      const withdrawHash = await writeContract(config, {
        chainId: isDev ? sepolia.id : mainnet.id,
        address: ticketAddress as Address,
        functionName: 'withdraw',
        abi: ABI,
        args: [withdrawInfo?.recipient],
      });

      const { status: withdrawStatus } = await waitForTransactionReceipt(
        config,
        {
          hash: withdrawHash,
        },
      );

      if (withdrawStatus === 'success') {
        // action to perform
        refetch?.();
        setShowWithdrawalModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <ConfirmWithdrawalTransaction
        amount={balance}
        recipient={withdrawInfo?.recipient}
        showWithdrawalModal={showWithdrawalModal}
        setShowWithdrawalModal={setShowWithdrawalModal}
        handleWithdraw={handleWithdraw}
      />
      <Box>
        <Box marginTop={'30px'} sx={{ display: 'flex', alignItems: 'center' }}>
          <SendIcon />
          <Typography
            marginLeft={'10px'}
            fontSize="20px"
            fontWeight="bold"
            lineHeight={'120%'}
          >
            Withdrawal
          </Typography>
        </Box>
        <Box marginTop={'14px'} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontSize="14px" fontWeight={600} lineHeight={'160%'}>
            {balance} {tokenSymbol === mUSDC_TOKEN ? 'USDC' : 'USDT'}
          </Typography>
          <Typography
            marginLeft={'10px'}
            fontSize="13px"
            lineHeight={'140%'}
            letterSpacing={'0.13px'}
            sx={{ opacity: '0.8' }}
          >
            ({balance} USD)
          </Typography>
        </Box>

        <Box marginTop={'30px'}>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={700}
            fontFamily="Inter"
            marginBottom="10px"
          >
            To Address
          </Typography>
          <Input
            name="recipient"
            onChange={handleChange}
            sx={{
              color: 'white',
              backgroundColor: '#2d2d2d',
              padding: '12px 10px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'Inter',
              '&::after': {
                borderBottom: 'none',
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: 'none',
              },
            }}
            placeholder="0x000"
          />
          {/*<Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
              marginBottom="10px"
              marginTop="20px"
            >
              Amount
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Input
                name="amount"
                onChange={handleChange}
                sx={{
                  color: 'white',
                  backgroundColor: '#2d2d2d',
                  padding: '12px 10px',
                  borderRadius: '8px',
                  width: '100%',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  '&::after': {
                    borderBottom: 'none',
                  },
                  '&::before': {
                    borderBottom: 'none',
                  },
                  '&:hover:not(.Mui-disabled, .Mui-error):before': {
                    borderBottom: 'none',
                  },
                }}
                placeholder="000"
              />
              <ZuButton
                sx={{
                  height: '25px',
                  padding: '10px 14px',
                  color: 'white',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  background: 'rgba(255, 255, 255, 0.10)',
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                }}
              >
                Max
              </ZuButton>
            </Box>*/}

          {/* <Box marginTop={"14px"} gap={"20px"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box sx={{
                width: "100%"
              }}>
                <Box display={"flex"} alignItems={"center"}>
                  <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                  >
                    Gas Price
                  </Typography>
                  <Typography
                    color="#FFC77D"
                    fontSize="13px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                    marginLeft="8px"
                  >
                    Medium
                  </Typography>
                </Box>
                <Box>
                  <Typography>15.4 Gwei</Typography>
                  <Slider
                    onChange={(e: any) => setGasPrice(e.target.value)}
                    defaultValue={50}
                    sx={{
                      '.mui-ttgsjq-MuiSlider-track': {
                        color: '#67DBFF',
                      },
                      '.mui-7o8aqz-MuiSlider-rail': {
                        color: 'rgba(255, 255, 255, 0.10)'
                      },
                      '.mui-vr4mn8-MuiSlider-thumb': {
                        color: 'white',
                        height: "19px",
                        width: "19px",
                        borderRadius: "50%"
                      },
                    }} aria-label="Default" valueLabelDisplay="auto" />
                </Box>
              </Box>
              <Box sx={{
                width: "100%"
              }}>
                <Typography
                  color="white"
                  fontSize="16px"
                  fontWeight={700}
                  fontFamily="Inter"
                  marginBottom="10px"
                >
                  Gas Limit:
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#2d2d2d',
                    padding: '12px 10px',
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    '&::after': {
                      borderBottom: 'none',
                    },
                    '&::before': {
                      borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                      borderBottom: 'none',
                    },
                  }}
                  placeholder="21000"
                />
              </Box>
            </Box> */}
        </Box>

        <Box marginTop={'30px'}>
          <Button
            onClick={() => setShowWithdrawalModal(true)}
            sx={{
              backgroundColor: '#2f474e',
              color: '#67DAFF',
              width: '100%',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter',
            }}
            startIcon={<RightArrowIcon color="#67DAFF" />}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const SendNFTTicket = ({
  ticketAddress,
  ticket,
  eventContract,
}: ISendNFTTicket) => {
  const [showNFTTicketModal, setShowNFTTicketModal] = React.useState(false);
  const [showNFTTicketComplete, setShowNFTTicketComplete] =
    React.useState(false);
  const [recipient, setRecipient] = useState('');
  const [tokenId, setTokenId] = useState<string>('');
  const handleSendNFTTicket = async () => {
    try {
      const metadata = generateNFTMetadata(
        ticket[0].result,
        'NFT ticket',
        eventContract.image_url as string,
        [
          {
            name: 'Event',
            value: 'Exclusive Event',
          },
          {
            name: 'Type',
            value: 'Attendee',
          },
        ],
      );
      const metadataFile = createFileFromJSON(metadata, 'metaData');
      const tags = [{ name: 'Content-Type', value: 'application/json' }];
      const uploadedID = await gaslessFundAndUpload(metadataFile, tags, 'EVM');
      const ABI = ticket[8]?.result ? TICKET_WITH_WHITELIST_ABI : TICKET_ABI;
      const adminMintHash = await writeContract(config, {
        chainId: isDev ? sepolia.id : mainnet.id,
        address: ticketAddress as Address,
        functionName: 'adminMint',
        abi: ABI,
        args: [recipient, `https://devnet.irys.xyz/${uploadedID}`],
      });

      const { status: adminMintStatus, logs: adminMintLogs } =
        await waitForTransactionReceipt(config, {
          hash: adminMintHash,
        });

      if (adminMintStatus === 'success') {
        if (adminMintLogs.length > 0) {
          setTokenId(BigInt(adminMintLogs[1].data).toString());

          setShowNFTTicketComplete(true);
        }
      }
      setShowNFTTicketModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <SendNFTTicketComplete
        tokenId={tokenId}
        recipient={recipient}
        showNFTTicketComplete={showNFTTicketComplete}
        setShowNFTTicketComplete={setShowNFTTicketComplete}
        ticket={ticket}
        ticketAddress={ticketAddress}
      />
      <ConfirmSendNFTTicketTransaction
        recipient={recipient}
        showNFTTicketModal={showNFTTicketModal}
        setShowNFTTicketModal={setShowNFTTicketModal}
        handleSendNFTTicket={handleSendNFTTicket}
        ticket={ticket}
      />
      <Box marginTop={'30px'} sx={{ display: 'flex', alignItems: 'center' }}>
        <SendIcon />
        <Typography
          marginLeft={'10px'}
          fontSize="20px"
          fontWeight="bold"
          lineHeight={'120%'}
        >
          Send Ticket
        </Typography>
      </Box>
      <Box marginTop={'14px'} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography fontSize="14px" fontWeight={600} lineHeight={'160%'}>
          {ticket[4].result}
        </Typography>
        {/*<Typography
          marginLeft={'10px'}
          fontSize="13px"
          lineHeight={'140%'}
          letterSpacing={'0.13px'}
          sx={{ opacity: '0.8' }}
        >
          out of {ticket[8]?.result}
        </Typography>*/}
      </Box>

      <Box marginTop={'30px'}>
        <Typography
          color="white"
          fontSize="16px"
          fontWeight={700}
          fontFamily="Inter"
          marginBottom="10px"
        >
          To Address
        </Typography>
        <Input
          onChange={(e: any) => setRecipient(e.target.value)}
          sx={{
            color: 'white',
            backgroundColor: '#2d2d2d',
            padding: '12px 10px',
            borderRadius: '8px',
            width: '100%',
            fontSize: '15px',
            fontFamily: 'Inter',
            '&::after': {
              borderBottom: 'none',
            },
            '&::before': {
              borderBottom: 'none',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: 'none',
            },
          }}
          placeholder="0x000"
        />
      </Box>

      <Box marginTop={'30px'}>
        <Button
          onClick={() => setShowNFTTicketModal(true)}
          sx={{
            backgroundColor: '#2f474e',
            color: '#67DAFF',
            width: '100%',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter',
          }}
          startIcon={<RightArrowIcon color="#67DAFF" />}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export const ConfirmSendNFTTicketTransaction = ({
  showNFTTicketModal,
  setShowNFTTicketModal,
  handleSendNFTTicket,
  recipient,
}: IConfirmSendNFTTicketTransaction) => {
  return (
    <>
      <Modal
        open={showNFTTicketModal}
        onClose={() => setShowNFTTicketModal(false)}
      >
        <Stack
          padding="20px"
          border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
          spacing="20px"
          color="white"
          width="535px"
          borderRadius="10px"
          sx={{
            position: 'absolute',
            background: 'rgba(52, 52, 52, 0.80)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Stack direction="row" alignItems={'center'} spacing="24px">
            <Stack
              direction="row"
              alignItems={'center'}
              spacing="10px"
              flex={1}
            >
              <SendIcon />
              <Typography variant="subtitleSB">Confirm Transaction</Typography>
            </Stack>
            <Stack
              onClick={() => setShowNFTTicketModal(false)}
              padding="10px"
              borderRadius="10px"
              bgcolor="#3f3f3f"
              sx={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Stack>
          </Stack>
          <Stack
            padding="10px"
            borderRadius="10px"
            border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
            bgcolor="#3f3f3f"
            spacing="20px"
          >
            <Stack spacing="14px">
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">To Address:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {recipient}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Amount:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  1
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="center">
              <Typography variant="bodyMB">
                Contract execution fee(?)
              </Typography>
              <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                0.00000
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton
              onClick={() => setShowNFTTicketModal(false)}
              sx={{
                width: '100%',
              }}
            >
              Cancel
            </ZuButton>
            <ZuButton
              onClick={handleSendNFTTicket}
              sx={{
                backgroundColor: '#2f474e',
                color: '#67DAFF',
                width: '100%',
              }}
              startIcon={<RightArrowIcon color="#67DAFF" />}
            >
              Send Ticket
            </ZuButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

export const SendNFTTicketComplete = ({
  showNFTTicketComplete,
  setShowNFTTicketComplete,
  tokenId,
  recipient,
  ticketAddress,
}: ISendNFTTicketComplete) => {
  return (
    <>
      <Modal
        open={showNFTTicketComplete}
        onClose={() => setShowNFTTicketComplete(false)}
      >
        <Stack
          padding="20px"
          border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
          spacing="20px"
          color="white"
          width="535px"
          borderRadius="10px"
          sx={{
            position: 'absolute',
            background: 'rgba(52, 52, 52, 0.80)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Stack direction="row" alignItems={'center'} spacing="24px">
            <Stack
              direction="row"
              alignItems={'center'}
              spacing="10px"
              flex={1}
            >
              <SendIcon />
              <Typography variant="subtitleSB">Ticket sent</Typography>
            </Stack>
            <Stack
              onClick={() => setShowNFTTicketComplete(false)}
              padding="10px"
              borderRadius="10px"
              bgcolor="#3f3f3f"
              sx={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Stack>
          </Stack>
          <Stack
            padding="10px"
            borderRadius="10px"
            border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
            bgcolor="#3f3f3f"
            spacing="20px"
          >
            <Stack spacing="14px">
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">To Address:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {recipient}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyM">Contract Address:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {ticketAddress}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Token_ID:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {tokenId}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">
                  Ticket sent successfully, Please inform the receiver to add
                  this NFT to his address
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton
              onClick={() => setShowNFTTicketComplete(false)}
              sx={{
                width: '100%',
              }}
            >
              Close
            </ZuButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

export const ConfirmWithdrawalTransaction = ({
  showWithdrawalModal,
  setShowWithdrawalModal,
  handleWithdraw,
  amount,
  recipient,
}: IConfirmWithdrawalTransaction) => {
  return (
    <>
      <Modal
        open={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
      >
        <Stack
          padding="20px"
          border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
          spacing="20px"
          color="white"
          width="535px"
          borderRadius="10px"
          sx={{
            position: 'absolute',
            background: 'rgba(52, 52, 52, 0.80)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Stack direction="row" alignItems={'center'} spacing="24px">
            <Stack
              direction="row"
              alignItems={'center'}
              spacing="10px"
              flex={1}
            >
              <SendIcon />
              <Typography variant="subtitleSB">Confirm Transaction</Typography>
            </Stack>
            <Stack
              onClick={() => setShowWithdrawalModal(false)}
              padding="10px"
              borderRadius="10px"
              bgcolor="#3f3f3f"
              sx={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Stack>
          </Stack>
          <Stack
            padding="10px"
            borderRadius="10px"
            border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
            bgcolor="#3f3f3f"
            spacing="20px"
          >
            <Stack spacing="14px">
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">To Address:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {recipient}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Token:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  USDT
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Amount:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {amount}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="center">
              <Typography variant="bodyMB">
                Contract execution fee(?)
              </Typography>
              <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                0.00000
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton
              sx={{
                width: '100%',
              }}
              onClick={() => setShowWithdrawalModal(false)}
            >
              Cancel
            </ZuButton>
            <ZuButton
              sx={{
                backgroundColor: '#2f474e',
                color: '#67DAFF',
                width: '100%',
              }}
              startIcon={<RightArrowIcon color="#67DAFF" />}
              onClick={handleWithdraw}
            >
              Transfer Amount
            </ZuButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

interface ITicketProcessingProgress {
  hash: string;
  sendEmails: boolean;
}

const TicketProcessingProgress = ({
  hash,
  sendEmails,
}: ITicketProcessingProgress) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = useMemo(() => {
    const steps = [
      {
        label: 'Addresses being uploaded',
        description: hash,
      },
    ];
    if (sendEmails) {
      steps.push({
        label: 'Sending email notifications',
        description: '',
      });
    }
    return steps;
  }, [hash, sendEmails]);

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                '.mui-10z7562-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
                  color: '#7DFFD1',
                },
              }}
            >
              <Typography
                fontSize={'14px'}
                fontWeight={'600'}
                lineHeight={'160%'}
                color="white"
              >
                {step.label}
              </Typography>
              <Stack
                direction="row"
                display={'flex'}
                alignItems="center"
                spacing="10px"
              >
                <Typography
                  fontSize={'14px'}
                  fontWeight={'400'}
                  lineHeight={'160%'}
                  color="white"
                  sx={{ opacity: '0.8' }}
                >
                  {step.description}
                </Typography>
                {index === 2 || index === 3 ? null : (
                  <>
                    <CopyIcon cursor="pointer" />
                    <GoToExplorerIcon cursor="pointer" />
                  </>
                )}
              </Stack>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const schema = yup.object({
  addresses: yup.array().of(
    yup.object({
      address: yup
        .string()
        .required('Address is required')
        .test('is-ethereum-address', 'Invalid EVM address', (value) => {
          return value ? isAddress(value) : false;
        }),
    }),
  ),
  emails: yup.string(),
});

export const Whitelist = ({
  vaultIndex,
  ticketAddresses,
  tickets,
  refetch,
  event,
  onClose,
}: ITicketVault) => {
  const [openWhitelist, setOpenWhitelist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      addresses: [{ address: '' }],
    },
  });

  const {
    fields: addressesFields,
    remove: addressesRemove,
    append: addressesAppend,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  let ticketAddress = ticketAddresses[vaultIndex];
  let ticket = tickets[vaultIndex];

  const handleSendEmails = async (emailList: string) => {
    const emailJsConfig = await fetchEmailJsConfig(event?.id as string);
    if (emailJsConfig) {
      const { serviceId, templateId, userId } = emailJsConfig;
      const emails = emailList.split(',').map((email) => email.trim());
      for (const email of emails) {
        await send(
          serviceId,
          templateId,
          {
            to_email: email,
          },
          userId,
        );
      }
    } else {
      console.log('Failed to fetch email JS config.');
    }
  };

  const handleAddWhiteLIST = async (data: any) => {
    try {
      setIsLoading(true);
      const { addresses, emails } = data;
      const appendHash = await writeContract(config, {
        chainId: isDev ? sepolia.id : mainnet.id,
        address: ticketAddress as Address,
        functionName: 'appendToWhitelist',
        abi: TICKET_WITH_WHITELIST_ABI,
        args: [addresses.map((address: any) => address.address)],
      });

      const { status: appendStatus } = await waitForTransactionReceipt(config, {
        hash: appendHash,
        timeout: 6000_000,
      });

      if (appendStatus === 'success') {
        showToast({
          message: 'Addresses added to whitelist',
        });
        refetch?.();
        reset();
        if (emails.length > 0) {
          await handleSendEmails(emails);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function () {
      const text = reader.result as string;
      const lines = text.split('\n').map((line) => line.trim());
      const newAddress = [...addressesFields.map((field) => field.address)];
      const isAddress = (add: string) => {
        if (add.length !== 42) return false;
        return /^0x[a-fA-F0-9]{40}$/.test(add);
      };
      lines.forEach((line) => {
        if (isAddress(line) && !newAddress.includes(line)) {
          newAddress.push(line);
        }
      });

      setValue(
        'addresses',
        newAddress.map((address) => ({ address })),
      );
    };
    reader.readAsText(file);
  };

  const addresses = ticket[9]?.result || [];

  const [balances, setBalances] = useState<any[]>([]);

  const fetchBalances = async () => {
    try {
      const validAddresses = addresses.slice(1);
      const results = await Promise.all(
        validAddresses.map(async (address: string) => {
          if (!isAddress(address)) {
            return { result: 0n };
          }
          try {
            const balance = await readContract(config, {
              address: ticketAddress as Address,
              abi: ticket[8]?.result ? TICKET_WITH_WHITELIST_ABI : TICKET_ABI,
              functionName: 'balanceOf',
              args: [address as Address],
              chainId: isDev ? sepolia.id : mainnet.id,
            });
            return { result: balance };
          } catch (error) {
            console.error(`Error fetching balance for ${address}:`, error);
            return { result: 0n };
          }
        }),
      );
      setBalances(results);
    } catch (error) {
      console.error('Error fetching balances:', error);
      setBalances([]);
    }
  };

  useEffect(() => {
    if (addresses.length > 0 && isAddress(ticketAddress)) {
      fetchBalances();
    }
  }, [addresses, ticketAddress]);

  return (
    <Stack spacing="30px" mt="30px">
      <Stack spacing="10px">
        <Stack direction="row" spacing="10px" alignItems="center">
          <ArrowDownSquare />
          <Typography variant="subtitleMB">Whitelist</Typography>
        </Stack>
        <Stack direction="row" spacing="10px" alignItems="center">
          <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
            Total Invites Sent:
          </Typography>
          <Typography variant="bodyMB">0</Typography>
        </Stack>
      </Stack>
      <Stack spacing="20px">
        <Stack spacing="10px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="bodyBB">Approved Addresses</Typography>
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              sx={{
                p: '3px 14px',
                color: '#fff',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
              }}
            >
              Import Addresses (CSV)
              <VisuallyHiddenInput
                onChange={handleChangeFile}
                accept=".csv, .text, .txt"
                type="file"
              />
            </Button>
          </Stack>
          <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
            Upload addresses of individuals to directly gain access to mint this
            ticket. These users will directly interact and pay the set
            contributing amount to the ticket contract.
          </Typography>
          {addressesFields.length ? (
            <Stack spacing="20px" sx={{ mt: '20px !important' }}>
              {addressesFields.map((field, index) => (
                <Stack spacing="10px" key={field.id}>
                  <Stack direction="row" spacing="10px" alignItems="center">
                    <Controller
                      control={control}
                      name={`addresses.${index}.address`}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.addresses?.[index]}
                          helperText={
                            errors.addresses?.[index]?.address?.message
                          }
                        />
                      )}
                    />
                    <IconButton
                      disabled={addressesFields.length === 1}
                      onClick={() =>
                        addressesFields.length > 1 && addressesRemove(index)
                      }
                    >
                      <XCricleIcon size={6} color="rgba(255, 255, 255, 0.5)" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : null}
        </Stack>
        <ZuButton
          startIcon={<PlusIcon size={4} />}
          sx={{ width: '100%', p: '10px', fontWeight: 600 }}
          onClick={() => addressesAppend({ address: '' })}
        >
          Add Address
        </ZuButton>
      </Stack>
      <Stack spacing="10px">
        <Typography variant="bodyBB">
          Send email invitations (optional)
        </Typography>
        <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
          Input corresponding emails of the eth addresses to be sent a
          notification link to mint this ticket.
        </Typography>
        <Controller
          control={control}
          name="emails"
          render={({ field }) => (
            <TextField
              multiline
              rows={4}
              placeholder="simon@ecf.network, reno@ecf.network"
              {...field}
            />
          )}
        />
      </Stack>
      <Stack
        sx={{ cursor: 'pointer' }}
        padding="10px 20px"
        borderRadius="10px"
        border="1px solid #383838"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing="10px"
          onClick={(e) => {
            e.stopPropagation();
            setOpenWhitelist((v) => !v);
          }}
        >
          <Typography variant="bodyM">
            View existing list of addresses added
          </Typography>
          <Stack direction="row" spacing="10px">
            {openWhitelist && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (addresses.length > 0 && isAddress(ticketAddress)) {
                    fetchBalances();
                  }
                }}
                sx={{
                  p: 0,
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <RefreshIcon size={4.5} />
              </IconButton>
            )}
            <ChevronDownIcon size={4.5} />
          </Stack>
        </Stack>
        <Collapse in={openWhitelist}>
          <Stack spacing="10px" mt="10px">
            {addresses.slice(1).map((address: string, index: number) => (
              <Stack
                key={index}
                direction="row"
                spacing="10px"
                alignItems="center"
              >
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  lineHeight={1.2}
                  sx={{ opacity: 0.8 }}
                >
                  {formatAddressString(address)}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color:
                      balances?.[index]?.result > 0n ? '#7DFFD1' : '#FF7D7D',
                    ml: 1,
                  }}
                >
                  {balances?.[index]?.result > 0n
                    ? 'Ticket Claimed'
                    : 'Not Claimed Yet'}
                </Typography>

                <CopyToClipboard text={address}>
                  <IconButton sx={{ p: 0, color: 'rgba(255, 255, 255, 0.5)' }}>
                    <Square2StackIcon size={4.5} />
                  </IconButton>
                </CopyToClipboard>

                <IconButton
                  sx={{
                    p: 0,
                    color: 'rgba(255, 255, 255, 0.5)',
                    position: 'relative',
                    top: '-1px',
                  }}
                  onClick={() => {
                    window.open(
                      isDev
                        ? `https://sepolia.scrollscan.com/address/${address}`
                        : `https://scrollscan.com/address/${address}`,
                      '_blank',
                    );
                  }}
                >
                  <ArrowTopRightSquareIcon size={4.5} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </Stack>
      <ButtonGroup
        handleBack={onClose!}
        handleNext={handleSubmit(handleAddWhiteLIST)}
        isConfirmButton
        isBackButton={false}
        isLoading={isLoading}
      />
    </Stack>
  );
};
