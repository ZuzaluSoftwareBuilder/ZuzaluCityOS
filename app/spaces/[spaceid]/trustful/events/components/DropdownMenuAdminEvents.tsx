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
import { useAccount } from 'wagmi';
import {
  CYPHERHOUSE_SPACEID,
  Role,
  ROLES,
  spaceIdValue,
} from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { useTrustful } from '@/context/TrustfulContext';
import toast from 'react-hot-toast';
import {
  EVENT_ACTION,
  EVENT_OPTIONS,
} from '@/app/spaces/[spaceid]/trustful/admin/components/ui-utils';
import { createEvents } from '@/app/spaces/[spaceid]/trustful/service/';

export const DropdownMenuAdminEvents = () => {
  const { address } = useAccount();
  const { userRole } = useTrustful();
  const [role, setRole] = useState<ROLES | null>(null);

  const [eventAction, setEventAction] = useState<EVENT_ACTION | null>(null);
  const [isloading, setIsLoading] = useState<boolean>(false);

  const [inputValuesTextArea, setInputValuesTextArea] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    setRole(null);
  }, [eventAction]);

  /** EVENT */
  const handleCreateEvent = async () => {
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
          <strong>Please connect first.</strong> <p>No userRole found.</p>
        </span>,
      );
      return;
    }

    const response = await createEvents({
      name: inputValuesTextArea['createEventName'],
      description: inputValuesTextArea['createEventDescription'],
      spaceId: spaceIdValue,
      zucityId: CYPHERHOUSE_SPACEID,
      user: userRole,
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
    let selectOptions = EVENT_OPTIONS;
    selectOptions.filter((option) => {
      if (event.target.value === '') {
        setEventAction(null);
      }
      if (event.target.value === option.action) {
        setEventAction(option.action);
      }
    });
  };

  const handleCreateEventValidation = async () => {
    !inputValuesTextArea['createEventDescription'] &&
      toast.error('Please enter a valid description');
    !inputValuesTextArea['createEventName'] &&
      toast.error('Please enter a valid name');
    setIsLoading(true);
    await handleCreateEvent();
  };

  const renderEventAction: Record<EVENT_ACTION, React.JSX.Element> = {
    [EVENT_ACTION.CREATE_EVENT]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Text className="text-white">Name:</Text>
            <Textarea
              className="text-white"
              color="white"
              placeholder="Name..."
              _placeholder={{
                className: 'text-white',
              }}
              focusBorderColor={'#B1EF42'}
              value={inputValuesTextArea['createEventName'] || ''}
              name="createEventName"
              onChange={handleInputValuesTextareaChange}
              rows={
                (inputValuesTextArea['createEventName'] || '').length > 50
                  ? 3
                  : 1
              }
              minH="unset"
              resize="none"
            />
            <Text className="text-white">Description:</Text>
            <Textarea
              className=" text-base font-normal leading-snug"
              color="white"
              placeholder="Description..."
              _placeholder={{
                className: 'text-white',
              }}
              focusBorderColor={'#B1EF42'}
              value={inputValuesTextArea['createEventDescription'] || ''}
              name="createEventDescription"
              onChange={handleInputValuesTextareaChange}
              rows={
                (inputValuesTextArea['createEventDescription'] || '').length >
                50
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
                {`This will create the event from the contract and the user will not be able to create another until this session be finished.`}
                <br />
                {`Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
          <Button
            className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!inputValuesTextArea['createEventDescription'] || !inputValuesTextArea['createEventName'] ? 'cursor-not-allowed opacity-10' : ''}`}
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isloading}
            isDisabled={
              !inputValuesTextArea['createEventDescription'] ||
              !inputValuesTextArea['createEventName']
            }
            spinner={<BeatLoader size={8} color="white" />}
            onClick={handleCreateEventValidation}
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
      {!userRole ? (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      ) : (
        userRole &&
        (userRole.role === Role.ROOT || userRole.role === Role.MANAGER) && (
          <>
            <Card
              background={'#F5FFFF0D'}
              className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
            >
              <Text className="text-slate-50 mb-2 text-sm font-medium leading-none">
                Select a function
              </Text>
              <Select
                placeholder="Select option"
                className="flex opacity-70 font-normal leading-tight"
                color="white"
                onChange={handleActionSelectChange}
                focusBorderColor={'#B1EF42'}
                style={{ color: 'white' }}
              >
                {EVENT_OPTIONS.map((event, index) => (
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
            {eventAction && renderEventAction[eventAction]}
          </>
        )
      )}
    </>
  );
};
