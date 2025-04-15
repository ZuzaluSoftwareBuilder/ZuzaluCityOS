import Dialog from '@/app/spaces/components/Modal/Dialog';
import { StorageKey_Username } from '@/constant/StorageKey';
import { useCeramicContext } from '@/context/CeramicContext';
import { useLitContext } from '@/context/LitContext';
import { useZupassContext } from '@/context/ZupassContext';
import { Anchor, Event, RegistrationAndAccess } from '@/types';
import { checkNFTOwnership } from '@/utils/checkNFTOwnership';
import { Box, Stack, Typography } from '@mui/material';
import { ScrollPassIcon } from 'components/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { WalletIcon, ZuPassIcon } from '../../icons';
import NewUserPromptModal from '../../modals/newUserPrompt';
import LinkAddress from './linkAddress';
import ExternalTicketingDefault from './modes/ExternalTicketing';
import ScrollPassDefault from './modes/ScrollPass';
import ZuPassDefault from './modes/Zupass';
import SuccessVerify from './successVerify';
import ValidateCredential from './validateCredential';
interface EventRegisterProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
  setWhitelist?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setSponsor?: React.Dispatch<React.SetStateAction<boolean>> | any;
  externalUrl?: string;
  eventId: string;
  setVerify: React.Dispatch<React.SetStateAction<boolean>> | any;
  eventRegistration: RegistrationAndAccess;
  setApplication: React.Dispatch<React.SetStateAction<boolean>>;
  event: Event;
}

