'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  Flex,
  Text,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { scroll, scrollSepolia } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';
import { useTrustful } from '@/context/TrustfulContext';
import {
  BadgeStatus,
  BadgeTagIcon,
} from '@/app/spaces/[spaceid]/trustful/my-badges/components';
import { getEllipsedAddress } from '@/utils/format';
import {
  isDev,
  TRUSTFUL_SCHEMAS,
} from '@/app/spaces/[spaceid]/trustful/constants/constants';
import {
  AttestationRequestData,
  submitAttest,
  revoke,
} from '@/app/spaces/[spaceid]/trustful/service';
import { HeartLoveIcon, UserIcon } from '@/components/icons';
import {
  BadgeDetailsNavigation,
  CopyToClipboardButton,
  OutboundLinkButton,
  TheHeader,
  TheFooterNavbar,
} from '@/app/spaces/[spaceid]/trustful/components';
import toast from 'react-hot-toast';
import { Address } from 'viem';

export const MyBadgeDetails = () => {
  const { address, chainId } = useAccount();
  const { setSelectedBadge, selectedBadge } = useTrustful();
  const { push } = useRouter();
  const params = useParams();

  // const { villagerAttestationCount } = useContext(WalletContext);
  const villagerAttestationCount = Number(1);
  const { switchChain } = useSwitchChain();
  const actualURL = `/spaces/${params.spaceid}/trustful/my-badges`;

  const toastSwitchRightNetwork = () => {
    if (isDev ? chainId !== scrollSepolia.id : chainId !== scroll.id) {
      toast.error(
        <span className="flex flex-col">
          <strong>Unsupported network.</strong>{' '}
          <p>
            Please switch to the
            {isDev ? 'Scroll Sepolia' : 'Scroll'} network.
          </p>
        </span>,
      );
      switchChain({ chainId: isDev ? scrollSepolia.id : scroll.id });
      return;
    }
  };

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
    if (selectedBadge) {
      setBadgeStatus(selectedBadge?.status);
      setAttestResponseId(selectedBadge?.responseId);
    } else {
      push(`${actualURL}`);
    }
  }, [villagerAttestationCount]);

  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [loadingDeny, setLoadingDeny] = useState<boolean>(false);
  const [badgeStatus, setBadgeStatus] = useState<BadgeStatus>(
    BadgeStatus.PENDING,
  );
  const [attestResponseId, setAttestResponseId] = useState<string>();

  const canProcessAttestation = () => {
    if (!selectedBadge) {
      setLoadingConfirm(false);
      setLoadingDeny(false);

      toast.error(
        <span className="flex flex-col">
          <strong>No badge selected.</strong> <p>Please select a badge.</p>
        </span>,
      );

      return false;
    }

    if (!address) {
      setLoadingConfirm(false);
      setLoadingDeny(false);

      toast.error(
        <span className="flex flex-col">
          <strong>No account connected.</strong>{' '}
          <p>Please connect your wallet.</p>
        </span>,
      );
      return false;
    }
    return true;
  };

  const processAttestationResponse = async (
    response: any,
    isConfirm: boolean | null,
  ) => {
    toastSwitchRightNetwork();
    if (response instanceof Error) {
      setLoadingConfirm(false);
      setLoadingDeny(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Error while processing attestation.</strong>{' '}
          <p>Transaction Rejected</p>
        </span>,
      );
      return;
    }

    if (response.status !== 'success') {
      setLoadingConfirm(false);
      setLoadingDeny(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Error while processing attestation.</strong>{' '}
          <p>Contract execution reverted</p>
        </span>,
      );
      return;
    }
    if (selectedBadge) {
      selectedBadge.revoked = true;
      setSelectedBadge(selectedBadge);
    }

    toast.success(
      <span className="flex flex-col">
        <strong>Badge sent successfully.</strong>{' '}
        <p>
          {`https://scrollscan.com/tx/${response.transactionHash}.${response.transactionHash}`}
        </p>
      </span>,
    );

    if (isConfirm === null) {
      setBadgeStatus(BadgeStatus.PENDING);
    } else {
      if (!(response instanceof Error)) {
        if (isConfirm) {
          setBadgeStatus(BadgeStatus.CONFIRMED);
        } else {
          setBadgeStatus(BadgeStatus.REJECTED);
        }
        setAttestResponseId(response.logs[0].data);
      }
    }
    setLoadingConfirm(false);
    setLoadingDeny(false);

    return;
  };

  // Submit attestation
  const handleAttest = async (isConfirm: boolean) => {
    toastSwitchRightNetwork();

    if (!canProcessAttestation()) return;

    const data = encodeAbiParameters(
      parseAbiParameters(TRUSTFUL_SCHEMAS.ATTEST_RESPONSE.data),
      [isConfirm],
    );
    const attestationRequestData: AttestationRequestData = {
      recipient: selectedBadge?.attester as `0x${string}`,
      expirationTime: BigInt(0),
      revocable: true,
      refUID: selectedBadge?.id as `0x${string}`,
      data: data,
      value: BigInt(0),
    };

    const response = await submitAttest(
      address as `0x${string}`,
      TRUSTFUL_SCHEMAS.ATTEST_RESPONSE.uid,
      attestationRequestData,
    );
    processAttestationResponse(response, isConfirm);
    // fetchAttestationResponse();
  };

  // Submit revoke
  const handleRevoke = async () => {
    toastSwitchRightNetwork();
    if (!canProcessAttestation()) return;
    const response = await revoke(
      address as `0x${string}`,
      TRUSTFUL_SCHEMAS.ATTEST_RESPONSE.uid,
      attestResponseId as `0x${string}`,
      0n,
    );
    processAttestationResponse(response, null);
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="100px">
      {villagerAttestationCount !== null && selectedBadge !== null ? (
        <>
          <TheHeader />
          <BadgeDetailsNavigation isDetail={true} />
          <Box
            flex={0}
            as="main"
            px={{ base: 6, sm: '60px' }}
            py={{ base: 2, sm: '20px' }}
            className="justify-center flex items-center flex-col"
            gap={6}
          >
            <Flex gap={4} className="w-full h-full items-top">
              <Flex
                className="flex items-center justify-center"
                py="6px"
                px={'20px'}
              >
                <HeartLoveIcon className="w-8 h-8 opacity-50 text-slate-50" />
              </Flex>
              <Flex flexDirection={'column'} className="w-full">
                <Box>
                  <Text className="text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                    {selectedBadge.title}
                  </Text>
                </Box>
                <Flex gap={2} className="items-center">
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    {new Date(
                      selectedBadge.timeCreated * 1000,
                    ).toLocaleString()}
                  </Text>
                  <BadgeTagIcon status={badgeStatus} />
                </Flex>
              </Flex>
            </Flex>
            <Card
              background={'#F5FFFF0D'}
              className="w-full border border-[#F5FFFF14] border-opacity-[8]"
            >
              <Flex flexDirection={'column'} className="w-full items-center">
                <Flex className="w-full flex-row p-4" gap={4}>
                  <UserIcon />
                  <Flex
                    flexDirection={'column'}
                    gap={2}
                    justifyContent={'center'}
                  >
                    <Text className="text-slate-50 text-sm font-medium leading-none">
                      Issuer
                    </Text>
                    <p className="chakra-text text-slate-50 opacity-70 text-sm font-normal leading-tight css-0">
                      {getEllipsedAddress(selectedBadge.attester as Address)}
                    </p>
                  </Flex>
                </Flex>
                <Divider className="border-slate-50 opacity-10 w-full" />
                <Flex className="w-full flex-row p-4" gap={4}>
                  <UserIcon />
                  <Flex
                    flexDirection={'column'}
                    gap={2}
                    justifyContent={'center'}
                  >
                    <Text className="text-slate-50 text-sm font-medium leading-none">
                      Receiver
                    </Text>
                    <p
                      className="chakra-text text-slate-50 opacity-70 text-sm font-normal leading-tight css-0
                    "
                    >
                      {getEllipsedAddress(selectedBadge.recipient as Address)}
                    </p>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
            {selectedBadge.comment && (
              <Card
                background={'#F5FFFF0D'}
                className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
              >
                <Flex flexDirection={'column'} gap={2} p={4}>
                  <Text className="flex text-slate-50 text-sm font-medium leading-none">
                    Comment
                  </Text>
                  <Textarea
                    color="white"
                    className="px-0 opacity-70 disabled text-slate-50 text-sm font-normal border-none leading-tight"
                    readOnly={true}
                    _readOnly={{
                      opacity: 0.7,
                      cursor: 'not-allowed',
                    }}
                    disabled={true}
                    value={selectedBadge.comment}
                    rows={selectedBadge.comment.length > 50 ? 3 : 1}
                    minH="unset"
                    resize="none"
                  ></Textarea>
                </Flex>
              </Card>
            )}
            <Card
              background={'#F5FFFF0D'}
              className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
            >
              <Flex flexDirection={'column'} gap={2} p={4}>
                <Text className="flex text-slate-50 text-sm font-medium leading-none">
                  Attestation
                </Text>
                <Flex color="white" className="gap-2">
                  <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    <CopyToClipboardButton
                      label={selectedBadge.id}
                      isUserAddress={false}
                    >
                      {getEllipsedAddress(selectedBadge.id as `0x${string}`)}
                    </CopyToClipboardButton>
                    <OutboundLinkButton
                      label={`https://scroll.easscan.org/attestation/view/${selectedBadge.id}`}
                      svgClassName="cursor-pointer text-center ml-1"
                    />
                  </Text>
                </Flex>
              </Flex>
              <Flex flexDirection={'column'} gap={2} p={4}>
                <Text className="flex text-slate-50 text-sm font-medium leading-none">
                  Transaction
                </Text>
                <Flex color="white" className="gap-2">
                  <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    <CopyToClipboardButton
                      label={selectedBadge.txid}
                      isUserAddress={false}
                    >
                      {getEllipsedAddress(selectedBadge.txid as `0x${string}`)}
                    </CopyToClipboardButton>
                    <OutboundLinkButton
                      label={`https://scrollscan.com/tx/${selectedBadge.txid}`}
                      svgClassName="cursor-pointer text-center ml-1"
                    />
                  </Text>
                </Flex>
              </Flex>
              <Flex flexDirection={'column'} gap={2} p={4}>
                <Text className="flex text-slate-50 text-sm font-medium leading-none">
                  Scheme
                </Text>
                <Flex color="white" className="gap-2">
                  <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    <CopyToClipboardButton
                      label={selectedBadge.schema.id}
                      isUserAddress={false}
                    >
                      {getEllipsedAddress(
                        selectedBadge.schema.id as `0x${string}`,
                      )}
                    </CopyToClipboardButton>
                    <OutboundLinkButton
                      label={`https://scroll.easscan.org/schema/view/${selectedBadge.schema.id}`}
                      svgClassName="cursor-pointer text-center ml-1"
                    />
                  </Text>
                </Flex>
              </Flex>
            </Card>
            {selectedBadge.schema.id == TRUSTFUL_SCHEMAS.ATTEST_EVENT.uid &&
              badgeStatus !== BadgeStatus.PENDING && (
                <Button
                  className="w-full flex justify-center items-center bg-[#2d2525] gap-2 px-6 text-[#DB4C40] rounded-lg"
                  _hover={{ color: '#fff', bg: '#DB4C40' }}
                  _active={{ color: '#fff', bg: '#DB4C40' }}
                  bg="#F5FFFF0D"
                  isLoading={loadingDeny}
                  spinner={<BeatLoader size={8} color="white" />}
                  onClick={() => {
                    setLoadingDeny(true);
                    handleRevoke();
                  }}
                >
                  <CloseIcon className="w-[14px] h-[14px]" />
                  Revoke
                </Button>
              )}
          </Box>
          {selectedBadge.schema.id === TRUSTFUL_SCHEMAS.ATTEST_EVENT.uid &&
          badgeStatus === BadgeStatus.PENDING ? (
            <Box className="px-6 py-4 sm:px-[60px] w-full flex gap-3">
              <Button
                className="w-full flex justify-center items-center gap-2 px-6 bg-lime-200 bg-opacity-10 text-[#B1EF42] rounded-lg"
                _hover={{ bg: '#DB4C40', color: '#161617' }}
                _active={{ bg: '#DB4C40', color: '#161617' }}
                isLoading={loadingDeny}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={() => {
                  setLoadingDeny(true);
                  handleAttest(false);
                }}
              >
                <CloseIcon className="w-[14px] h-[14px]" />
                Deny
              </Button>
              <Button
                className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
                _hover={{ bg: '#B1EF42' }}
                _active={{ bg: '#B1EF42' }}
                isLoading={loadingConfirm}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={() => {
                  setLoadingConfirm(true);
                  handleAttest(true);
                }}
              >
                <CheckIcon className="w-[16px] h-[16px]" />
                Confirm
              </Button>
            </Box>
          ) : (
            <Box className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full items-center">
              <TheFooterNavbar />
            </Box>
          )}
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
