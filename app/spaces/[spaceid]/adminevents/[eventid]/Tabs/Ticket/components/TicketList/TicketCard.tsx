import React, { useEffect, useState } from 'react';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import { CheckCircleIcon, EyeSlashIcon, CheckIcon } from 'components/icons';
import Image from 'next/image';
import { shortenAddress } from '@/utils/format';
import { mUSDC_TOKEN } from '@/constant';
import { Contract, RegistrationAndAccess } from '@/types';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { client } from '@/context/WalletContext';
type Anchor = 'top' | 'left' | 'bottom' | 'right';

export type TicketCardProps = {
  // name: string;
  // price: string;
  // open: string;
  // status: boolean;
  // sold: number;
  // tokenSymbol?: string;
  // address: string;
  ticket: any;
  index: number;
  ticketAddresses: Array<string>;
  setToggleAction?: React.Dispatch<React.SetStateAction<string>>;
  setVaultIndex?: React.Dispatch<React.SetStateAction<number>>;
  onToggle?: (anchor: Anchor, open: boolean) => void;
  eventContract?: Contract;
  regAndAccess?: RegistrationAndAccess;
};

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  index,
  ticketAddresses,
  setVaultIndex,
  setToggleAction,
  eventContract,
  onToggle = (anchor: Anchor, open: boolean) => {},
  regAndAccess,
}) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  const [decimal, setDecimal] = useState<number>(18);
  let status = true;

  useEffect(() => {
    const fetchDecimal = async () => {
      const decimalValue = (await client.readContract({
        address: ticket[2]?.result,
        abi: ERC20_ABI,
        functionName: 'decimals',
      })) as number;
      setDecimal(decimalValue);
    };

    fetchDecimal();
  }, [ticket]);

  const currentTicket = regAndAccess?.scrollPassTickets?.find(
    (ticket) =>
      ticket.contractAddress.toLowerCase() ===
      ticketAddresses[index].toLowerCase(),
  );
  const isChecked = currentTicket?.checkin === '1';

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing="10px"
      borderRadius="10px"
      padding="10px"
      bgcolor="#2d2d2d"
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        setToggleAction && setToggleAction('ViewVault');
        onToggle('right', true);
        setVaultIndex && setVaultIndex(index);
      }}
    >
      <Image
        alt={''}
        src={eventContract?.image_url || '/24.webp'}
        loader={() => eventContract?.image_url || '/24.webp'}
        width={100}
        height={100}
        objectFit="cover"
        style={{
          width: isMobile ? '100%' : '100px',
          height: isMobile ? '100%' : '100px',
        }}
      />
      <Stack direction="column" spacing="14px" width="100%">
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          gap="20px"
        >
          <Stack
            gap="10px"
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
          >
            <Typography fontSize={24} fontWeight={700} lineHeight={1.2}>
              {ticket[0]?.result}
            </Typography>
          </Stack>
          <Stack spacing="5px" alignItems="center" direction="row">
            <Stack alignItems="center" direction="row" spacing="10px">
              <Stack direction="row" alignItems="center" spacing="5px">
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  lineHeight={1.2}
                  sx={{ opacity: 0.7 }}
                >
                  {(ticket[3].result / BigInt(10 ** decimal)).toString()}{' '}
                </Typography>
                <Typography
                  fontSize={10}
                  lineHeight={1.2}
                  sx={{ opacity: 0.7 }}
                >
                  {ticket[2]?.result === mUSDC_TOKEN ? 'USDC' : 'USDT'}
                </Typography>
              </Stack>
              {isChecked && (
                <Stack alignItems="center" direction="row">
                  <CheckIcon size={4} />
                  <Typography
                    fontSize={10}
                    lineHeight={1.2}
                    sx={{ opacity: 0.7, whiteSpace: 'nowrap' }}
                  >
                    CHECK-IN ENABLED
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="center"
        >
          <Stack
            direction="row"
            alignItems="center"
            padding="3px 6px"
            spacing="6px"
            borderRadius="10px"
            sx={{ backgroundColor: 'rgba(125, 255, 209, 0.10)' }}
          >
            {status ? (
              <CheckCircleIcon color="#7DFFD1" size={5} />
            ) : (
              <EyeSlashIcon color="#C09965" size={5} />
            )}
            <Typography
              color={status ? '#7DFFD1' : '#C09965'}
              fontSize={13}
              lineHeight={1.4}
            >
              {status ? 'Available' : 'Hidden'}
            </Typography>
          </Stack>
          <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.7 }}>
            Sold: {String(ticket[4]?.result)}
          </Typography>
        </Stack>
        <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.5 }}>
          ADDRESS: {shortenAddress(ticketAddresses[index])}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TicketCard;
