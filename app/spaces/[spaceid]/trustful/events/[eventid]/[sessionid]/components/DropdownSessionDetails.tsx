'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { CheckIcon } from '@chakra-ui/icons';
import {
  Card,
  Text,
  Select,
  Flex,
  Button,
  Textarea,
  Box,
} from '@chakra-ui/react';
import { BeatLoader } from 'react-spinners';
import { Address, isAddress } from 'viem';
import { useAccount } from 'wagmi';
import {
  Event,
  Role,
  ROLES,
} from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { removeSession } from '@/app/spaces/[spaceid]/trustful/service/smart-contract';
import { EthereumAddress } from '@/app/spaces/[spaceid]/trustful/utils/types';
import { useTrustful } from '@/context/TrustfulContext';
import toast from 'react-hot-toast';
import {
  SESSION_DETAILS_ACTION,
  SESSION_DETAILS_OPTIONS,
} from '@/app/spaces/[spaceid]/trustful/admin/components/ui-utils';
import { InputAddressUser } from '@/app/spaces/[spaceid]/trustful/components';
import {
  joinSession,
  deleteSession,
  getAllEventsBySpaceId,
  wrapSession,
} from '@/app/spaces/[spaceid]/trustful/service/backend/';
import { useParams } from 'next/navigation';

