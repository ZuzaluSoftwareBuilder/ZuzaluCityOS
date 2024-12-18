'use client';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Skeleton, Typography } from '@mui/material';
import {
  EventIcon,
  SpaceIcon,
  HomeIcon,
  ArrowUpRightIcon,
} from 'components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { ZuButton } from '@/components/core';
import { EventData, Event } from '@/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SidebarProps {
  selected: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, composeClient, ceramic } = useCeramicContext();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getEvents = async () => {
    try {
      setIsLoading(true);
      const response: any = await composeClient.executeQuery(`
      query {
        zucityEventIndex(first: 100) {
          edges {
            node {
              id
              imageUrl
              title
              members{
              id
              }
              admins{
              id
              }
              superAdmin{
              id
              }
              profile {
                username
                avatar
              }
              space {
                name
                avatar
              }
              tracks
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let eventsData = await getEvents();
        if (eventsData) {
          eventsData =
            eventsData.filter((eventDetails) => {
              const admins =
                eventDetails?.admins?.map((admin) => admin.id.toLowerCase()) ||
                [];
              const superadmins =
                eventDetails?.superAdmin?.map((superAdmin) =>
                  superAdmin.id.toLowerCase(),
                ) || [];
              const members =
                eventDetails?.members?.map((member) =>
                  member.id.toLowerCase(),
                ) || [];
              const userDID =
                ceramic?.did?.parent.toString().toLowerCase() || '';
              return (
                superadmins.includes(userDID) ||
                admins.includes(userDID) ||
                members.includes(userDID)
              );
            }) || [];
          setEvents(eventsData);
        }
      } catch (err) {
        console.log(err);
      }
    };
    isAuthenticated && fetchData();
  }, [ceramic?.did?.parent, isAuthenticated]);

  const naviButtons = [
    {
      content: 'Home',
      icon: <HomeIcon />,
      function: () => router.push('/'),
      url: '/',
    },
    {
      content: 'Communities',
      icon: <SpaceIcon />,
      function: () => router.push('/spaces'),
      url: '/spaces',
    },
    {
      content: 'Events',
      icon: <EventIcon />,
      function: () => router.push('/events'),
      url: '/events',
    },
    // {
    //   content: 'Zapps',
    //   icon: <BoltIcon />,
    //   function: () => { }
    // }
  ];

  const footerItems = [
    {
      content: 'Docs',
      url: 'https://bit.ly/ZuSoftware-doc',
    },
    {
      content: 'About',
      url: 'https://zuzalu.gitbook.io/zuzalu-beta-docs/welcome/zuzalu.city-vision-and-mission',
    },
    {
      content: 'X/Twitter',
      url: 'https://x.com/Zuzalu_city',
    },
    {
      content: 'Farcaster',
      url: 'https://warpcast.com/zuzalucity',
    },
    {
      content: 'Builder Chat',
      url: 'https://matrix.to/#/#zuzalusoftware:matrix.org',
    },
    {
      content: 'Medium',
      url: 'https://medium.com/@Zuzalu_city',
    },
    {
      content: 'Paragraph',
      url: 'https://paragraph.xyz/@zuzalu.city',
    },
    {
      content: 'Podcast',
      url: 'https://youtube.com/@ZuzaluCity',
    },
  ];

  return (
    <Box
      sx={{
        width: selected !== 'Space Details' ? '260px' : 'auto',
        height: 'calc(100vh - 50px)',
        position: 'sticky',
        top: '50px',
        transitionProperty: 'width',
        transitionDuration: '300',
        transitionTimingFunction: 'ease-in-out',
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        display: 'flex',
        flexDirection: 'column',
      }}
      borderRight="1px solid #383838"
    >
      <Box
        display="flex"
        flexDirection="column"
        paddingX="10px"
        paddingY="20px"
        gap="15px"
      >
        {naviButtons.map((item, index) => {
          return (
            <Box
              display="flex"
              padding="10px"
              alignItems="center"
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#383838' } }}
              bgcolor={pathname === item.url ? '#383838' : 'transparent'}
              gap="10px"
              borderRadius="10px"
              onClick={item.function}
              key={index}
            >
              {item.icon}
              {selected !== 'Space Details' && (
                <Typography color="white" variant="bodyMB">
                  {item.content}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="10px"
        sx={{
          borderTop: '1px solid #383838',
          borderBottom: '1px solid #383838',
          marginX: '10px',
          padding: '20px 0 10px',
          flex: 1,
          flexDirection: isAuthenticated ? 'column' : 'column-reverse',
        }}
      >
        {isAuthenticated ? (
          <>
            <Typography fontSize={10} color="rgba(255, 255, 255, 0.7)">
              YOUR RSVP&apos;D EVENTS
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gap="10px"
              sx={{
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 492px)',
                flex: 1,
              }}
            >
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      sx={{
                        padding: '6px 10px',
                        opacity: 0.7,
                        cursor: 'pointer',
                      }}
                    >
                      <Skeleton variant="rounded" width={20} height={20} />
                      <Skeleton variant="rounded" width={190} height={17} />
                    </Box>
                  ))
                : events.map((event, index) => {
                    return (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap="10px"
                        sx={{
                          padding: '6px 10px',
                          opacity: 0.7,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                          },
                          borderRadius: '4px',
                        }}
                        onClick={() => {
                          router.push(`/events/${event.id}`);
                        }}
                      >
                        <Image
                          src={event.imageUrl!}
                          alt={event.title}
                          width={20}
                          height={20}
                          style={{ objectFit: 'cover', borderRadius: '2px' }}
                        />
                        <Typography color="white" variant="bodyM" noWrap>
                          {event.title}
                        </Typography>
                      </Box>
                    );
                  })}
            </Box>
          </>
        ) : null}
        <Box
          display="flex"
          gap="10px"
          alignItems="center"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
          onClick={() =>
            window.open(
              'https://github.com/ZuzaluSoftwareBuilder/ZuzaluCityOS',
              '_blank',
            )
          }
        >
          <Typography fontSize={10} color="rgba(255, 255, 255, 0.7)">
            Zuzalu.city is open source
          </Typography>
          <Image
            src="/sidebar/gitHub.png"
            alt="github"
            width={24}
            height={24}
            style={{ opacity: 0.7 }}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          marginX: '10px',
          padding: '20px 0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingLeft: '10px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {footerItems.map((item, index) => {
              return (
                <Typography
                  key={index}
                  color="rgba(225, 225, 225, 0.7)"
                  variant="body2"
                  component="a"
                  href={item.url}
                  target="_blank"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      textDecorationColor: '#7dffd1',
                      color: '#7dffd1',
                      opacity: 0.7,
                    },
                  }}
                >
                  {item.content}
                </Typography>
              );
            })}
          </Box>
          {/*<Typography
            color="rgba(225, 225, 225, 0.7)"
            variant="body2"
            component="a"
            href="https://zuzalu.gitbook.io/zuzalucitybeta/welcome/what-is-zuzalu.city/what-is-zuzalu"
            target="_blank"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationColor: '#7dffd1',
                color: '#7dffd1',
                opacity: 0.7,
              },
            }}
          >
            About Zuzalu
          </Typography>
          <Typography
            color="rgba(225, 225, 225, 0.7)"
            variant="body2"
            component="a"
            href="https://zuzalu.gitbook.io/zuzalucitybeta"
            target="_blank"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationColor: '#7dffd1',
                color: '#7dffd1',
                opacity: 0.7,
              },
            }}
          >
            About Zuzalu.city
          </Typography>*/}
        </Box>
        <ZuButton
          variant="outlined"
          endIcon={<ArrowUpRightIcon size={5} />}
          sx={{
            width: '100%',
            height: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '14px',
            color: '#fff',
            fontWeight: 700,
            marginTop: '30px',
          }}
          onClick={() =>
            window.open(
              'https://zuzapp-v1-events-app-delta.vercel.app/dashboard/home',
              '_blank',
            )
          }
        >
          Legacy Registry App
        </ZuButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
