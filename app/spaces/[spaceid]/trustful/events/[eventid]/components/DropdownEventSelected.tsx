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
  CYPHERHOUSE_SPACEID,
  Role,
  ROLES,
} from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { EthereumAddress } from '@/app/spaces/[spaceid]/trustful/utils/types';
import { useTrustful } from '@/context/TrustfulContext';
import toast from 'react-hot-toast';
import {
  SESSION_ACTION,
  SESSION_OPTIONS,
} from '@/app/spaces/[spaceid]/trustful/admin/components/ui-utils';
import { createSessionSC } from '@/app/spaces/[spaceid]/trustful/service/smart-contract';
import {
  createSession,
  getAllEventsBySpaceId,
} from '@/app/spaces/[spaceid]/trustful/service';
import { Event } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { useParams } from 'next/navigation';

export const DropdownEventSelected = () => {
  const { address, chainId } = useAccount();
  const { userRole } = useTrustful();
  const [role, setRole] = useState<ROLES | null>(null);
  const [inputAddress, setInputAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<EthereumAddress | null>(
    null,
  );
  const [sessionAction, setSessionAction] =
    useState<SESSION_ACTION.CREATE_SESSION | null>(null);
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
  const eventId = params.eventid.toString();

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

  /** VILLAGER - Create Session */
  const handleCreateSession = async () => {
    if (!address) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Please connect first.</strong> <p>No address found.</p>
        </span>,
      );
      return;
    }
    if (!userRole || userRole.role == Role.NO_ROLE) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Please connect first.</strong> <p>No role found.</p>
        </span>,
      );
      return;
    }

    const timeNow = Date.now();
    const sessionTitle =
      inputValuesTextArea['createSessionName'] + '_' + timeNow;

    const oneDayInSeconds = BigInt(86400);

    /*Create Session in Smart Contract */
    const smartContractCreateSession = await createSessionSC({
      from: address as Address,
      sessionTitle: sessionTitle,
      duration: oneDayInSeconds,
      msgValue: BigInt(0),
    });

    /*Create Session in Backend */
    const response = await createSession({
      name: inputValuesTextArea['createSessionName'],
      eventId: Number(eventId),
      zucityId: CYPHERHOUSE_SPACEID,
      hostAddress: address as Address,
    });

    if (response instanceof Error) {
      setIsLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected</strong> <p>{response.message}</p>
        </span>,
      );
      return;
    }

    setIsLoading(false);
    toast.success('Session created successfully!');
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
    let selectOptions = SESSION_OPTIONS.filter((option) => {
      return option.action === SESSION_ACTION.CREATE_SESSION;
    });
    selectOptions.forEach((option) => {
      if (event.target.value === '') {
        setSessionAction(null);
      } else if (event.target.value === option.action) {
        setSessionAction(option.action as SESSION_ACTION.CREATE_SESSION);
      }
    });
  };

  /*
   * Renders the appropriate admin action component based on the provided ADMIN_ACTION.
   */
  const renderSessionAction: Record<
    SESSION_ACTION.CREATE_SESSION,
    React.JSX.Element
  > = {
    [SESSION_ACTION.CREATE_SESSION]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Textarea
              style={{ color: 'white' }}
              className="text-white text-base font-normal leading-snug"
              color="white"
              placeholder="Set the Session Name..."
              _placeholder={{
                className: 'text-white',
              }}
              focusBorderColor={'#B1EF42'}
              value={inputValuesTextArea['createSessionName'] || ''}
              name="createSessionName"
              onChange={handleInputValuesTextareaChange}
              rows={
                (inputValuesTextArea['createSessionName'] || '').length > 50
                  ? 3
                  : 1
              }
              minH="unset"
              resize="none"
            />
          </Flex>
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This will create the session from the contract and the user will not be able to create another until this session be finished.`}
                <br />
                {`Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
          <Button
            className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!inputValuesTextArea['createSessionName'] ? 'cursor-not-allowed opacity-10' : ''}`}
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isloading}
            isDisabled={!inputValuesTextArea['createSessionName']}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              !inputValuesTextArea['createSessionName'] &&
                toast.error('Please enter a valid Session Name');
              setIsLoading(true);
              handleCreateSession();
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
              Select a function
            </Text>
            {userRole.role === Role.ROOT || userRole.role === Role.MANAGER ? (
              <Select
                placeholder="Select option"
                className="flex opacity-70 font-normal leading-tight"
                color="white"
                onChange={handleActionSelectChange}
                focusBorderColor={'#B1EF42'}
              >
                {SESSION_OPTIONS.filter(
                  (option) => option.action == SESSION_ACTION.CREATE_SESSION,
                ).map((event, index) => (
                  <option
                    key={index}
                    value={event.action}
                    style={{ color: 'black' }}
                  >
                    {event.action}
                  </option>
                ))}
              </Select>
            ) : (
              toast.error('No role found')
            )}
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
