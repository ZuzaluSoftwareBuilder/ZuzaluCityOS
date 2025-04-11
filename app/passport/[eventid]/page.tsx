'use client';
import { ZuButton } from '@/components/core';
import {
  ArrowTopRightSquareIcon,
  LeftArrowIcon,
  QRCodeIcon,
  ScrollIcon,
  Square2StackIcon,
} from '@/components/icons';
import { SCROLL_EXPLORER } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import {
  CeramicResponseType,
  Event,
  EventEdge,
  ScrollPassTickets,
} from '@/types';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Modal,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from '../components/QRCode';

const Home = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, composeClient, ceramic } = useCeramicContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [event, setEvent] = useState<Event>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tickets, setTickets] = useState<ScrollPassTickets[]>([]);
  const [currentTicket, setCurrentTicket] = useState<ScrollPassTickets>();

  const eventId = params.eventid?.toString() ?? '';

  const getTickets = async () => {
    const GET_Profile_QUERY = `
            query MyQuery {
                viewer {
                    zucityProfile {
                    id
                    myScrollPassTickets {
                        eventId
                        checkin
                        contractAddress
                        description
                        image_url
                        name
                        price
                        status
                        tbd
                        tokenType
                        type
                    }
                    }
                }
                }
        `;
    const getProfileResponse: any =
      await composeClient.executeQuery(GET_Profile_QUERY);
    setTickets(
      getProfileResponse.data.viewer.zucityProfile.myScrollPassTickets ?? [],
    );
  };

  const getEvents = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on ZucityEvent {
                  title
                  imageUrl
                }
              }
            }
      `,
          {
            id: eventId,
          },
        )) as CeramicResponseType<EventEdge>;
      if (response.data) {
        if (response.data.node) {
          setEvent(response.data.node);
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([getEvents(), getTickets()]);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    isAuthenticated && fetchData();
  }, [ceramic?.did?.parent, isAuthenticated]);

  return (
    <Stack sx={{ [theme.breakpoints.down('sm')]: { padding: '10px' } }}>
      <Stack
        justifyContent="center"
        gap="20px"
        paddingY="30px"
        sx={{
          margin: '0 auto',
          [theme.breakpoints.down('sm')]: { width: '100%', py: 0, gap: '10px' },
        }}
        width="700px"
        color="white"
      >
        <Stack
          direction="row"
          gap="20px"
          alignItems="center"
          sx={{
            [theme.breakpoints.down('sm')]: { gap: '10px' },
          }}
        >
          {!isLoading ? (
            <>
              <ZuButton
                startIcon={<LeftArrowIcon size={5} />}
                onClick={() => router.back()}
                sx={{
                  p: '6px 10px',
                  gap: '5px',
                  borderRadius: '10px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  opacity: 0.5,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  height: '34px',
                  [theme.breakpoints.down('sm')]: {
                    gap: 0,
                    width: '40px',
                    minWidth: '40px',
                    '& .MuiButton-startIcon': {
                      margin: 0,
                    },
                  },
                }}
              >
                {!isMobile ? 'Back' : ''}
              </ZuButton>
              <Stack direction="row" spacing="10px" alignItems="center">
                <Box
                  component="img"
                  alt={event?.title}
                  src={event?.imageUrl}
                  width={30}
                  height={30}
                  borderRadius="4px"
                />
                <Typography
                  fontSize="24px"
                  fontWeight={700}
                  lineHeight={1.2}
                  color="white"
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '18px',
                    },
                  }}
                >
                  {event?.title}
                </Typography>
              </Stack>
            </>
          ) : (
            <Skeleton variant="text" sx={{ fontSize: '34px' }} width="100%" />
          )}
        </Stack>

        {tickets.length > 1 ? (
          <Stack
            spacing="20px"
            sx={{
              [theme.breakpoints.down('sm')]: {
                padding: '0 10px',
              },
            }}
          >
            <Typography color="white" variant="subtitleMB">
              Tickets:
            </Typography>
            <Stack
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                [theme.breakpoints.down('sm')]: {
                  gridTemplateColumns: 'repeat(1, 1fr)',
                },
              }}
            >
              {tickets.map((ticket, index) => (
                <Grid item xs={12} md={6} key={`Ticket-Item-${index}`}>
                  <Stack
                    padding="20px"
                    spacing="20px"
                    borderRadius="10px"
                    border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                    sx={{
                      background: 'rgba(45, 45, 45, 0.80)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Box
                      component="img"
                      width={300}
                      height={300}
                      borderRadius="10px"
                      sx={{
                        [theme.breakpoints.down('sm')]: {
                          width: '100%',
                          height: 'auto',
                        },
                      }}
                      src="/23.webp"
                      alt="23.webp"
                    />
                    <Stack spacing="14px" flex="1">
                      <Stack justifyContent="center" spacing="10px">
                        <Typography
                          fontSize="18px"
                          fontWeight={700}
                          lineHeight={1.2}
                          textAlign="center"
                        >
                          {ticket.name}
                        </Typography>
                        <Typography
                          fontSize="13px"
                          fontWeight={700}
                          lineHeight={1.2}
                          textAlign="center"
                          sx={{ opacity: 0.5 }}
                        >
                          {ticket.price} {ticket.tokenType}
                        </Typography>
                      </Stack>
                      <Stack
                        onClick={() => {
                          setCurrentTicket(ticket);
                          setIsOpen(true);
                        }}
                        sx={{
                          cursor: 'pointer',
                          background:
                            'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
                        }}
                        border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                        direction="row"
                        spacing="14px"
                        padding="10px"
                        alignItems="center"
                        borderRadius="10px"
                      >
                        <QRCodeIcon />
                        <Stack spacing="4px">
                          <Typography variant="subtitleSB" color="white">
                            Open QR Code
                          </Typography>
                          <Typography variant="caption" color="white">
                            Generate a proof of your ticket
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              ))}
            </Stack>
          </Stack>
        ) : tickets.length === 1 ? (
          <Stack spacing="20px">
            <Stack
              direction="row"
              padding="20px"
              borderRadius="10px"
              border="1px solid rgba(255, 255, 255, 0.10)"
              sx={{
                background: 'rgba(45, 45, 45, 0.80)',
                backdropFilter: 'blur(20px)',
                gap: '20px',
                [theme.breakpoints.down('sm')]: {
                  flexDirection: 'column',
                },
              }}
            >
              <Box
                component="img"
                width={300}
                height={300}
                borderRadius="10px"
                alt={tickets[0]?.image_url}
                src={tickets[0]?.image_url}
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
              <Stack spacing="14px" flex="1">
                <Stack
                  spacing="10px"
                  pb="20px"
                  borderBottom="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                >
                  <Typography
                    fontSize="25px"
                    fontWeight={700}
                    lineHeight={1.2}
                    sx={{
                      [theme.breakpoints.down('sm')]: {
                        fontSize: '20px',
                      },
                    }}
                  >
                    {tickets[0]?.name}
                  </Typography>
                  <Typography
                    fontSize="13px"
                    fontWeight={700}
                    lineHeight={1.2}
                    sx={{ opacity: 0.5 }}
                  >
                    {tickets[0]?.price} {tickets[0]?.tokenType}
                  </Typography>
                </Stack>
                <Stack
                  onClick={() => {
                    setCurrentTicket(tickets[0]);
                    setIsOpen(true);
                  }}
                  sx={{
                    background:
                      'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
                    cursor: 'pointer',
                  }}
                  border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
                  direction="row"
                  spacing="14px"
                  padding="10px"
                  alignItems="center"
                  borderRadius="10px"
                >
                  <QRCodeIcon />
                  <Stack spacing="4px">
                    <Typography
                      fontSize="18px"
                      fontWeight={700}
                      lineHeight={1.2}
                    >
                      Open QR Code
                    </Typography>
                    <Typography
                      fontSize="10px"
                      lineHeight={1.2}
                      sx={{ opacity: 0.7 }}
                    >
                      Generate a proof of your ticket
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              padding="20px"
              borderRadius="10px"
              spacing="20px"
              border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
              sx={{
                background: 'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
              }}
            >
              <Typography
                fontSize="20px"
                fontWeight={700}
                lineHeight={1.2}
                sx={{ opacity: 0.6 }}
              >
                Ticket Description
              </Typography>
              <Typography
                fontSize="16px"
                lineHeight={1.6}
                sx={{ opacity: 0.8 }}
              >
                {tickets[0]?.description}
              </Typography>
              <Divider sx={{ borderColor: '#383838' }} />
              <Stack spacing="5px">
                <Typography fontSize="14px" lineHeight={1.6}>
                  Contract/Address (?)
                </Typography>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography
                    fontSize="14px"
                    lineHeight={1.6}
                    sx={{
                      opacity: 0.8,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {tickets[0]?.contractAddress}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing="4px"
                    alignItems="center"
                    sx={{ opacity: 0.5 }}
                  >
                    <CopyToClipboard text={tickets[0]?.contractAddress}>
                      <IconButton sx={{ px: 0 }}>
                        <Square2StackIcon size={4.5} color="#fff" />
                      </IconButton>
                    </CopyToClipboard>
                    <IconButton
                      sx={{ px: 0 }}
                      onClick={() => {
                        window.open(
                          `${SCROLL_EXPLORER}/address/${tickets[0]?.contractAddress}`,
                          '_blank',
                        );
                      }}
                    >
                      <ArrowTopRightSquareIcon size={4.5} color="#fff" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing="20px">
            <Skeleton variant="rounded" width="100%" height={342} />
            <Skeleton variant="rounded" width="100%" height={214} />
          </Stack>
        )}
        <ScrollIcon />
      </Stack>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <QRCode
          eventId={eventId}
          ticketAddress={currentTicket?.contractAddress}
          onClose={() => {
            setIsOpen(false);
            setCurrentTicket(undefined);
          }}
        />
      </Modal>
    </Stack>
  );
};

export default Home;
