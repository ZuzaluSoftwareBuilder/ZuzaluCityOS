'use client';
import {
  ArrowForwardIcon,
  CalendarIcon,
  LottoPGFIcon,
  QRCodeIcon,
  ScrollPassIcon,
  ZuPassIcon,
} from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event, EventData, ScrollPassTickets } from '@/types';
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, composeClient, ceramic, profile } =
    useCeramicContext();

  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<ScrollPassTickets[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    if (getProfileResponse.data) {
      const { myScrollPassTickets } =
        getProfileResponse.data.viewer.zucityProfile;
      setTickets(myScrollPassTickets ?? []);
      return myScrollPassTickets ?? [];
    }
  };

  const getEvents = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
      query {
        zucityEventIndex(first: 100) {
          edges {
            node {
              id
              imageUrl
              title
            }
          }
        }
      }
    `);

      if (response && response.data && 'zucityEventIndex' in response.data) {
        const eventData: EventData = response.data as EventData;
        return eventData.zucityEventIndex.edges.map((edge) => edge.node);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const tabs = useMemo(() => {
    return [
      {
        label: 'Scrollpass',
        icon: <ScrollPassIcon size={5} />,
        content: tickets.length,
        disabled: false,
      },
      {
        label: 'ZuLotto',
        icon: <LottoPGFIcon size={5} />,
        content: 'Coming Soon',
        disabled: true,
      },
      {
        label: 'Zupass',
        icon: <ZuPassIcon size={5} />,
        content: 'Coming Soon',
        disabled: true,
      },
    ];
  }, [tickets.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const ticketsData = await getTickets();
        if (!ticketsData) return;
        let eventsData = await getEvents();
        if (eventsData) {
          eventsData =
            eventsData.filter((eventDetails) => {
              return ticketsData.some(
                (ticket: any) => ticket.eventId === eventDetails.id,
              );
            }) || [];
          setEvents(eventsData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    isAuthenticated && fetchData();
  }, [ceramic?.did?.parent, isAuthenticated]);

  return (
    <Stack
      justifyContent={'center'}
      gap="40px"
      sx={{
        margin: '0 auto',
        color: 'white',
        [theme.breakpoints.down('sm')]: {
          padding: '20px 10px',
          gap: '20px',
        },
      }}
      maxWidth={'680px'}
      py="30px"
    >
      <Stack>
        <Typography fontSize="24px" fontWeight={700} lineHeight={1.2}>
          Your Passport
        </Typography>
        <Stack
          direction="row"
          spacing="20px"
          alignItems="center"
          mt="20px"
          sx={{
            [theme.breakpoints.down('sm')]: {
              overflowX: 'auto',
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Stack
              key={`tab-${index}`}
              direction="row"
              spacing="10px"
              alignItems="center"
              p="6px 10px"
              borderRadius="10px"
              bgcolor="rgba(255, 255, 255, 0.15)"
              width="fit-content"
              sx={{
                opacity: tab.disabled ? 0.5 : 1,
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {tab.icon}
              <Typography
                fontSize="18px"
                lineHeight={1.2}
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '14px',
                  },
                }}
              >
                {tab.label}
              </Typography>
              <Box
                sx={{
                  p: '2px 6px',
                  borderRadius: '20px',
                  bgcolor: 'rgba(255, 255, 255, 0.10)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  fontSize="12px"
                  fontWeight={600}
                  lineHeight={1.2}
                  whiteSpace="nowrap"
                >
                  {tab.content}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Stack my="60px" alignItems="center" justifyContent="center">
          <Box position="relative">
            <Image
              src={profile?.avatar ?? '/user/avatar_p.png'}
              alt="profile"
              height={80}
              width={80}
              style={{ position: 'relative', zIndex: 1 }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '-29px',
                left: '-29px',
                width: '130px',
                height: '130px',
                background:
                  'url(/user/avatar_p.png) lightgray 50% / cover no-repeat',
                borderRadius: '100px',
                opacity: 0.4,
                filter: 'blur(25px)',
              }}
            />
          </Box>
        </Stack>
        <Stack
          direction="row"
          spacing="14px"
          padding="10px"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.05)"
          border="1px solid rgba(255, 255, 255, 0.10)"
          borderRadius="10px"
          sx={{ opacity: 0.8, cursor: 'pointer' }}
          onClick={() => router.push(`/passport/scanqr`)}
        >
          <QRCodeIcon />
          <Typography variant="subtitleSB" color="white">
            Scan QR Code
          </Typography>
        </Stack>
      </Stack>
      <Stack
        p="20px"
        spacing="20px"
        border="1px solid rgba(255, 255, 255, 0.10)"
        borderRadius="10px"
        sx={{
          [theme.breakpoints.down('sm')]: {
            p: '10px',
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing="10px" pb="10px">
          <CalendarIcon />
          <Typography fontSize="20px" fontWeight={700} lineHeight={1.2}>
            Event Credentials
          </Typography>
        </Stack>
        <Stack spacing="10px">
          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height="72px" />
          ) : events.length > 0 ? (
            events.map((item, index) => (
              <Stack
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`passport/${item.id}`)}
                key={`Scrollpass-Credential-${index}`}
                direction="row"
                spacing="14px"
                padding="10px"
                alignItems="center"
                bgcolor="#262626"
                borderRadius="10px"
                border="1px solid rgba(255, 255, 255, 0.10)"
              >
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.imageUrl}
                  width="50px"
                  height="50px"
                  borderRadius="4px"
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flex={1}
                  alignItems="center"
                >
                  <Stack spacing="4px">
                    <Typography
                      fontSize="18px"
                      fontWeight={700}
                      lineHeight={1.2}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      fontSize="10px"
                      lineHeight={1.2}
                      sx={{ opacity: 0.7 }}
                    >
                      You have{' '}
                      {
                        tickets.filter((ticket) => ticket.eventId === item.id)
                          .length
                      }{' '}
                      ticket
                    </Typography>
                  </Stack>
                  <ArrowForwardIcon />
                </Stack>
              </Stack>
            ))
          ) : (
            <Typography sx={{ opacity: 0.7 }}>No tickets found</Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