const EventRegister: React.FC<EventRegisterProps> = ({
  onToggle,
  setWhitelist,
  setSponsor,
  externalUrl,
  eventId,
  setVerify,
  eventRegistration,
  setApplication,
  event,
}) => {
  const [isOne, setIsOne] = useState<boolean>(false);
  const [isTwo, setIsTwo] = useState<boolean>(false);
  const [stage, setStage] = useState<string>('Initial');
  const [showModal, setShowModal] = useState(false);
  const [showZupassModal, setShowZupassModal] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const { connect, connectors, error } = useConnect();
  const { address, isConnected } = useAccount();
  const [modalText, setModalText] = useState<string>('');
  const authenticateCalled = useRef(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [selectedOption, setSelectedOption] = useState<string>('same');
  const {
    pcdStr,
    authState,
    log,
    user,
    auth,
    logout,
    nullifierHash,
    setNullifierHash,
  } = useZupassContext();
  const hasProcessedNullifier = useRef(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const { disconnect } = useDisconnect();
  const {
    ceramic,
    isAuthenticated,
    showAuthPrompt,
    profile,
    authenticate,
    logout: CeramicLogout,
  } = useCeramicContext();
  const { litDisconnect } = useLitContext();
  const handleZupass = () => {
    /*if (!ceramic?.did?.parent) {
      setModalTitle('Please login');
      setModalText('Please login to perform this action');
      setShowZupassModal(true);
    } else {
      auth();
    }*/
    if (!nullifierHash) {
      const zuPassInfo = event?.regAndAccess?.edges?.[0]?.node.zuPassInfo;
      const zuPassConfig =
        zuPassInfo && zuPassInfo.length > 0
          ? {
              pcdType: 'eddsa-ticket-pcd' as const,
              publicKey: zuPassInfo?.[0]?.access?.split(',') as [
                string,
                string,
              ],
              eventId: zuPassInfo?.[0]?.eventId,
              eventName: zuPassInfo?.[0]?.eventName,
            }
          : null;
      if (zuPassConfig) {
        auth([zuPassConfig]);
      } else {
        console.error('error');
      }
    } else {
      setStage('Wallet Link');
    }
  };
  /*useEffect(() => {
    if (
      nullifierHash &&
      ceramic?.did?.parent &&
      !hasProcessedNullifier.current
    ) {
      const addZupassMemberInput = {
        eventId: eventId,
        memberDID: ceramic?.did?.parent,
        memberZupass: nullifierHash,
      };
      updateZupassMember(addZupassMemberInput)
        .then((result) => {
          hasProcessedNullifier.current = true;
          setNullifierHash('');
          if (result.status === 200) {
            setModalTitle('Successfully updated!');
            setModalText(
              'You are now a member of this event! Please check out the sessions',
            );
            setShowModal(true);
            setVerify(true);
            setStage('Wallet Link');
          }
        })
        .catch((error) => {
          const errorMessage =
            typeof error === 'string'
              ? error
              : error instanceof Error
                ? error.message
                : 'An unknown error occurred';
          setModalTitle('Error updating member:');
          setModalText(errorMessage);
          setShowModal(true);
        });
    }
  }, [nullifierHash]);*/
  useEffect(() => {
    if (nullifierHash) {
      setIsValidating(false);
      setIsValid(true);
    }
  }, [nullifierHash]);
  useEffect(() => {
    const authenticateUser = async (needSetState = true) => {
      try {
        authenticateCalled.current = true;
        await authenticate();
        const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
        const { admins = [], superAdmin = [], members = [] } = event || {};
        const lowerCaseIds = (arr: any[]) =>
          (arr || []).map((item) => item.id.toLowerCase());
        const adminIds = lowerCaseIds(admins);
        const superAdminIds = lowerCaseIds(superAdmin);
        const memberIds = lowerCaseIds(members);
        if (
          superAdminIds.includes(userDID) ||
          adminIds.includes(userDID) ||
          memberIds.includes(userDID)
        ) {
          setCurrentStep(3);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };
    if (
      localStorage.getItem(StorageKey_Username) &&
      !authenticateCalled.current
    ) {
      if (stage === 'Wallet Link') {
        setCurrentStep(3);
      } else {
        authenticateUser(false);
      }
    }
  }, [localStorage.getItem(StorageKey_Username)]);

  useEffect(() => {
    if (isAuthenticated) {
      if (stage !== 'Wallet Link') {
        setVerify(true);
      }
    }
  }, [isAuthenticated]);

  const handleRegisterAsSponsor = () => {
    setSponsor(true);
    setWhitelist(false);
    onToggle('right', true);
  };
  const handleClick = () => {
    window.open(externalUrl, '_blank');
  };
  const handleStep = (val: number) => {
    setCurrentStep(val);
  };
  const handleLogout = () => {
    disconnect();
    CeramicLogout();
    litDisconnect();
    window.location.reload();
  };
  const ticketType =
    eventRegistration?.ticketType as keyof typeof componentsMap;

  const componentsMap = {
    Scrollpass: {
      component: ScrollPassDefault,
      icon: ScrollPassIcon,
      verifyButtonText: address
        ? 'Verify with ' + address.slice(0, 10) + '...'
        : 'Verify on Wallet',
      verifyButtonIcon: <WalletIcon />,
    },
    Zupass: {
      component: ZuPassDefault,
      icon: ZuPassIcon,
      verifyButtonText: 'Validate Zupass',
      verifyButtonIcon: <ZuPassIcon />,
    },
    ExternalTicketing: {
      component: ExternalTicketingDefault,
      icon: null,
      verifyButtonText: undefined,
      verifyButtonIcon: undefined,
    },
    'No Ticketing Required': {
      component: null,
      icon: null,
      verifyButtonText: undefined,
      verifyButtonIcon: undefined,
    },
  };
  const { verifyButtonText, verifyButtonIcon } =
    componentsMap[ticketType] || componentsMap.Scrollpass;

  type TicketType = keyof typeof componentsMap;

  const TicketIcon = () => {
    if (!ticketType) return null;
    const { icon: TicketIcon } = componentsMap[ticketType as TicketType];
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '10px',
          width: '10px',
          verticalAlign: 'middle',
        }}
      >
        {TicketIcon && <TicketIcon />}
      </Box>
    );
  };

  const TicketDefault = () => {
    if (!ticketType) return null;
    const { component: TicketComponent } =
      componentsMap[ticketType as TicketType];

    const commonProps = {
      applyRule: eventRegistration.applyRule,
      onToggle,
      setSponsor,
      setWhitelist,
      handleStep,
      setApplication,
      checkinOpen: eventRegistration.checkinOpen,
      registrationOpen: eventRegistration.registrationOpen,
      tickets: eventRegistration.scrollPassTickets ?? [],
    };

    if (ticketType === 'Scrollpass' && TicketComponent) {
      return <TicketComponent {...commonProps} />;
    } else if (ticketType === 'Zupass' && TicketComponent) {
      return <TicketComponent {...commonProps} />;
    } else if (ticketType === 'ExternalTicketing') {
      return <ExternalTicketingDefault />;
    }
  };

  const handleVerify = async () => {
    try {
      if (ticketType === 'Scrollpass') {
        if (!isConnected) {
          await connect({ connector: injected() });
        }
        if (address) {
          setIsValidating(true);
          const contractAddresses =
            eventRegistration.scrollPassTickets
              ?.filter(
                (ticket) =>
                  ticket.type === 'Attendee' && ticket.checkin === '1',
              )
              .map((ticket) => ticket.contractAddress) || [];

          const ownershipChecks = contractAddresses.map((contractAddress) =>
            checkNFTOwnership(address, contractAddress),
          );

          const results = await Promise.all(ownershipChecks);
          const hasNFT = results.some((result) => result);
          setIsValidating(false);
          if (hasNFT) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        }
      } else if (ticketType === 'Zupass') {
        const zuPassInfo = event?.regAndAccess?.edges?.[0]?.node.zuPassInfo;
        const zuPassConfig =
          zuPassInfo && zuPassInfo.length > 0
            ? {
                pcdType: 'eddsa-ticket-pcd' as const,
                publicKey: zuPassInfo?.[0]?.access?.split(',') as [
                  string,
                  string,
                ],
                eventId: zuPassInfo?.[0]?.eventId,
                eventName: zuPassInfo?.[0]?.eventName,
              }
            : null;
        if (zuPassConfig) {
          await auth([zuPassConfig]);
        }
      } else if (ticketType === 'ExternalTicketing') {
        handleClick();
      }
      setVerify(true);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <Stack
      borderRadius="10px"
      spacing={1}
      border="1px solid #383838"
      bgcolor="#262626"
    >
      <Dialog
        title={modalTitle}
        message={modalText}
        showModal={showZupassModal}
        onClose={() => setShowZupassModal(false)}
        onConfirm={() => setShowZupassModal(false)}
      />
      {showModal ? (
        <NewUserPromptModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          setVerify={setVerify}
          eventId={eventId}
          ticketType={ticketType}
          setStep={setCurrentStep}
        />
      ) : null}
      <Stack
        padding="10px 14px"
        borderBottom="1px solid #383838"
        bgcolor="#2d2d2d"
        borderRadius="10px 10px 0 0"
        gap={'10px'}
      >
        <Typography color="white" variant="subtitleS">
          Event Registration
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            color="white"
            variant="subtitleS"
            sx={{ fontSize: '10px' }}
            textTransform={'uppercase'}
          >
            Ticketing PROTOCOL:
          </Typography>
          {TicketIcon()}
          <Typography
            color="white"
            variant="subtitleS"
            sx={{ fontSize: '10px' }}
            textTransform={'uppercase'}
          >
            {ticketType}
          </Typography>
        </Stack>
      </Stack>
      {currentStep === 0 && <TicketDefault />}
      {currentStep === 1 && (
        <ValidateCredential
          handleStep={handleStep}
          onVerify={handleVerify}
          verifyButtonText={verifyButtonText}
          verifyButtonIcon={verifyButtonIcon}
          isValidating={isValidating}
          isValid={isValid}
          setIsValid={setIsValid}
          setIsValidating={setIsValidating}
        />
      )}
      {currentStep === 2 && (
        <LinkAddress
          handleStep={handleStep}
          address={address?.slice(0, 10) + '...'}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          handleConfirm={() => {
            setShowModal(true);
          }}
        />
      )}
      {currentStep === 3 && (
        <SuccessVerify handleStep={handleStep} handleLogout={handleLogout} />
      )}
    </Stack>
  );
};

export default EventRegister;
