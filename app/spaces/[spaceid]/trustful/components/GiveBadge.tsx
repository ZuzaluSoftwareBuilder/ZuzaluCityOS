'use client';

/* eslint-disable no-dupe-else-if */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  ChakraProvider,
  Divider,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { watchAccount } from '@wagmi/core';
import { useSearchParams } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { isAddress, encodeAbiParameters, parseAbiParameters } from 'viem';
import { scroll, scrollSepolia } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';
import {
  ArrowIcon,
  ArrowIconVariant,
  CommentIcon,
  HandHeartIcon,
  UserIcon,
} from '@/components/icons';
import {
  AddressDisplay,
  BadgeDetailsNavigation,
  PasteToClipboardButton,
  TheHeader,
  TheFooterNavbar,
} from '@/app/spaces/[spaceid]/trustful/components';
import { isBytes32 } from '@/utils/format';
import {
  AttestationRequestData,
  hasRole,
  submitAttest,
} from '@/app/spaces/[spaceid]/trustful/service';
import {
  BadgeTitle,
  ZUVILLAGE_BADGE_TITLES,
  TRUSTFUL_SCHEMAS,
  ROLES,
  isDev,
} from '@/app/spaces/[spaceid]/trustful/constants';
import { EthereumAddress } from '@/app/spaces/[spaceid]/trustful/utils/types';
import { useTrustful } from '@/context/TrustfulContext';
import { config } from '@/context/WalletContext';
import toast from 'react-hot-toast';
import chakraTheme from '@/theme/lib/chakra-ui';

export enum GiveBadgeStepAddress {
  INSERT_ADDRESS = 'INSERT_ADDRESS',
  INSERT_BADGE_AND_COMMENT = 'INSERT_BADGE_AND_COMMENT',
  CONFIRMATION = 'CONFIRMATION',
}

