import {
  CopyIcon,
  GoToExplorerIcon,
  ScrollIcon,
  USDCIcon,
  USDTIcon,
} from '@/components/icons';
import { PreviewFile } from '@/components/PreviewFile/PreviewFile';
import { useUploaderPreview } from '@/components/PreviewFile/useUploaderPreview';
import { SCROLL_EXPLORER, mUSDC_TOKEN } from '@/constant';
import { client } from '@/context/WalletContext';
import { updateTicketImage } from '@/services/event/updateContractImage';
import { Contract, Event } from '@/types';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { shortenAddress } from '@/utils/format';
import { Uploader3 } from '@lxdao/uploader3';
import { Box, Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Address, GetEnsNameReturnType } from 'viem';
import { SendNFTTicket, Whitelist, WithdrawToken } from './component';
interface ITicketVault {
  vaultIndex: number;
  ticketAddresses: Array<string>;
  tickets: Array<any>;
  eventContracts: Contract[];
  refetch: () => void;
  onClose: () => void;
  event: Event;
  setBlockClickModal: (value: boolean) => void;
}

const TicketVault = ({
  vaultIndex,
  ticketAddresses,
  tickets,
  eventContracts,
  refetch,
  onClose,
  event,
  setBlockClickModal = () => {},
}: ITicketVault) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  const [action, setAction] = React.useState('Withdraw');
  const [controller, setController] = useState<GetEnsNameReturnType>('');
  const [balance, setBalance] = useState<number>(0);
  const [decimal, setDecimal] = useState<number>(0);
  const avatarUploader = useUploaderPreview();
  const queryClient = useQueryClient();

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
    const decimal = (await client.readContract({
      address: ticket[2]?.result,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number;
    setDecimal(decimal);
    const balance = (await client.readContract({
      address: ticket[2]?.result as Address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [ticketAddress],
    })) as bigint;

    setBalance(Number(balance / BigInt(10 ** decimal)));
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
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          marginTop={'10px'}
        >
          {/*<Image
            alt={''}
            src={eventContract?.image_url || '/24.webp'}
            loader={() => eventContract?.image_url || '/24.webp'}
            width={100}
            height={100}
            objectFit="cover"
            style={{
              width: isMobile ? '100%' : undefined,
              height: isMobile ? '100%' : '100px',
            }}
          />*/}
          <Stack>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <PreviewFile
                sx={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '10px',
                }}
                src={avatarUploader.getUrl() || eventContract?.image_url}
                errorMessage={avatarUploader.errorMessage()}
                isLoading={avatarUploader.isLoading()}
              />
              <Stack direction="column" spacing={1}>
                <Uploader3
                  accept={['.gif', '.jpeg', '.gif', '.png']}
                  api={'/api/file/upload'}
                  multiple={false}
                  crop={false}
                  onUpload={(file) => {
                    avatarUploader.setFile(file);
                  }}
                  onComplete={(file) => {
                    avatarUploader.setFile(file);
                  }}
                >
                  <Button
                    component="span"
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                      width: '100px',
                      height: '30px',
                      fontSize: '10px',
                    }}
                  >
                    Change Image
                  </Button>
                </Uploader3>
                {avatarUploader.getUrl() && (
                  <Button
                    onClick={async () => {
                      setBlockClickModal(true);
                      try {
                        await updateTicketImage({
                          eventId: event.id,
                          contractAddress: ticketAddress,
                          image_url: avatarUploader.getUrl()!,
                        });
                        console.log(
                          'Update image with:',
                          avatarUploader.getUrl()!,
                        );
                      } catch (error) {
                        console.error('Failed to update image:', error);
                      } finally {
                        avatarUploader.setFile(undefined);
                        setBlockClickModal(false);
                        queryClient.invalidateQueries({
                          queryKey: ['fetchEventById'],
                        });
                      }
                    }}
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      backgroundColor: '#373737',
                      border: '1px solid #383838',
                      width: '100px',
                      height: '30px',
                      fontSize: '10px',
                    }}
                  >
                    Update Image
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
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
                Available: To whitelisted addresses
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
                {(ticket[3]?.result / BigInt(10 ** decimal)).toString()}
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
        <Box>
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
              paddingY={'6px'}
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
            paddingY={'6px'}
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
            paddingY={'6px'}
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
