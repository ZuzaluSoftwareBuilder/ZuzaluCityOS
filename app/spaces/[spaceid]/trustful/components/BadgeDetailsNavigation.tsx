'use client';

import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTrustful } from '@/context/TrustfulContext';
import { GiveBadgeStepAddress } from './GiveBadge';
import { ArrowIcon, ArrowIconVariant } from '@/components/icons/ArrowIcon';

export const BadgeDetailsNavigation = ({
  isDetail = false,
  isFeedback = false,
}: {
  isDetail?: boolean;
  isFeedback?: boolean;
}) => {
  const { setAddressStep } = useTrustful();
  const router = useRouter();
  const handleBack = () => {
    setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
  };

  if (isDetail) {
    return (
      <Box
        className="w-full flex items-center p-4"
        onClick={() => {
          router.back();
        }}
      >
        <Flex className="cursor-pointer p-2 opacity-80" color="white">
          <ArrowIcon variant={ArrowIconVariant.LEFT} />
        </Flex>
        <Flex justifyContent={'center'} className="w-full">
          <Text className="text-slate-50 text-sm font-medium uppercase leading-none tracking-wide">
            BADGE DETAILS
          </Text>
        </Flex>
      </Box>
    );
  }

  return !isFeedback ? (
    <Box className="w-full flex items-center p-4">
      <Flex
        onClick={handleBack}
        className="cursor-pointer p-2 opacity-80"
        color="white"
      >
        <ArrowIcon variant={ArrowIconVariant.LEFT} />
      </Flex>
      <Flex justifyContent={'center'} className="w-full">
        <Text className="text-slate-50 text-sm font-medium uppercase leading-none tracking-wide">
          BADGE DETAILS
        </Text>
      </Flex>
    </Box>
  ) : isFeedback ? (
    <Box className="w-full flex items-center p-4">
      <Flex
        onClick={handleBack}
        className="cursor-pointer p-2 opacity-80"
        color="white"
      >
        <CloseIcon />
      </Flex>
    </Box>
  ) : null;
};
