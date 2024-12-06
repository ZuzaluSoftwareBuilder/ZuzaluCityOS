'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { getEllipsedAddress } from '@/utils/format';
import { BlockfulLogo, QrCodeIcon } from '@/components/icons';
import { QRCodeGiveBadge } from '@/app/spaces/[spaceid]/trustful/share/components';
import {
  CopyToClipboardButton,
  TheFooterNavbar,
  TheHeader,
} from '@/app/spaces/[spaceid]/trustful/components';

export const ShareSection = () => {
  const { address, chain } = useAccount();
  const { push } = useRouter();

  // const { villagerAttestationCount } = useContext(WalletContext);
  const villagerAttestationCount = Number(1);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      toast.error(
        <span className="flex flex-col">
          <strong>You have not checked in.</strong>{' '}
          <p>Please check-in first.</p>
        </span>,
      );
      push('/pre-checkin');
    }
  }, [villagerAttestationCount]);

  return (
    <Flex flexDirection="column" minHeight="10vh" marginBottom="60px">
      {villagerAttestationCount !== null ? (
        <>
          <TheHeader />
          <Box
            flex={1}
            as="main"
            className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col items-center lg-c:pr-[256px]"
            gap={6}
          >
            <Card
              className="px-8 py-6 mt-6 relative"
              background={'#212223'}
              border={2}
            >
              <Flex className="absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 border dark:border-[#161617] border-[#707572] bg-[#F6F6F6] dark:bg-[#212322] rounded-full w-[72px] h-[72px] flex items-center justify-center">
                <QrCodeIcon className="w-10 h-10 text-lime-400" />
              </Flex>
              <CardHeader
                gap={2}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                flexDirection={'column'}
                p={0}
                pt={6}
              >
                <Flex className={'items-center'}>
                  <Text className="text-center text-lime-400 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                    Share your profile
                  </Text>
                </Flex>
                <Flex className={'items-center'} gap={2}>
                  <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                    Connect with your friends and attest your history!
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody display={'flex'} flexDirection={'column'} p={0}>
                <Flex
                  alignItems={'center'}
                  justifyContent={'center'}
                  flexDirection={'column'}
                >
                  {address && chain ? (
                    <>
                      <QRCodeGiveBadge />
                      <Flex
                        color="white"
                        className="justify-center items-center gap-2"
                      >
                        <CopyToClipboardButton
                          isUserAddress={true}
                          showSvg={true}
                          svgClassName="ml-1"
                        >
                          {getEllipsedAddress(address)}
                        </CopyToClipboardButton>
                      </Flex>
                    </>
                  ) : (
                    'NO WALLET CONNECTED'
                  )}
                </Flex>
              </CardBody>
            </Card>
            <Link href="https://www.blockful.io" isExternal>
              <Flex direction={'column'} gap={2}>
                <p className="text-xs font-medium leading-3 uppercase tracking-wider text-gray-200 opacity-50 text-center">
                  Created by
                </p>
                <BlockfulLogo />
              </Flex>
            </Link>
          </Box>
          <Box className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full items-center">
            <TheFooterNavbar />
          </Box>
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
