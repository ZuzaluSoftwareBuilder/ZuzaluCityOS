'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Stack,
  Box,
  Typography,
  SwipeableDrawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { EventName, EventDetail, EventAbout } from 'components/event';
import EventRegister from '@/components/event/EventRegister';
import {
  Verify,
  Agree,
  Mint,
  Complete,
  Transaction,
  Tickets,
} from '@/components/event/Whitelist';
import {
  SponsorAgree,
  SponsorMint,
  SponsorTransaction,
  SponsorComplete,
} from '@/components/event/Sponsor';
import { ZuButton } from '@/components/core';
import { ArrowUpLeftIcon, XMarkIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { Anchor, Contract } from '@/types';
import { LatLngLiteral } from 'leaflet';
import getLatLngFromAddress from '@/utils/osm';
import LotteryCard from '@/components/cards/LotteryCard';
import { ApplicationForm } from '@/components/event/EventApplication/ApplicationForm';
import { useRouter } from 'next/navigation';
interface IAbout {
  eventData: Event | undefined;
  setVerify: React.Dispatch<React.SetStateAction<boolean>> | any;
  canEdit: boolean;
}

const About: React.FC<IAbout> = ({ eventData, setVerify, canEdit }) => {
  const [location, setLocation] = useState<string>('');

  const [whitelist, setWhitelist] = useState<boolean>(false);
  const [sponsor, setSponsor] = useState<boolean>(false);

  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);
  const [application, setApplication] = useState<boolean>(false);
  const [isApplicationStep, setIsApplicationStep] = useState<boolean>(false);
  const [isApplicationSubmitStep, setIsApplicationSubmitStep] =
    useState<boolean>(false);
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [isMint, setIsMint] = useState<boolean>(false);
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>('');
  const [isSponsorAgree, setIsSponsorAgree] = useState<boolean>(false);
  const [isSponsorMint, setIsSponsorMint] = useState<boolean>(false);
  const [isSponsorTransaction, setIsSponsorTransaction] =
    useState<boolean>(false);
  const [isSponsorComplete, setIsSponsorComplete] = useState<boolean>(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [ticketMinted, setTicketMinted] = useState<any[]>([]);
  const [mintedContract, setMintedContract] = useState<Contract>();
  const [transactionLog, setTransactionLog] = useState<any>();
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [mintTicket, setMintTicket] = useState<any[]>([]);
  const [isTicket, setIsTicket] = useState<boolean>(false);
  const params = useParams();
  const eventId = params.eventid?.toString() ?? '';
  const router = useRouter();
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const { composeClient, profile } = useCeramicContext();
  const profileId = profile?.id || '';

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [osm, setOsm] = useState<LatLngLiteral | undefined>({
    lat: 0,
    lng: 0,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('eventId', eventId);
      if (data !== null) {
        setLocation(data[0].name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLocation();
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLatLngFromAddress(location);
      setOsm(res);
    };
    fetchData();
  }, [location]);

  const handleClose = () => {
    toggleDrawer('right', false);
    setIsVerify(false);
    setIsAgree(false);
    setIsMint(false);
    setIsTransaction(false);
    setIsComplete(false);
    const root = ref.current?.getElementsByClassName('MuiPaper-root');
    if (root) root?.[0].scrollTo(0, 0);
    // setIsEmail(false);
  };

  const List = (anchor: Anchor) => {
    return (
      <Box
        sx={{
          width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="10001"
        borderLeft="1px solid #383838"
      >
        <Stack
          direction="row"
          spacing="14px"
          alignItems="center"
          height="50px"
          borderBottom="1px solid #383838"
          paddingX={3}
        >
          <ZuButton startIcon={<XMarkIcon />} onClick={() => handleClose()}>
            Close
          </ZuButton>
          <Typography variant="subtitleSB">
            {whitelist ? 'Register for Event' : 'Apply to Event'}
          </Typography>
        </Stack>
        {/* {!isInitial && !isDisclaimer && !isEmail && !isPayment && <Initial setIsInitial={setIsInitial} />}
        {isInitial && !isDisclaimer && !isEmail && !isPayment && <Disclaimer setIsInitial={setIsInitial} setIsDisclaimer={setIsDisclaimer} />}
        {!isInitial && isDisclaimer && !isEmail && !isPayment && <Email setIsDisclaimer={setIsDisclaimer} setIsEmail={setIsEmail} />}
        {!isInitial && !isDisclaimer && isEmail && !isPayment && <Payment setIsEmail={setIsEmail} setIsPayment={setIsPayment} handleClose={handleClose} />} */}
        {whitelist && renderWhitelistSteps()}
        {sponsor && renderSponsorSteps()}
        {application && renderApplicationSteps()}
      </Box>
    );
  };
  const renderApplicationSteps = () => {
    const steps = [
      {
        condition: !isApplicationStep && !isApplicationSubmitStep,
        Component: ApplicationForm,
        props: {
          event: eventData as Event,
          setIsApplicationStep,
          handleClose,
          setIsApplicationSubmitStep,
          profileId,
        },
      },
      /*{
        condition: isApplicationStep && !isApplicationSubmitStep,
        Component: ApplicationSubmit,
        props: {
          setIsApplicationSubmitStep,
          setIsApplicationStep,
          event: eventData as Event,
          handleClose,
        },
      },*/
    ] as const;

    return (
      <>
        {steps.map(
          ({ condition, Component, props }, index) =>
            condition && <Component key={index} {...props} />,
        )}
      </>
    );
  };
  const renderWhitelistSteps = () => {
    const steps = [
      {
        condition:
          !isVerify &&
          !isAgree &&
          !isMint &&
          !isTransaction &&
          !isComplete &&
          !isTicket,
        Component: Verify,
        props: {
          setIsVerify,
          setFilteredResults,
          event: eventData,
          setIsTicket,
        },
      },
      {
        condition:
          isVerify &&
          !isAgree &&
          !isMint &&
          !isTransaction &&
          !isComplete &&
          !isTicket,
        Component: Tickets,
        props: {
          setIsTicket,
          setIsAgree,
          setIsVerify,
          filteredResults: filteredResults,
          event: eventData,
          setMintTicket,
          mintTicket,
          setDisclaimer,
        },
      },
      {
        condition:
          !isVerify &&
          !isAgree &&
          !isMint &&
          !isTransaction &&
          !isComplete &&
          isTicket,
        Component: Agree,
        props: {
          setIsVerify,
          setIsAgree,
          event: eventData,
          disclaimer: disclaimer,
          setIsTicket,
        },
      },
      {
        condition:
          !isVerify &&
          isAgree &&
          !isMint &&
          !isTransaction &&
          !isComplete &&
          !isTicket,
        Component: Mint,
        props: {
          setIsAgree,
          setIsMint,
          filteredResults,
          event: eventData,
          setTokenId,
          setTicketMinted,
          setIsTransaction,
          setMintedContract,
          setTransactionLog,
          setDisclaimer,
          mintTicket,
        },
      },
      {
        condition:
          !isVerify &&
          !isAgree &&
          isMint &&
          !isTransaction &&
          !isComplete &&
          !isTicket,
        Component: Transaction,
        props: { setIsMint, setIsTransaction, handleClose, event: eventData },
      },
      {
        condition:
          !isVerify &&
          !isAgree &&
          !isMint &&
          isTransaction &&
          !isComplete &&
          !isTicket,
        Component: Complete,
        props: {
          setIsTransaction,
          setIsComplete,
          handleClose,
          tokenId,
          ticketMinted,
          mintedContract,
          transactionLog,
          event: eventData,
        },
      },
    ];

    return (
      <>
        {steps.map(
          ({ condition, Component, props }, index) =>
            condition && <Component key={index} {...props} />,
        )}
      </>
    );
  };

  const renderSponsorSteps = () => {
    const steps = [
      {
        condition:
          !isSponsorAgree &&
          !isSponsorMint &&
          !isSponsorTransaction &&
          !isSponsorComplete,
        Component: SponsorAgree,
        props: {
          setIsAgree: setIsSponsorAgree,
          setFilteredResults,
          event: eventData,
        },
      },
      {
        condition:
          isSponsorAgree &&
          !isSponsorMint &&
          !isSponsorTransaction &&
          !isSponsorComplete,
        Component: SponsorMint,
        props: {
          setIsAgree: setIsSponsorAgree,
          setIsMint: setIsSponsorMint,
          filteredResults,
          event: eventData,
          setTokenId,
          setTicketMinted,
        },
      },
      {
        condition:
          !isSponsorAgree &&
          isSponsorMint &&
          !isSponsorTransaction &&
          !isSponsorComplete,
        Component: SponsorTransaction,
        props: {
          setIsMint: setIsSponsorMint,
          setIsTransaction: setIsSponsorTransaction,
          handleClose,
        },
      },
      {
        condition:
          !isSponsorAgree &&
          !isSponsorMint &&
          isSponsorTransaction &&
          !isSponsorComplete,
        Component: SponsorComplete,
        props: {
          setIsTransaction: setIsSponsorTransaction,
          setIsComplete: setIsSponsorComplete,
          handleClose,
          tokenId,
          ticketMinted,
        },
      },
    ];

    return steps.map(
      ({ condition, Component, props }, index) =>
        condition && <Component key={index} {...props} />,
    );
  };

  return (
    <Stack
      padding="40px"
      justifyContent="center"
      alignItems="center"
      bgcolor="#222222"
      sx={{
        [breakpoints.down('sm')]: {
          padding: '20px 10px',
        },
      }}
    >
      {eventData && (
        <Stack
          direction="row"
          justifyContent={'center'}
          gap={'10px'}
          sx={{
            [breakpoints.down('md')]: {
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            },
          }}
        >
          <Stack
            spacing="20px"
            boxSizing={'border-box'}
            sx={{
              width: '600px',
              px: '20px',
              [breakpoints.down('lg')]: {
                width: '540px',
              },
              [breakpoints.down('md')]: {
                width: '100%',
              },
              [breakpoints.down('sm')]: {
                px: '10px',
              },
            }}
          >
            {/* <Stack spacing="4px">
                      <Box component="img" src="/sponsor_banner.png" height="100px" borderRadius="10px" />
                      <Typography variant="caption" textAlign="right">
                        Sponsored Banner
                      </Typography>
                    </Stack> */}
            {canEdit ? (
              <Stack
                padding="10px"
                bgcolor="#ffc77d1a"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                border="1px solid rgba(255, 199, 125, .1)"
                borderRadius={'8px'}
              >
                <Typography
                  fontSize={'14px'}
                  lineHeight={'160%'}
                  color={'rgba(255, 199, 125, 1)'}
                  fontWeight={600}
                >
                  You are organizing this event
                </Typography>
                <ZuButton
                  startIcon={<ArrowUpLeftIcon size={5} />}
                  sx={{
                    padding: '6px 10px',
                    backgroundColor: 'rgba(255, 199, 125, 0.05)',
                    gap: '10px',
                    '& > span': {
                      margin: '0px',
                    },
                    color: 'rgba(255, 199, 125, 1)',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                  onClick={() =>
                    router.push(
                      `/spaces/${eventData?.space?.id}/adminevents/${eventId}`,
                    )
                  }
                >
                  Manage
                </ZuButton>
              </Stack>
            ) : null}

            <EventName
              eventId={eventId}
              avatar={eventData.space?.avatar}
              tagline={eventData.tagline}
              endTime={eventData.endTime}
              startTime={eventData.startTime}
              eventDescription={eventData.description}
              spaceName={eventData.space?.name}
              eventName={eventData.title}
              location={location}
              organizer={eventData.profile?.username as string}
              imageUrl={eventData.imageUrl}
              status={eventData.status}
            />
            {isMobile && eventData.regAndAccess?.edges[0] ? (
              <EventRegister
                onToggle={toggleDrawer}
                setWhitelist={setWhitelist}
                setSponsor={setSponsor}
                externalUrl={eventData.externalUrl}
                eventId={eventData.id}
                setVerify={setVerify}
                eventRegistration={eventData.regAndAccess.edges[0].node}
                setApplication={setApplication}
                event={eventData}
              />
            ) : null}
            <EventAbout description={eventData.description} />
            {/* <Stack
              bgcolor="#292929"
              padding="20px"
              spacing="20px"
              borderRadius="10px"
            >
              <Typography
                variant="subtitleSB"
                sx={{
                  opacity: '0.6',
                  textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                }}
                fontSize={'18px'}
                fontWeight={700}
              >
                EVENT SPONSORS
              </Typography>
              <Box display="flex" gap="20px" flexWrap="wrap">
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
              </Box>
            </Stack> */}
            {/*<Stack
              bgcolor="#292929"
              padding="20px"
              spacing="20px"
              borderRadius="10px"
              height="300px"
            >
              <Typography variant="subtitleSB" sx={{opacity: '0.6', textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)'}} fontSize={'18px'} fontWeight={700}>ORGANIZER UPDATES</Typography>
              <Stack spacing="10px">
                <Stack direction="row" alignItems="center" spacing="10px">
                  <Box
                    component="img"
                    src="/5.webp"
                    width="30px"
                    height="30px"
                    borderRadius="20px"
                  />
                  <Typography variant="bodyMB">drivenfast</Typography>
                  <Typography variant="caption">3 DAYS AGO</Typography>
                </Stack>
                <Typography variant="bodyM">
                  ZuConnect is an experience crafted with love by Zuzalu, whose
                  mission is to foster a global network of communities to
                  advance humanity by creating playgrounds at the intersection
                  of free and open technology, science, health, and social
                  innovation.
                </Typography>
              </Stack>
            </Stack>*/}
          </Stack>
          <Stack
            spacing="20px"
            sx={{
              width: '350px',
              px: '20px',
              [breakpoints.down('md')]: {
                width: '100%',
                px: '20px',
              },
              [breakpoints.down('sm')]: {
                px: '10px',
              },
            }}
          >
            {!isMobile && eventData.regAndAccess?.edges[0] ? (
              <EventRegister
                onToggle={toggleDrawer}
                setWhitelist={setWhitelist}
                setSponsor={setSponsor}
                externalUrl={eventData.externalUrl}
                eventId={eventData.id}
                setVerify={setVerify}
                eventRegistration={eventData.regAndAccess?.edges[0]?.node}
                setApplication={setApplication}
                event={eventData}
              />
            ) : null}
            {/* <Stack spacing="4px">
                      <Box component="img" src="/sponsor_banner.png" height="200px" borderRadius="10px" width="100%" />
                      <Typography variant="caption" textAlign="right">
                        Sponsored Banner
                      </Typography>
                    </Stack> */}
            {eventId ===
            'kjzl6kcym7w8yaej4q6v4xtx6v3tnmg4iw9ocaz4zbw5fw5fz8lwn1k9l7f4flf' ? (
              <LotteryCard inEvent />
            ) : null}
            <EventDetail
              status={eventData.status}
              links={eventData.customLinks}
              address={location}
              location={osm}
            />
            {/* <Stack>
                      <SpaceCard id={params.spaceid.toString()} title={eventData?.space?.name} logoImage={eventData?.space?.avatar} bgImage={eventData?.space?.banner} description={eventData?.space?.description} />
                    </Stack> */}
          </Stack>
          <SwipeableDrawer
            hideBackdrop={true}
            sx={{
              '& .MuiDrawer-paper': {
                boxShadow: 'none',
              },
            }}
            anchor="right"
            open={state['right']}
            onClose={() => toggleDrawer('right', false)}
            onOpen={() => toggleDrawer('right', true)}
            ref={ref}
          >
            {List('right')}
          </SwipeableDrawer>
        </Stack>
      )}
    </Stack>
  );
};

export default About;