export const GiveBadge = () => {
  const { address, chainId } = useAccount();
  const unwatch = watchAccount(config, {
    onChange() {},
  });
  const {
    addressStep,
    setAddressStep,
    badgeInputAddress,
    setBadgeInputAddress,
    inputBadgeTitleList,
    setInputBadgeTitleList,
  } = useTrustful();
  /** Commented for now.
   * TODO: Check if villagerAttestationCount is needed.
   * const { villagerAttestationCount } = useContext(WalletContext);
   */
  const villagerAttestationCount = 1;
  const { switchChain } = useSwitchChain();
  const [badgeReceiverAddress, setBadgeReceiverAddress] =
    useState<EthereumAddress | null>(null);
  const [inputAddress, setInputAddress] = useState<string>('');
  const [inputBadge, setInputBadge] = useState<BadgeTitle>();
  const [commentBadge, setCommentBadge] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const searchParams = useSearchParams();
  const addressShared = searchParams.get('address');

  /** Commented for now. 
   * TODO: Check if 'Checkin/Pre-Checkin' is needed.
   *   useEffect(() => {
          if (Number(villagerAttestationCount) === 0) {
            toast.error('You have not checked in. Please check-in first.');
            push('/pre-checkin');
          }
        }, [villagerAttestationCount]);
   */

  /**
   * Resets the context when the component is mounted for the first time
   */
  useEffect(() => {
    return () => {
      setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
      setBadgeInputAddress(null);
      setBadgeReceiverAddress(null);
    };
  }, []);

  useEffect(() => {
    if (address) {
      setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
      setBadgeInputAddress(null);
      setBadgeReceiverAddress(null);
      setInputBadge(undefined);
      setCommentBadge('');
      setText('');
    }
    return () => {
      unwatch();
    };
  }, [address]);

  // Checks if the shared-address is valid and sets it to the inputAddress
  useEffect(() => {
    if (addressShared && isAddress(addressShared)) {
      setInputAddress(addressShared);
    }
  }, [addressShared]);

  useEffect(() => {
    if (inputBadgeTitleList && inputBadgeTitleList?.length > 18) {
      setInputBadgeTitleList((prevList) =>
        prevList ? prevList?.slice(0, 18) : prevList,
      );
    }
  }, [inputBadgeTitleList]);

  /* Updates the badgeInputAddress when the inputAddress changes */
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      const ethAddress = new EthereumAddress(inputAddress);
      setBadgeInputAddress(ethAddress);
      setBadgeReceiverAddress(ethAddress);
    }
  }, [inputAddress]);

  /* Do not allow invalid Ethereum addresses to move into the next step */
  const handleInputAddressConfirm = () => {
    if (!address) {
      toast.error(
        <span className="flex flex-col">
          <strong>No account connected:</strong>{' '}
          <p>Please connect your wallet.</p>
        </span>,
      );
      return;
    }
    if (badgeInputAddress && isAddress(badgeInputAddress?.address)) {
      setAddressStep(GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT);
    } else if (!inputAddress || !isAddress(inputAddress)) {
      toast.error(
        <span className="flex flex-col">
          <strong>Field is empty.</strong>{' '}
          <p>Please provide a valid Ethereum</p>
          address.
        </span>,
      );
      return;
    } else if (inputAddress && !isAddress(inputAddress)) {
      toast.error(
        <span className="flex flex-col">
          <strong>Invalid Ethereum Address.</strong>{' '}
          <p>Wrong Ethereum address format. Please try again.</p>
        </span>,
      );
    } else {
      setAddressStep(GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT);
    }
  };

  /* Get the current badge selected and move to state */
  const handleBadgeSelectChange = (event: any) => {
    let selectedBadge: BadgeTitle | undefined = undefined;
    ZUVILLAGE_BADGE_TITLES.map((badge) => {
      if (badge.title === event.target.value) {
        selectedBadge = badge;
      }
    });
    if (!selectedBadge) {
      const customBadge: BadgeTitle = {
        title: event.target.value,
        uid: TRUSTFUL_SCHEMAS.ATTEST_EVENT.uid,
        allowComment: true,
        revocable: false,
        data: TRUSTFUL_SCHEMAS.ATTEST_EVENT.data,
        allowedRole: TRUSTFUL_SCHEMAS.ATTEST_EVENT.allowedRole,
      };
      selectedBadge = customBadge;
    }
    setInputBadge(selectedBadge);
  };

  /* Get the current comment and move to state
   * It also updates the textarea height based on the content
   */
  const handleTextareaChange = (event: any) => {
    const textareaLineHeight = 22;
    const scrollHeight = event.target.scrollHeight - 16;

    const currentRows = Math.ceil(scrollHeight / textareaLineHeight);
    if (currentRows >= 2) {
      event.target.rows = currentRows;
    }

    setText(event.target.value);
    setCommentBadge(event.target.value);
  };

  // Changes the continue arrow color based on the status of a valid input address
  const iconColor =
    (inputAddress && isAddress(inputAddress)) ||
    (badgeInputAddress && isAddress(badgeInputAddress?.address) && address)
      ? 'text-[#000000]'
      : 'text-[#F5FFFFB2]';
  const iconBg =
    (inputAddress && isAddress(inputAddress)) ||
    (badgeInputAddress && isAddress(badgeInputAddress?.address) && address)
      ? 'bg-[#B1EF42B2]'
      : 'bg-[#37383A]';

  // Submit attestation
  const handleAttest = async () => {
    if (!address) {
      setLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>No account connected.</strong>{' '}
          <p>Please connect your wallet.</p>
        </span>,
      );
      console.log('!address', !address);
      return;
    }

    if (isDev ? chainId !== scrollSepolia.id : chainId !== scroll.id) {
      toast.error(
        <span className="flex flex-col">
          <strong>Unsupported network.</strong>{' '}
          <p>
            Please switch to the ${isDev ? 'Scroll Sepolia' : 'Scroll'} network.
          </p>
        </span>,
      );
      switchChain({ chainId: isDev ? scrollSepolia.id : scroll.id });
      return;
    }

    if (!badgeInputAddress) {
      setLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Invalid Ethereum Address:</strong>{' '}
          <p>Please provide a valid Ethereum address.</p>
        </span>,
      );
      console.log('!badgeInputAddress', !badgeInputAddress);
      return;
    }

    if (!inputBadge) {
      setLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Invalid Badge:</strong> <p>Please select a badge to give.</p>
        </span>,
      );
      console.log('!inputBadge', !inputBadge);
      return;
    }

    let encodeParam = '';
    let encodeArgs: string[] = [];
    if (inputBadge.uid === TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid) {
      encodeParam = TRUSTFUL_SCHEMAS.ATTEST_MANAGER.data;
      encodeArgs = ['Manager'];
      const isManager = await hasRole(ROLES.MANAGER, badgeInputAddress.address);
      if (isManager) {
        setLoading(false);
        toast.error(
          <span className="flex flex-col">
            <strong>Address is a Manager.</strong>{' '}
            <p>Address already have this badge.</p>
          </span>,
        );
        console.log('isManager', isManager);
        return;
      }
    } else if (inputBadge.uid === TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.uid) {
      if (inputBadge.title === 'Check-in') {
        encodeParam = TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.data;
        encodeArgs = ['Check-in'];
        const isVillager = await hasRole(
          ROLES.VILLAGER,
          badgeInputAddress.address,
        );
        if (isVillager) {
          setLoading(false);

          toast.error(
            <span className="flex flex-col">
              <strong>Address already checked-in:</strong>{' '}
              <p>Address already have this badge.</p>
            </span>,
          );
          console.log('isVillager', isVillager);
          return;
        }
      } else if (inputBadge.title === 'Check-out') {
        encodeParam = TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.data;
        encodeArgs = ['Check-out'];
        if (!isBytes32(commentBadge as `0x${string}`)) {
          setLoading(false);

          toast.error(
            <span className="flex flex-col">
              <strong>Invalid reference UID:</strong>{' '}
              <p>The format provided is not a valid bytes32.</p>
            </span>,
          );
          console.log('!isBytes32(commentBadge)');
          return;
        }
        const isVillager = await hasRole(
          ROLES.VILLAGER,
          badgeInputAddress.address,
        );
        if (!isVillager) {
          setLoading(false);

          toast.error(
            <div className="flex flex-col">
              <strong>Address already checked-out:</strong>{' '}
              <p>Address already have</p>
            </div>,
          );

          console.log('!isVillager2', !isVillager);
          return;
        }
      }
    } else if (inputBadge.uid === TRUSTFUL_SCHEMAS.ATTEST_EVENT.uid) {
      encodeParam = TRUSTFUL_SCHEMAS.ATTEST_EVENT.data;
      encodeArgs = [inputBadge.title, commentBadge ?? ''];
      console.log('badgeInputAddress', badgeInputAddress);
      const isVillager = await hasRole(
        ROLES.VILLAGER,
        badgeInputAddress.address,
      );
      console.log('isVillager', isVillager);
      if (!isVillager) {
        setLoading(false);

        toast.error(
          <span className="flex flex-col">
            <strong>Address already checked-out:</strong>{' '}
            <p>Non-Villagers cannot send/receive badges.</p>
          </span>,
        );
      }
    } else {
      setLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Invalid Badge:</strong> Unexistent or invalid badge selected.
        </span>,
      );
      return;
    }

    const data = encodeAbiParameters(
      parseAbiParameters(encodeParam),
      encodeArgs,
    );

    const attestationRequestData: AttestationRequestData = {
      recipient: badgeInputAddress.address,
      expirationTime: BigInt(0),
      revocable: inputBadge.revocable,
      refUID:
        inputBadge.title === 'Check-out'
          ? (commentBadge as `0x${string}`)
          : '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: data,
      value: BigInt(0),
    };

    const response = await submitAttest(
      address,
      inputBadge.uid,
      attestationRequestData,
    );

    if (response instanceof Error) {
      setLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected</strong> <p>{response.message}</p>
        </span>,
      );

      return;
    }

    if (response.status !== 'success') {
      setLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected</strong>{' '}
          <p>Contract execution reverted.</p>
        </span>,
      );
      return;
    }

    toast.error(
      <span>
        <strong>Badge sent</strong>{' '}
        {`https://scrollscan.com/tx/${response.transactionHash}`}
      </span>,
    );
    setAddressStep(GiveBadgeStepAddress.CONFIRMATION);
    setLoading(false);
    setText('');
    setInputAddress('');
    setBadgeInputAddress(null);

    return;
  };

  const renderStepContent = (addressStep: GiveBadgeStepAddress) => {
    switch (addressStep) {
      case GiveBadgeStepAddress.INSERT_ADDRESS:
        return (
          <>
            {villagerAttestationCount !== null ? (
              <>
                <TheHeader />
                <div
                  style={{
                    height: '1px',
                    backgroundColor: '#fff',
                    width: '100%',
                    margin: '16px 0',
                    opacity: '0.2',
                  }}
                />
                <Box
                  className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col w-full"
                  gap={8}
                >
                  <Text className="flex text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                    Let&apos;s give a badge to someone
                  </Text>
                  <Flex className="w-full flex-col">
                    <Flex className="gap-4 pb-4 justify-start items-center">
                      <UserIcon className="text-[#B1EF42]" />
                      <Input
                        className=" text-base font-normal leading-snug w-[40%] "
                        style={{ border: 'none' }}
                        placeholder="Insert address or ENS"
                        focusBorderColor={'#F5FFFF1A'}
                        value={inputAddress}
                        onChange={(e) => setInputAddress(e.target.value)}
                      />
                      <Flex className="w-8" color="#B1EF42">
                        <PasteToClipboardButton
                          onPaste={(text) => setInputAddress(text)}
                        />
                      </Flex>
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                  </Flex>
                  <Flex
                    gap={4}
                    color="white"
                    className="w-full justify-between items-center"
                  >
                    <Text className="text-slate-50 opacity-80 text-base font-normal leading-snug border-none">
                      Continue
                    </Text>
                    <button
                      className={`flex rounded-full ${iconBg} justify-center items-center w-8 h-8`}
                      onClick={() => {
                        handleInputAddressConfirm();
                        setInputBadge(undefined);
                        setCommentBadge('');
                      }}
                    >
                      <ArrowIcon
                        variant={ArrowIconVariant.RIGHT}
                        props={{ className: iconColor }}
                      />
                    </button>
                  </Flex>
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
          </>
        );
      case GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT:
        return (
          <>
            <TheHeader />
            <BadgeDetailsNavigation />
            <Box
              flex={1}
              as="main"
              className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col"
              gap={4}
            >
              <Card
                background={'#F5FFFF0D'}
                className="w-full border border-[#F5FFFF14] border-opacity-[8]"
              >
                <Flex flexDirection={'column'} className="w-full items-center">
                  <Flex className="w-full flex-row p-4 items-center" gap={4}>
                    <UserIcon className="text-white" />
                    <Flex
                      flexDirection={'column'}
                      gap={2}
                      justifyContent={'center'}
                    >
                      <Text className="text-slate-50 text-sm font-medium leading-none">
                        Issuer
                      </Text>
                      <AddressDisplay
                        userAddress={address as `0x${string}`}
                        copyToClipboard={true}
                        externalLink={true}
                      />
                    </Flex>
                  </Flex>
                  <Divider className="border-slate-50 opacity-10 w-full" />
                  <Flex className="w-full flex-row p-4" gap={4}>
                    <UserIcon className="text-white" />
                    <Flex
                      flexDirection={'column'}
                      gap={2}
                      justifyContent={'center'}
                    >
                      <Text className="text-slate-50 text-sm font-medium leading-none">
                        Receiver
                      </Text>
                      <AddressDisplay
                        userAddress={badgeInputAddress}
                        copyToClipboard={true}
                        externalLink={true}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
              {inputBadgeTitleList && inputBadgeTitleList.length > 0 && (
                <>
                  <Card
                    background={'#F5FFFF0D'}
                    className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
                  >
                    <Text className="text-slate-50 mb-2 text-sm font-medium leading-none">
                      Select a Badge
                    </Text>
                    <Select
                      placeholder="Select option"
                      className="flex text-white opacity-70 text-sm font-normal leading-tight"
                      color="white"
                      onChange={handleBadgeSelectChange}
                      style={{ color: 'white' }}
                    >
                      {inputBadgeTitleList?.map((title, index) => (
                        <option
                          key={index}
                          value={title}
                          style={{ color: 'black' }}
                        >
                          {title}
                        </option>
                      ))}
                    </Select>
                  </Card>
                </>
              )}
              {inputBadge?.allowComment && (
                <Flex className="w-full mt-2 flex-col">
                  <Flex className="gap-4 pb-4 justify-start items-center">
                    <CommentIcon />
                    <Textarea
                      className=" text-base font-normal leading-snug"
                      style={{ border: 'none' }}
                      placeholder={
                        inputBadge && inputBadge.title === 'Check-out'
                          ? `Please refer the UID of the check-in badge`
                          : `Share your experience!`
                      }
                      _placeholder={{
                        className: 'text-slate-50 opacity-30',
                      }}
                      focusBorderColor={'#F5FFFF1A'}
                      value={text}
                      onChange={handleTextareaChange}
                      rows={1}
                      minH="unset"
                      resize="none"
                    />
                  </Flex>
                  <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                </Flex>
              )}
              {badgeInputAddress &&
                inputBadge &&
                inputBadge.title === 'Check-out' && (
                  <Box>
                    <Flex className="p-4 gap-4 items-center">
                      <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                        &#x26A0;WARNING&#x26A0;
                        <br />
                        {`This action is irreversible. You are checking out in the name of ` +
                          badgeInputAddress.getEllipsedAddress() +
                          `. Make sure that this is the correct address. That you have their consent. Or that the event has ended.`}
                      </Text>
                    </Flex>
                  </Box>
                )}
            </Box>
            <Box className="px-6 py-4 sm:px-[60px] w-full">
              <Button
                className="w-full px-6 py-4 bg-[#B1EF42] text-black rounded-lg"
                style={{ backgroundColor: '#B1EF42' }}
                _hover={{ bg: '#B1EF42' }}
                _active={{ bg: '#B1EF42' }}
                isLoading={loading}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={() => {
                  setLoading(true);
                  handleAttest();
                }}
              >
                Confirm
              </Button>
            </Box>
          </>
        );
      case GiveBadgeStepAddress.CONFIRMATION:
        return (
          <>
            <TheHeader />
            <BadgeDetailsNavigation isFeedback={true} />
            <Box
              flex={1}
              as="main"
              className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col"
              gap={8}
            >
              <Flex className="flex justify-center items-center px-1 py-1.5 bg-slate-50 bg-opacity-5 rounded-[100px] w-[100px] h-[100px]">
                <HandHeartIcon className="z-10 text-[#B1EF42]" />
              </Flex>
              <Flex>
                <Text className="flex text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                  Badge has been given successfully!
                </Text>
              </Flex>
              <Flex className="flex-col">
                <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                <Flex className="py-4 gap-4 items-center">
                  <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    Receiver
                  </Text>
                  <Flex gap={2} className="w-full">
                    <AddressDisplay
                      userAddress={badgeReceiverAddress}
                      customClassName={true}
                      clipboardClassName={
                        'text-opacity-100 px-4 py-2 w-full disabled text-slate-50 opacity-100 text-sm font-normal border-none'
                      }
                    />
                  </Flex>
                </Flex>
                <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                <Flex className="py-4 gap-4 items-center">
                  <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    Badge
                  </Text>
                  <Flex gap={2} className="w-full">
                    {inputBadge && (
                      <Textarea
                        color="white"
                        className="text-opacity-100 disabled text-slate-50 opacity-100 text-sm font-normal border-none"
                        readOnly={true}
                        _readOnly={{
                          opacity: 1,
                          cursor: 'not-allowed',
                        }}
                        disabled={true}
                        value={inputBadge?.title}
                        rows={inputBadge?.title.length > 50 ? 3 : 1}
                        minH="unset"
                        resize="none"
                      ></Textarea>
                    )}
                  </Flex>
                </Flex>
                <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                {commentBadge && !isBytes32(commentBadge as `0x${string}`) && (
                  <Flex className="py-4 gap-4 items-center">
                    <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                      Comment
                    </Text>
                    <Flex gap={2} className="w-full">
                      <Textarea
                        color="white"
                        className="text-opacity-100 disabled text-slate-50 opacity-100 text-sm font-normal border-none"
                        readOnly={true}
                        _readOnly={{
                          opacity: 1,
                          cursor: 'not-allowed',
                        }}
                        disabled={true}
                        value={commentBadge}
                        rows={commentBadge.length > 50 ? 3 : 1}
                        minH="unset"
                        resize="none"
                      ></Textarea>
                    </Flex>
                  </Flex>
                )}
                {commentBadge && (
                  <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                )}
              </Flex>
            </Box>
          </>
        );
    }
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <Flex flexDirection="column" maxHeight="10vh" minHeight="10vh">
        {renderStepContent(addressStep)}
      </Flex>
    </ChakraProvider>
  );
};
