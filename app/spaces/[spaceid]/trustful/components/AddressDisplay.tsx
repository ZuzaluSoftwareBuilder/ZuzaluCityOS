'use client';

import { Flex, Text } from '@chakra-ui/react';
import { EthereumAddress } from '../utils/types';
import { CopyToClipboardButton } from './CopyToClipboardButton';
import { OutboundLinkButton } from './OutboundLink';
import { getEllipsedAddress } from '@/utils/format';

interface AddressDisplayProps {
  userAddress: EthereumAddress | `0x${string}` | null;
  copyToClipboard?: boolean;
  showClipboardSvg?: boolean;
  customClassName?: boolean;
  clipboardClassName?: string;
  externalLink?: boolean;
}

export const AddressDisplay = ({
  userAddress,
  copyToClipboard = false,
  showClipboardSvg = false,
  customClassName = false,
  clipboardClassName = '',
  externalLink = false,
}: AddressDisplayProps) => {
  if (typeof userAddress === 'string') {
    userAddress = new EthereumAddress(userAddress);
  }

  return (
    <Flex gap={4} justifyContent="start" alignItems="center">
      <Text
        className={
          customClassName
            ? clipboardClassName
            : 'text-slate-50 opacity-70 text-sm font-normal leading-tight'
        }
      >
        {copyToClipboard ? (
          <CopyToClipboardButton
            showSvg={showClipboardSvg}
            label={userAddress?.address}
            svgClassName={showClipboardSvg ? 'ml-1' : ''}
          >
            {getEllipsedAddress(userAddress?.address)}
          </CopyToClipboardButton>
        ) : (
          <>{getEllipsedAddress(userAddress?.address)}</>
        )}
        {externalLink && (
          <OutboundLinkButton
            label={`https://scrollscan.com/address/${userAddress?.address}`}
            svgClassName="cursor-pointer text-center ml-1"
          />
        )}
      </Text>
    </Flex>
  );
};
