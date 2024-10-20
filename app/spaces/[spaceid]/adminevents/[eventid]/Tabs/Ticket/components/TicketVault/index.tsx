import {
  CopyIcon,
  GoToExplorerIcon,
  ScrollIcon,
  USDCIcon,
  USDTIcon,
} from '@/components/icons';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { SendNFTTicket, WithdrawToken, Whitelist } from './component';
import React, { useEffect, useState } from 'react';
import { SCROLL_EXPLORER, mUSDC_TOKEN } from '@/constant';
import { shortenAddress } from '@/utils/format';
import { client } from '@/context/WalletContext';
import { Address, GetEnsNameReturnType } from 'viem';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { Contract, Event } from '@/types';
interface ITicketVault {
  vaultIndex: number;
  ticketAddresses: Array<string>;
  tickets: Array<any>;
  eventContracts: Contract[];
  refetch: () => void;
  onClose: () => void;
  event: Event;
}

const TicketVault = ({
  vaultIndex,
  ticketAddresses,
  tickets,
  eventContracts,
  refetch,
  onClose,
  event,
}: ITicketVault) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  const [action, setAction] = React.useState('Withdraw');
  const [controller, setController] = useState<GetEnsNameReturnType>('');
  const [balance, setBalance] = useState<number>(0);

  let ticketAddress = ticketAddresses[vaultIndex];
  let ticket = tickets[vaultIndex];
  const eventContract = eventContracts.find((contract) => {
    if (contract.contractAddress) {
      return (
        contract.contractAddress.trim().toLowerCase() ===
        ticketAddresses[vaultIndex].trim().toLowerCase()
      );
    }
  });
  const getInfoFromContract = async () => {
    //Apparently scroll sepolia doesn't support ens
    {
      /*const ensName = await client.getEnsName({
      address: ticket[7].result,
    });
        //setController(ensName);*/
    }

    const balance = (await client.readContract({
      address: ticket[2]?.result as Address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [ticketAddress],
    })) as bigint;

    setBalance(Number(balance / BigInt(10 ** 18)));
  };

  useEffect(() => {
    getInfoFromContract();
  }, [ticketAddress]);

  return (
    <Stack
      sx={{
        background: '#222',
        width: '700px',
      }}
    >
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '10px 10px 20px',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          marginTop={'10px'}
        >
          <Image
            alt={''}
            src={eventContract?.image_url || '/24.webp'}
            loader={() => eventContract?.image_url || '/24.webp'}
            width={100}
            height={100}
            objectFit="cover"
            style={{
              width: isMobile ? '100%' : undefined,
              height: isMobile ? '100%' : undefined,
            }}
          />
          <Stack direction="column" spacing={0.9}>
            <Typography
              variant="h5"
              fontSize="24px"
              fontFamily={'Inter'}
              lineHeight={'120%'}
              color="white"
            >
              {ticket[0]?.result}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Status:
              </Typography>{' '}
              <Typography
                fontSize="16px"
                color="#7DFFD1"
                fontWeight={'600'}
                lineHeight={'120%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                Available: To All
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Price:
              </Typography>
              <Typography
                fontSize="16px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {(ticket[3]?.result / BigInt(10 ** 18)).toString()}
              </Typography>
              <Typography
                fontSize="10px"
                color="white"
                fontWeight={'400'}
                marginLeft={'2px'}
                lineHeight={'120%'}
                letterSpacing={'0.2'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {ticket[2]?.result === mUSDC_TOKEN ? 'USDC' : 'USDT'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
                sx={{ opacity: '0.6' }}
              >
                Address:
              </Typography>
              <Typography
                fontSize="14px"
                color="white"
                fontWeight={'400'}
                lineHeight={'160%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {shortenAddress(ticketAddress)}
              </Typography>

              <Box marginLeft={'4px'} sx={{ cursor: 'pointer' }}>
                <CopyIcon cursor="pointer" />
              </Box>

              <Box
                marginLeft={'4px'}
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  window.open(
                    `${SCROLL_EXPLORER}/address/${ticketAddress}`,
                    '_blank',
                  )
                }
              >
                <GoToExplorerIcon cursor="pointer" />
              </Box>
            </Box>
            {controller && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  fontSize="14px"
                  fontFamily={'Inter'}
                  lineHeight={'160%'}
                  color="white"
                  sx={{ opacity: '0.6' }}
                >
                  Controller:
                </Typography>
                <Typography
                  fontSize="14px"
                  color="white"
                  fontWeight={'400'}
                  lineHeight={'160%'}
                  marginLeft={'10px'}
                  sx={{
                    opacity: '0.8',
                  }}
                >
                  {controller}
                </Typography>

                <Box marginLeft={'4px'} sx={{ cursor: 'pointer' }}>
                  <CopyIcon cursor="pointer" />
                </Box>

                <Box
                  marginLeft={'4px'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(
                      `${SCROLL_EXPLORER}/address/${controller}`,
                      '_blank',
                    )
                  }
                >
                  <GoToExplorerIcon cursor="pointer" />
                </Box>
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>

      <Stack padding={'20px'}>
        <Box marginBottom={'20px'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
            }}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Total Revenue:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="18px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
              >
                {balance}
              </Typography>
              <Typography
                fontSize="10px"
                color="white"
                fontWeight={'400'}
                marginLeft={'4px'}
                lineHeight={'120%'}
                letterSpacing={'0.2'}
                sx={{
                  opacity: '0.5',
                }}
              >
                {ticket[2]?.result === mUSDC_TOKEN ? 'USDC' : 'USDT'}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Receiving Token:
            </Typography>
            <Box
              padding={'4px 10px'}
              borderRadius="10px"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {ticket[2]?.result === mUSDC_TOKEN ? <USDCIcon /> : <USDTIcon />}

              <Typography
                fontSize="14px"
                color="white"
                marginLeft="8px"
                fontWeight={'600'}
                lineHeight={'160%'}
              >
                {ticket[2]?.result === mUSDC_TOKEN ? 'USDC' : 'USDT'}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Type:
            </Typography>
            <Typography
              fontSize="16px"
              color="white"
              fontWeight={'700'}
              lineHeight={'120%'}
            >
              {ticket[8]?.result ? 'Whitelist' : 'Permissionless'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Total Sold:
            </Typography>
            <Typography
              fontSize="16px"
              color="white"
              fontWeight={'700'}
              lineHeight={'120%'}
            >
              {String(ticket[4]?.result)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Transactions:
            </Typography>
            <Box
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Typography
                fontSize="16px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
                marginRight={'5px'}
              >
                Scrollscan
              </Typography>
              <Box
                marginLeft={'4px'}
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  window.open(
                    `${SCROLL_EXPLORER}/address/${ticketAddress}`,
                    '_blank',
                  )
                }
              >
                <GoToExplorerIcon cursor="pointer" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Box
        padding={3}
        marginX={isMobile ? undefined : 3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          sx={{
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {ticket[9]?.result ? (
            <Typography
              onClick={() => setAction('Whitelist')}
              textAlign={'center'}
              width={'100%'}
              paddingY={'8px'}
              sx={{
                cursor: 'pointer',

                borderRadius: `${action === 'Whitelist' ? '8px' : null}`,

                border: `${action === 'Whitelist' ? '1px solid rgba(255, 255, 255, 0.10)' : null}`,

                background: `${action === 'Whitelist' ? 'rgba(255, 255, 255, 0.10)' : null}`,
              }}
            >
              Whitelist
            </Typography>
          ) : null}
          <Typography
            onClick={() => setAction('Withdraw')}
            textAlign={'center'}
            paddingY={'8px'}
            width={'100%'}
            sx={{
              cursor: 'pointer',
              borderRadius: `${action === 'Withdraw' ? '8px' : null}`,
              border: `${action === 'Withdraw' ? '1px solid rgba(255, 255, 255, 0.10)' : null}`,
              background: `${action === 'Withdraw' ? 'rgba(255, 255, 255, 0.10)' : null}`,
            }}
          >
            Withdraw Token
          </Typography>
          <Typography
            onClick={() => setAction('SendTicket')}
            textAlign={'center'}
            width={'100%'}
            paddingY={'8px'}
            sx={{
              cursor: 'pointer',
              borderRadius: `${action === 'SendTicket' ? '8px' : null}`,
              border: `${action === 'SendTicket' ? '1px solid rgba(255, 255, 255, 0.10)' : null}`,
              background: `${action === 'SendTicket' ? 'rgba(255, 255, 255, 0.10)' : null}`,
            }}
          >
            Send Ticket
          </Typography>
        </Box>

        {action === 'Withdraw' ? (
          <WithdrawToken
            refetch={refetch}
            tokenSymbol={ticket[2]?.result}
            balance={balance}
            ticketAddress={ticketAddress}
            tokenAddress={ticket[2]?.result}
            ticket={ticket}
          />
        ) : action === 'SendTicket' ? (
          <SendNFTTicket
            ticketAddress={ticketAddress}
            ticket={ticket}
            eventContract={eventContract as Contract}
          />
        ) : ticket[9]?.result ? (
          <Whitelist
            refetch={refetch}
            vaultIndex={vaultIndex}
            ticketAddresses={ticketAddresses}
            tickets={tickets}
            onClose={onClose}
            event={event}
          />
        ) : null}

        <Stack
          direction="row"
          marginTop={'20px'}
          justifyContent="center"
          spacing="10px"
          alignItems="center"
        >
          <Typography variant="caption">POWERED BY</Typography>

          <ScrollIcon />
        </Stack>
      </Box>
    </Stack>
  );
};

export default TicketVault;
