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
  Input,
} from '@chakra-ui/react';
import { BeatLoader } from 'react-spinners';
import { Address, isAddress } from 'viem';
import { scroll, scrollSepolia } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';
import {
  isDev,
  Role,
  ROLES,
  TRUSTFUL_SCHEMAS,
} from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { ID_CHECK_IN_QUERY } from '@/app/spaces/[spaceid]/trustful/constants/schemaQueries';
import {
  grantRole,
  hasRole,
  revoke,
  removeSession,
  revokeRole,
  setAttestationTitle,
  setSchema,
} from '@/app/spaces/[spaceid]/trustful/service/smart-contract';
import { EthereumAddress } from '@/app/spaces/[spaceid]/trustful/utils/types';
import { useTrustful } from '@/context/TrustfulContext';
import toast from 'react-hot-toast';
import {
  ADMIN_ACTION,
  ROLES_OPTIONS,
  ADMIN_OPTIONS,
  MANAGER_OPTIONS,
  ACTIONS_OPTIONS,
  VILLAGER_OPTIONS,
} from '@/app/spaces/[spaceid]/trustful/admin/components/ui-utils';
import { InputAddressUser } from '@/app/spaces/[spaceid]/trustful/components/';
import {
  joinSession,
  fetchEASData,
  createSession,
  deleteSession,
} from '@/app/spaces/[spaceid]/trustful/service/backend/';