export const DropdownSessionDetails = () => {
  const { address } = useAccount();
  const { userRole } = useTrustful();
  const [role, setRole] = useState<ROLES | null>(null);
  const [inputAddress, setInputAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<EthereumAddress | null>(
    null,
  );
  const [sessionAction, setSessionAction] =
    useState<SESSION_DETAILS_ACTION | null>(null);
  const [isloading, setIsLoading] = useState<boolean>(false);

  const [inputValuesTextArea, setInputValuesTextArea] = useState<{
    [key: string]: string;
  }>({});
  const [inputValuesChange, setInputValuesChange] = useState<{
    [key: string]: string;
  }>({});
  const [events, setEvents] = useState<Event[] | undefined>([]);
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const sessionId = params.sessionid.toString();

  // Updates the validAddress when the inputAddress changes
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setValidAddress(new EthereumAddress(inputAddress));
    }
  }, [inputAddress]);

  useEffect(() => {
    setRole(null);
  }, [sessionAction]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const eventsData = await getAllEventsBySpaceId({
          spaceId: Number(spaceId),
          userAddress: address as Address,
        });
        setEvents(eventsData);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchAllEvents();
  }, []);

  /**Root */
  const handleRemoveSession = async () => {
    if (!address || !userRole) {
      setIsLoading(false);
      <span className="flex flex-col">
        <strong>Please connect first.</strong> <p>No address found.</p>
      </span>;
      return;
    }

    if (!validAddress) {
      setIsLoading(false);
      toast.error('Please enter a valid address.');
      return;
    }

    const responseSmartContract = await removeSession({
      from: address,
      sessionTitle: inputValuesTextArea['removeSessionTitle'],
      sessionOwner: validAddress.address as Address,
      msgValue: BigInt(0),
    });

    const responseBackend = await deleteSession({
      role: userRole.role,
      sessionId: Number(sessionId),
      userAddress: validAddress.address as Address,
    });

    setIsLoading(false);
    // toast.success(
    //   `Badge sent at tx: ${`https://scrollscan.com//tx/${response.transactionHash}`}`,
    // );
  };

  /** VILLAGER */
  const handleJoinSession = async () => {
    if (!address || !userRole) {
      setIsLoading(false);
      <span className="flex flex-col">
        <strong>Please connect first.</strong> <p>No address found.</p>
      </span>;
      return;
    }

    if (userRole.role === Role.NO_ROLE) {
      toast.error("User Address doesn't have a role");
      return;
    }

    const response = await joinSession({
      sessionId: Number(sessionId),
      userAddress: address as Address,
    });

    if (response instanceof Error) {
      setIsLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected:</strong> <p>{response.message}</p>
        </span>,
      );
      return;
    }

    setIsLoading(false);
    toast.success('Session joined successfully!');
  };

  /** VILLAGER */
  const handleWrapSession = async () => {
    if (!address || !userRole) {
      setIsLoading(false);
      <span className="flex flex-col">
        <strong>Please connect first.</strong> <p>No address found.</p>
      </span>;
      return;
    }

    const response = await wrapSession({
      role: userRole.role,
      sessionId: Number(sessionId),
      userAddress: address as Address,
    });

    if (response instanceof Error) {
      setIsLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected:</strong> <p>{response.message}</p>
        </span>,
      );
      return;
    }

    setIsLoading(false);
    toast.success('Session joined successfully!');
  };

  const handleInputValuesTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const textareaLineHeight = 22;
    const scrollHeight = event.target.scrollHeight - 16;

    const currentRows = Math.ceil(scrollHeight / textareaLineHeight);
    if (currentRows >= 2) {
      event.target.rows = currentRows;
    }

    const { name, value } = event.target;
    setInputValuesTextArea((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleActionSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    let selectOptions = SESSION_DETAILS_OPTIONS;
    selectOptions.filter((option) => {
      if (event.target.value === '') {
        setSessionAction(null);
      }
      if (event.target.value === option.action) {
        setSessionAction(option.action);
      }
    });
  };

  /*
   * Renders the appropriate admin action component based on the provided ADMIN_ACTION.
   */
  const renderSessionAction: Record<SESSION_DETAILS_ACTION, React.JSX.Element> =
    {
      [SESSION_DETAILS_ACTION.REMOVE_SESSION]: (
        <Card
          background={'#F5FFFF0D'}
          className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
        >
          <Flex className="w-full flex-col">
            <Flex className="gap-4 pb-4 justify-start items-center">
              <Textarea
                style={{ color: 'black' }}
                className="text-black text-base font-normal leading-snug"
                color="white"
                placeholder="Set the Session Title..."
                _placeholder={{
                  className: 'text-black',
                }}
                focusBorderColor={'#B1EF42'}
                value={inputValuesTextArea['removeSessionTitle'] || ''}
                name="removeSessionTitle"
                onChange={handleInputValuesTextareaChange}
                rows={
                  (inputValuesTextArea['removeSessionTitle'] || '').length > 50
                    ? 3
                    : 1
                }
                minH="unset"
                resize="none"
              />
            </Flex>
            <InputAddressUser
              label="Address to Session Owner"
              onInputChange={(value: string) => setInputAddress(value)}
              inputAddress={String(inputAddress)}
            />
            <Box>
              <Flex className="pb-4 gap-4 items-center">
                <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                  &#x26A0;WARNING&#x26A0;
                  <br />
                  {`This will remove the session from the contract and the user will not be able to access it anymore.`}
                  <br />
                  {`Are you sure you want to proceed?`}
                </Text>
              </Flex>
            </Box>
            <Button
              className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!isAddress(inputAddress.toString()) || !inputValuesTextArea['removeSession'] ? 'cursor-not-allowed opacity-10' : ''}`}
              _hover={{ bg: '#B1EF42' }}
              _active={{ bg: '#B1EF42' }}
              isLoading={isloading}
              isDisabled={
                !isAddress(inputAddress.toString()) ||
                !inputValuesTextArea['removeSessionTitle']
              }
              spinner={<BeatLoader size={8} color="white" />}
              onClick={() => {
                !isAddress(inputAddress.toString()) ||
                  (!inputValuesTextArea['removeSessionTitle'] &&
                    toast.error(
                      'Please enter a valid address and set the session title to remove',
                    ));
                setIsLoading(true);
                handleRemoveSession();
              }}
            >
              <CheckIcon className="w-[16px] h-[16px]" />
              Confirm
            </Button>
          </Flex>
        </Card>
      ),
      [SESSION_DETAILS_ACTION.JOIN_SESSION]: (
        <Card
          background={'#F5FFFF0D'}
          className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
        >
          <Flex className="w-full flex-col">
            <Box>
              <Flex className="pb-4 gap-4 items-center">
                <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                  &#x26A0;WARNING&#x26A0;
                  <br />
                  {`Do you wanna join this user in session ${sessionId}?`}
                  <br />
                </Text>
              </Flex>
            </Box>
            <Button
              className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!sessionId ? 'cursor-not-allowed opacity-10' : ''}`}
              _hover={{ bg: '#B1EF42' }}
              _active={{ bg: '#B1EF42' }}
              isLoading={isloading}
              isDisabled={!sessionId}
              spinner={<BeatLoader size={8} color="white" />}
              onClick={() => {
                setIsLoading(true);
                handleJoinSession();
              }}
            >
              <CheckIcon className="w-[16px] h-[16px]" />
              Confirm
            </Button>
          </Flex>
        </Card>
      ),
      [SESSION_DETAILS_ACTION.WRAP_SESSION]: (
        <Card
          background={'#F5FFFF0D'}
          className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
        >
          <Flex className="w-full flex-col">
            <Flex className="gap-4 pb-4 justify-start items-center"></Flex>
            <Box>
              <Flex className="pb-4 gap-4 items-center">
                <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                  &#x26A0;WARNING&#x26A0;
                  <br />
                  {`This will close the session from the contract and the user will not be able to access it anymore.`}
                  <br />
                  {`Are you sure you want to proceed?`}
                </Text>
              </Flex>
            </Box>
            <Button
              className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!sessionId ? 'cursor-not-allowed opacity-10' : ''}`}
              _hover={{ bg: '#B1EF42' }}
              _active={{ bg: '#B1EF42' }}
              isLoading={isloading}
              isDisabled={!sessionId}
              spinner={<BeatLoader size={8} color="white" />}
              onClick={() => {
                setIsLoading(true);
                handleWrapSession();
              }}
            >
              <CheckIcon className="w-[16px] h-[16px]" />
              Confirm
            </Button>
          </Flex>
        </Card>
      ),
    };

  return (
    <>
      {userRole ? (
        <>
          <Card
            background={'#F5FFFF0D'}
            className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
          >
            <Text className="text-white mb-2 font-medium leading-none">
              Select an option
            </Text>
            <Select
              placeholder="Select option"
              className="flex  opacity-70 font-normal leading-tight"
              color="white"
              onChange={handleActionSelectChange}
              focusBorderColor={'#B1EF42'}
            >
              {SESSION_DETAILS_OPTIONS.map((event, index) => (
                <option
                  key={index}
                  value={event.action}
                  style={{ color: 'black' }}
                >
                  {event.action}
                </option>
              ))}
            </Select>
          </Card>
          {sessionAction && renderSessionAction[sessionAction]}
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </>
  );
};