export const DropdownMenuAdmin = () => {
  const { address, chainId } = useAccount();
  const { setNewTitleAdded, userRole } = useTrustful();
  const { switchChain } = useSwitchChain();
  const [role, setRole] = useState<ROLES | null>(null);
  const [inputAddress, setInputAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<EthereumAddress | null>(
    null,
  );
  const [action, setAction] = useState<number>(0);
  const [adminAction, setAdminAction] = useState<ADMIN_ACTION | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputValuesTextArea, setInputValuesTextArea] = useState<{
    [key: string]: string;
  }>({});
  const [inputValuesChange, setInputValuesChange] = useState<{
    [key: string]: string;
  }>({});

  const [attestationBadgeIsValid, setAttestationBadgeIsValid] =
    useState<boolean>(false);
  const [schemaUID, setSchemaUID] = useState<string | `0x${string}`>('');

  // Updates the validAddress when the inputAddress changes
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setValidAddress(new EthereumAddress(inputAddress));
    }
  }, [inputAddress]);

  useEffect(() => {
    setRole(null);
  }, [adminAction]);

  /**
   * Displays an error toast message if the user is connected to an unsupported network
   * and prompts them to switch to the appropriate network.
   *
   * The appropriate network is determined based on the environment:
   * - In development (`isDev` is true), the required network is Scroll Sepolia.
   * - In production (`isDev` is false), the required network is Scroll.
   *
   * If the user is not connected to the required network, an error toast message
   * is displayed and the `switchChain` function is called to prompt the user to
   * switch to the required network.
   */
  const toastSwitchRightNetwork = () => {
    if (isDev ? chainId !== scrollSepolia.id : chainId !== scroll.id) {
      toast.error(
        <span className="flex flex-col">
          <strong>Unsupported network.</strong>{' '}
          <p>
            Please check-in first. Please switch to the{' '}
            {isDev ? 'Scroll Sepolia' : 'Scroll'} network.
          </p>
        </span>,
      );
      switchChain({ chainId: isDev ? scrollSepolia.id : scroll.id });
      return;
    }
  };

  /**
   * Checks if the user already has the specified role.
   *
   * @param {Address} address - The address of the user to check.
   * @returns {Promise<void>} - A promise that resolves when the check is complete.
   *
   * This function checks if the user already has the role specified by the `role` variable.
   * If the user already has the role, it sets the loading state to false and displays an error toast message.
   *
   * The roles checked are:
   * - ROOT
   * - MANAGER
   * - VILLAGER
   */
  const checkIfUserAlreadyHasTheRole = async (
    address: Address,
    role: ROLES,
  ) => {
    const userHasRole = await hasRole(role, address as Address);
    if (userHasRole) {
      setIsLoading(false);
      toast.error('Address already has this role.');
      return true;
    }
  };

  /**Root */
  const handleGrantRole = async () => {
    if (!address || !inputAddress || !role || !validAddress) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Please connect first.</strong> <p>No address found.</p>
        </span>,
      );
      return;
    }

    const doesUserHaveTheRole = await checkIfUserAlreadyHasTheRole(
      validAddress.address as Address,
      role,
    );
    if (doesUserHaveTheRole) {
      return;
    }

    const response = await grantRole({
      from: address,
      role: role,
      account: validAddress.address as `0x${string}`,
      msgValue: BigInt(0),
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

    if (response.status !== 'success') {
      setIsLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected:</strong>{' '}
          <p>Contract execution reverted.</p>
        </span>,
      );
      return;
    }

    setIsLoading(false);

    toast.error(
      <span>
        <strong>Badge sent at tx:</strong>{' '}
        {`https://scrollscan.com//tx/${response.transactionHash}`}
      </span>,
    );
  };

  /**Root */
  const handleRevokeRole = async () => {
    if (!address || !inputAddress || !role || !validAddress) {
      setIsLoading(false);

      toast.error(
        <span className="flex flex-col">
          <strong>Please connect first.</strong> <p>No address found.</p>
        </span>,
      );

      return;
    }

    toastSwitchRightNetwork();
    const userHasRole = await hasRole(
      role,
      validAddress.address as `0x${string}`,
    );

    if (!userHasRole) {
      setIsLoading(false);
      toast.error("Address doesn't have this role.");
      return;
    }

    const response = await revokeRole({
      from: address,
      role: role,
      account: validAddress.address as `0x${string}`,
      msgValue: BigInt(0),
    });

    if (response instanceof Error) {
      setIsLoading(false);
      toast.error('Transaction Rejected');
      return;
    }

    if (response.status !== 'success') {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected.</strong>{' '}
          <p>Contract execution reverted.</p>
        </span>,
      );

      return;
    }

    setIsLoading(false);

    toast.success(
      <span className="flex flex-col">
        <strong>Role revoked succefully.</strong>
        <p>{`https://scrollscan.com//tx/${response.transactionHash}`}</p>
      </span>,
    );
  };

  /**Root */
  const handleSetSchema = async () => {
    if (!address) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Please connect first.</strong> <p>No address found.</p>
        </span>,
      );
      return;
    }

    toastSwitchRightNetwork();
    const response = await setSchema({
      from: address,
      uid: schemaUID as `0x${string}`,
      action: action,
      msgValue: BigInt(0),
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

    if (response.status !== 'success') {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected.</strong>{' '}
          <p>Contract execution reverted.</p>
        </span>,
      );

      return;
    }

    toast.error(
      <span>
        <strong>Badge sent at tx:</strong> {response.transactionHash}
      </span>,
    );
    setIsLoading(false);
  };

  /**Root */
  const handleRemoveSession = async () => {
    if (!address || !userRole) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          {' '}
          <strong>Please connect first.</strong> <p>No address found.</p>
        </span>,
      );
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
      sessionId: Number(inputValuesChange['removeSessionId']),
      userAddress: validAddress.address as Address,
    });

    setIsLoading(false);
    // toast.success(
    //   `Badge sent at tx: ${`https://scrollscan.com//tx/${response.transactionHash}`}`,
    // );
  };

  /**Manager  */
  const handleAttestationTitle = async () => {
    if (!address) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>No account connected.</strong>{' '}
          <p>Please connect your wallet.</p>
        </span>,
      );
      return;
    }

    toastSwitchRightNetwork();
    const response = await setAttestationTitle({
      from: address,
      isValid: attestationBadgeIsValid,
      title: inputValuesTextArea['attestationTitle'],
      value: BigInt(0),
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

    if (response.status !== 'success') {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected.</strong>{' '}
          <p>Contract execution reverted.</p>
        </span>,
      );
      return;
    }

    setIsLoading(false);

    toast.error(
      <span>
        <strong>Badge title added successfully.</strong>{' '}
        {`https://scrollscan.com/tx/${response.transactionHash}`}
      </span>,
    );

    setNewTitleAdded(true);
  };

  /** MANAGER */
  const handleAttestationValidBadge = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const selectedRoleValue = event.target.value;

    if (selectedRoleValue === 'Yes') {
      setAttestationBadgeIsValid(true);
    } else if (selectedRoleValue === 'No') {
      setAttestationBadgeIsValid(false);
    }
  };

  /** VILLAGER */
  const handleJoinSession = async () => {
    if (!address || !userRole) {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Please connect first.</strong> <p>No address found.</p>
        </span>,
      );
      return;
    }

    const response = await joinSession({
      role: userRole.role,
      sessionId: Number(inputValuesChange['sessionId']),
      userAddress: userRole.address,
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
          <strong>Please connect first.</strong> <p>No userRole found.</p>
        </span>,
      );
      return;
    }

    const response = await createSession({
      user: userRole,
      name: inputValuesTextArea['createSessionName'],
      eventId: Number(inputValuesChange['createSessionEventId']),
      zucityId: Number(inputValuesChange['createSessionZucityId']),
      hostAddress: validAddress?.address as Address,
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
    toast.success('Session created successfully!');
  };

  const handleRoleSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const selectedRoleValue = event.target.value;
    const rolesValues = Object.values(ROLES_OPTIONS);
    const selectedRole = rolesValues.find((role) => role === selectedRoleValue);

    if (selectedRole) {
      setRole(selectedRole);
    }
  };

  const handleRevokeManagerRole = async () => {
    toastSwitchRightNetwork();

    const queryVariables = {
      where: {
        schemaId: {
          equals: TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid,
        },
        recipient: {
          equals: inputAddress,
        },
        decodedDataJson: {
          contains: 'Manager',
        },
      },
    };

    const { response, success } = await fetchEASData(
      ID_CHECK_IN_QUERY,
      queryVariables,
    );

    if (!success || !response) {
      toast.error('Error while fetching Attestation data from Subgraphs');
      return;
    }

    if (response.data.data.attestations.length === 0) {
      toast.error("This user doesn't not have a Manager badge.");
      return;
    }

    if (response.data.data.attestations[0].revoked) {
      toast.error('This badge was already revoked.');
      return;
    }

    const txuid = response.data.data.attestations[0].id;
    const transactionResponse = await revoke(
      address as `0x${string}`,
      TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid,
      txuid as `0x${string}`,
      0n,
    );

    if (transactionResponse instanceof Error) {
      setIsLoading(false);
      toast.error(`Transaction Rejected: ${transactionResponse.message}`);
      return;
    }

    if (transactionResponse.status !== 'success') {
      setIsLoading(false);
      toast.error(
        <span className="flex flex-col">
          <strong>Transaction Rejected.</strong>{' '}
          <p>Contract execution reverted.</p>
        </span>,
      );
      return;
    }

    setIsLoading(false);

    toast.success(
      <span className="flex flex-col">
        <strong>Badge sent at tx:</strong>{' '}
        <p>{transactionResponse.transactionHash}</p>
      </span>,
    );
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

  const handleInputValuesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValuesChange((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleActionSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    role: Role,
  ) => {
    let selectOptions = MANAGER_OPTIONS; //TODO: Start always with the villager
    if (role === Role.ROOT) {
      selectOptions = ADMIN_OPTIONS;
    }
    selectOptions.filter((admin) => {
      if (event.target.value === '') {
        setAdminAction(null);
      }
      if (event.target.value === admin.action) {
        setAdminAction(admin.action);
      }
    });
  };

  /*
   * Renders the appropriate admin action component based on the provided ADMIN_ACTION.
   */
  const renderAdminAction: Record<ADMIN_ACTION, React.JSX.Element> = {
    [ADMIN_ACTION.GRANT_ROLE]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              placeholder="Select Role"
              className="flex text-black opacity-70 font-normal leading-tight"
              color="white"
              onChange={handleRoleSelectChange}
              focusBorderColor={'#B1EF42'}
            >
              {Object.entries(ROLES_OPTIONS).map(
                ([roleName, roleValue], index) => (
                  <option key={index} value={roleValue}>
                    {roleName}
                  </option>
                ),
              )}
            </Select>
          </Flex>
          <InputAddressUser
            label="Address to Grant Role"
            onInputChange={(value: string) => setInputAddress(value)}
            inputAddress={String(inputAddress)}
          />
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This is an access control function that works outside the scope of how Trustul is supposed to work and the behaviour of the dApp might not be as expected once you override.`}
                <br />
                {`Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
          <Button
            className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!isAddress(inputAddress.toString()) || !role ? 'cursor-not-allowed opacity-10' : ''}`}
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={!isAddress(inputAddress.toString()) || !role}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              !isAddress(inputAddress.toString()) ||
                (!role &&
                  toast.error(
                    'Please enter a valid address and select a role',
                  ));
              setIsLoading(true);
              handleGrantRole();
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      </Card>
    ),
    [ADMIN_ACTION.REVOKE_ROLE]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              placeholder="Select Role"
              className="flex text-white opacity-70 font-normal leading-tight"
              color="white"
              onChange={handleRoleSelectChange}
              focusBorderColor={'#B1EF42'}
            >
              {userRole && userRole.role === Role.ROOT
                ? Object.entries(ROLES_OPTIONS).map(
                  ([roleName, roleValue], index) => (
                    <option key={index} value={roleValue}>
                      {roleName}
                    </option>
                  ),
                )
                : userRole &&
                userRole.role === Role.MANAGER &&
                Object.entries(ROLES_OPTIONS)
                  .filter(
                    ([_, roleValue]) => roleValue !== ROLES_OPTIONS.ROOT,
                  )
                  .map(([roleName, roleValue], index) => (
                    <option key={index} value={roleValue}>
                      {roleName}
                    </option>
                  ))}
            </Select>
          </Flex>
          <InputAddressUser
            onInputChange={(value: string) => setInputAddress(value)}
            inputAddress={String(inputAddress)}
            label={'Address to Revoke Role'}
          />
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This is an access control function that works outside the scope of how Trustul is supposed to work and the behaviour of the dApp might not be as expected once you override.`}
                <br />
                {`Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={!isAddress(inputAddress.toString()) || !role}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setIsLoading(true);
              handleRevokeRole();
              !isAddress(inputAddress.toString()) ||
                (!role &&
                  toast.error(
                    'Please enter a valid address and select a role',
                  ));
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      </Card>
    ),
    [ADMIN_ACTION.REVOKE_MANAGER]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <InputAddressUser
            onInputChange={(value: string) => setInputAddress(value)}
            inputAddress={String(inputAddress)}
            label={'Address to Revoke'}
          />
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`This action is irreversible. You are revoking the Manager badge from the address ${inputAddress ? inputAddress : 'above'}. He will not be able to get this badge again and its status will show revoked for eternity in the EAS protocol. Are you sure you want to proceed?`}
              </Text>
            </Flex>
          </Box>
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={!isAddress(inputAddress.toString())}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setIsLoading(true);
              handleRevokeManagerRole();
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      </Card>
    ),
    [ADMIN_ACTION.SET_ATTESTATION_TITLE]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center text-black">
            <Textarea
              className="text-black text-base font-normal leading-snug"
              color="white"
              placeholder="Set the Badge Title..."
              _placeholder={{
                className: 'text-black',
              }}
              focusBorderColor={'#B1EF42'}
              value={inputValuesTextArea['attestationTitle'] || ''}
              name="attestationTitle"
              onChange={handleInputValuesTextareaChange}
              rows={
                (inputValuesTextArea['attestationTitle'] || '').length > 50
                  ? 3
                  : 1
              }
              minH="unset"
              resize="none"
            />
          </Flex>
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              className="flex opacity-70 text-white font-normal leading-tight"
              color="white"
              placeholder="Select an option"
              onChange={handleAttestationValidBadge}
              focusBorderColor={'#B1EF42'}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </Flex>
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                Badge Validity:
                <br />
                {`Yes = Can be emitted/created/attested on the contract.`}
                <br />
                {`No = Cannot be emitted/created/attested on the contract.`}
              </Text>
            </Flex>
          </Box>
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={!inputValuesTextArea['attestationTitle']}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setIsLoading(true);
              handleAttestationTitle();
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      </Card>
    ),
    [ADMIN_ACTION.SET_SCHEMA]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Textarea
              className="text-black opacity-70 text-base font-normal leading-snug"
              placeholder="Set Schema UID"
              _placeholder={{
                className: 'text-black',
              }}
              focusBorderColor={'#B1EF42'}
              value={schemaUID}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setSchemaUID(event.target.value);
              }}
              rows={schemaUID.length > 50 ? 3 : 1}
              minH="unset"
              resize="none"
            />
          </Flex>
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Select
              placeholder="Action schema"
              className="flex text-black opacity-70 text-sm font-normal leading-tight"
              color="white"
              onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                const actionSchemaValue = event.target.value;
                setAction(Number(actionSchemaValue));
              }}
              focusBorderColor={'#B1EF42'}
            >
              {Object.entries(ACTIONS_OPTIONS).map(
                ([schemaUID, actionSchemaValue], index) => (
                  <option key={index} value={actionSchemaValue}>
                    {schemaUID}
                  </option>
                ),
              )}
            </Select>
          </Flex>
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`Only use call this function if you really know what you are doing as it will affect how the Resolver Contract works with EAS and Trusful.`}
              </Text>
            </Flex>
          </Box>
          <Button
            className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={!schemaUID}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              setIsLoading(true);
              handleSetSchema();
            }}
          >
            <CheckIcon className="w-[16px] h-[16px]" />
            Confirm
          </Button>
        </Flex>
      </Card>
    ),
    [ADMIN_ACTION.REMOVE_SESSION]: (
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
            isLoading={isLoading}
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
    [ADMIN_ACTION.JOIN_SESSION]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Input
              style={{ color: 'white' }}
              name="joinSession"
              placeholder="Session id"
              onChange={handleInputValuesChange}
              value={inputValuesChange['joinSession'] || 0}
              type="number"
              min={1}
            />
          </Flex>
          {/** The villager can join the sesssion only with the sessionId */}
          {userRole && userRole.role == Role.MANAGER && Role.ROOT && (
            <InputAddressUser
              label="User Address"
              onInputChange={(value: string) => setInputAddress(value)}
              inputAddress={String(inputAddress)}
            />
          )}
          <Box>
            <Flex className="pb-4 gap-4 items-center">
              <Text className="flex min-w-[80px] text-white opacity-70 text-sm font-normal leading-tight">
                &#x26A0;WARNING&#x26A0;
                <br />
                {`Do you wanna join this user in session ${inputValuesChange['joinSession']}?`}
                <br />
              </Text>
            </Flex>
          </Box>
          <Button
            className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!isAddress(inputAddress.toString()) ? 'cursor-not-allowed opacity-10' : ''}`}
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={!isAddress(inputAddress.toString())}
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              !isAddress(inputAddress.toString()) &&
                toast.error('Please enter a valid address.');
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
    [ADMIN_ACTION.CREATE_SESSION]: (
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
                className: 'text-black',
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
            <Text className="text-white">eventId:</Text>
            <Input
              style={{ color: 'white' }}
              name="createSessionEventId"
              placeholder="Event id"
              onChange={handleInputValuesChange}
              value={inputValuesChange['createSessionEventId'] || 0}
              type="number"
              min={1}
            />
            <Text className="text-white">ZuCityId:</Text>
            <Input
              style={{ color: 'white' }}
              name="createSessionzucityId"
              placeholder="zucity Id"
              onChange={handleInputValuesChange}
              value={inputValuesChange['createSessionzucityId'] || 0}
              type="number"
              min={1}
            />
          </Flex>
          <Text className="text-white">HostAddress:</Text>
          <InputAddressUser
            label="Address to host Address"
            onInputChange={(value: string) => setInputAddress(value)}
            inputAddress={String(inputAddress)}
          />
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
            className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!isAddress(inputAddress.toString()) || !inputValuesTextArea['createSessionName'] ? 'cursor-not-allowed opacity-10' : ''}`}
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={
              !isAddress(inputAddress.toString()) ||
              !inputValuesChange['createSessionEventId']
            }
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              !isAddress(inputAddress.toString()) ||
                (!inputValuesChange['createSessionEventId'] &&
                  toast.error('Please enter a valid address'));
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
    [ADMIN_ACTION.WRAP_SESSION]: (
      <Card
        background={'#F5FFFF0D'}
        className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
      >
        <Flex className="w-full flex-col">
          <Flex className="gap-4 pb-4 justify-start items-center">
            <Input
              style={{ color: 'white' }}
              name="wrapSessionId"
              placeholder="Session id"
              onChange={handleInputValuesChange}
              value={inputValuesChange['wrapSessionId'] || 0}
              type="text"
            />
          </Flex>
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
            className={`w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg ${!isAddress(inputAddress.toString()) || !inputValuesTextArea['removeSession'] ? 'cursor-not-allowed opacity-10' : ''}`}
            _hover={{ bg: '#B1EF42' }}
            _active={{ bg: '#B1EF42' }}
            isLoading={isLoading}
            isDisabled={
              !isAddress(inputAddress.toString()) ||
              !inputValuesChange['wrapSessionId']
            }
            spinner={<BeatLoader size={8} color="white" />}
            onClick={() => {
              !isAddress(inputAddress.toString()) ||
                (!inputValuesChange['wrapSessionId'] &&
                  toast.error(
                    'Please enter a valid sessionId to wrap the session',
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
            {userRole.role === Role.ROOT ? (
              <Select
                placeholder="Select option"
                className="flex text-white opacity-70 font-normal leading-tight"
                color="white"
                onChange={(e) => handleActionSelectChange(e, Role.ROOT)}
                focusBorderColor={'#B1EF42'}
              >
                {ADMIN_OPTIONS.map((admin, index) => (
                  <option key={index} value={admin.action}>
                    {admin.action}
                  </option>
                ))}
              </Select>
            ) : userRole.role === Role.MANAGER ? (
              <Select
                placeholder="Select option"
                className="flex text-white opacity-70 font-normal leading-tight"
                color="white"
                onChange={(e) => handleActionSelectChange(e, Role.MANAGER)}
                focusBorderColor={'#B1EF42'}
              >
                {MANAGER_OPTIONS.map((admin, index) => (
                  <option key={index} value={admin.action}>
                    {admin.action}
                  </option>
                ))}
              </Select>
            ) : userRole.role === Role.VILLAGER ? (
              <Select
                placeholder="Select option"
                className="flex text-black opacity-70 font-normal leading-tight"
                color="white"
                onChange={(e) => handleActionSelectChange(e, Role.MANAGER)}
                focusBorderColor={'#B1EF42'}
              >
                {VILLAGER_OPTIONS.map((villager, index) => (
                  <option key={index} value={villager.action}>
                    {villager.action}
                  </option>
                ))}
              </Select>
            ) : (
              toast.error('No role found')
            )}
          </Card>
          {adminAction && renderAdminAction[adminAction]}
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </>
  );
};
