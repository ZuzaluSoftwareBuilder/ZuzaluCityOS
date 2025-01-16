import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Stack,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  AcademicCapIcon,
  CubeIcon,
  EditIcon,
  HeroMapIcon,
  MapIcon,
  SessionIcon,
  SpeakWaveIcon,
  TicketIcon,
  UserCircleIcon,
} from 'components/icons';
import { Profile, Session } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatUserName } from '@/utils/format';
interface SessionCardProps {
  session: Session;
  eventId: string;
  spaceId?: string;
  userDID?: string;
  isLive?: boolean;
  isPublic?: boolean;
  people: Profile[];
  isLast?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  eventId,
  spaceId,
  userDID,
  isLive,
  isPublic,
  people,
  isLast,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const [isRSVP, setIsRSVP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rsvpNb, setRsvpNb] = useState<number>();
  const router = useRouter();
  const handleClick = async () => {
    if (spaceId) {
      router.push(
        `/spaces/${spaceId}/events/${eventId}/sessions/${session.uuid}`,
      );
    } else {
      router.push(
        `/events/${eventId}/sessions/${session.uuid}${
          isPublic ? '?public=1' : ''
        }`,
      );
    }
  };
  const getRSVPNB = async (sessionID: number) => {
    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('rsvpNb')
      .eq('id', sessionID)
      .single();

    if (sessionFetchError) {
      throw sessionFetchError;
    }
    setRsvpNb(sessionData.rsvpNb ?? 0);
  };
  const getRSVPSessionByID = async (sessionID: number, userDID: string) => {
    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .match({ sessionID, userDID });
    if (error) {
      console.log('Failed to get RSVP session by ID: ', error);
      return;
    }
    if (data.length > 0) {
      setIsRSVP(true);
      return;
    }
    setIsRSVP(false);
  };

  const setRSVPSession = async (sessionID: number, userDID: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('rsvp')
      .insert({ sessionID, userDID });
    if (error) {
      console.log('Failed to set as RSVP: ', error);
      setIsLoading(false);
      return;
    }
    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('rsvpNb')
      .eq('id', sessionID)
      .single();

    if (sessionFetchError) {
      throw sessionFetchError;
    }

    const currentRsvpNb = sessionData.rsvpNb || 0;

    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({ rsvpNb: currentRsvpNb + 1 })
      .eq('id', sessionID);

    if (sessionUpdateError) {
      throw sessionUpdateError;
    }
    setRsvpNb(currentRsvpNb + 1);

    setIsLoading(false);
    setIsRSVP(true);
  };

  const removeRSVPSession = async (sessionID: number, userDID: string) => {
    setIsLoading(true);

    const { error: deleteError } = await supabase
      .from('rsvp')
      .delete()
      .match({ sessionID, userDID });

    if (deleteError) {
      console.log('Failed to cancel RSVP:', deleteError);
      setIsLoading(false);
      return;
    }

    const { data: sessionData, error: sessionFetchError } = await supabase
      .from('sessions')
      .select('rsvpNb')
      .eq('id', sessionID)
      .single();

    if (sessionFetchError) {
      console.log('Failed to fetch session data:', sessionFetchError);
      setIsLoading(false);
      return;
    }

    const currentRsvpNb = sessionData.rsvpNb || 0;

    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({ rsvpNb: Math.max(0, currentRsvpNb - 1) })
      .eq('id', sessionID);

    if (sessionUpdateError) {
      console.log('Failed to update RSVP number:', sessionUpdateError);
      setIsLoading(false);
      return;
    }
    setRsvpNb(Math.max(0, currentRsvpNb - 1));

    setIsLoading(false);
    setIsRSVP(false);
  };

  const handleRSVPTicketTooltip = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (userDID) {
      setRSVPSession(Number(session.id), userDID);
    }
  };

  const handleCancelTicketTooltip = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    removeRSVPSession(Number(session.id), userDID as string);
  };

  const handleTicketClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRSVP) {
      removeRSVPSession(Number(session.id), userDID as string);
    } else {
      if (userDID) {
        setRSVPSession(Number(session.id), userDID);
      }
    }
  };

  useEffect(() => {
    if (userDID) {
      getRSVPSessionByID(Number(session.id), userDID);
      getRSVPNB(Number(session.id));
    }
  }, [session, userDID]);

  return (
    <>
      <Stack
        onClick={() => handleClick()}
        direction="row"
        padding="10px"
        borderRadius={'10px'}
        width="100%"
        overflow="hidden"
        sx={{
          ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          cursor: 'pointer',
        }}
      >
        <Stack flex={1} minWidth={0}>
          <Stack direction="row" spacing="8px" alignItems="center">
            {isLive && (
              <Typography
                bgcolor="rgba(125, 255, 209, 0.10)"
                padding="4px 8px"
                color="#7DFFD1"
                borderRadius="2px"
                fontSize={10}
                fontWeight={700}
                lineHeight={1.2}
                display="flex"
                alignItems="center"
                gap="4px"
              >
                <Stack
                  width="4px"
                  height="4px"
                  bgcolor="#7DFFD1"
                  borderRadius="50%"
                  sx={{
                    animation: 'blink 1.5s infinite',
                    '@keyframes blink': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
                LIVE
              </Typography>
            )}
            <Stack direction="row" spacing="4px" alignItems="center">
              <Typography
                fontSize={16}
                fontWeight={600}
                sx={{ opacity: '0.8' }}
              >
                {dayjs(session.startTime).tz(session.timezone).format('h:mm A')}
              </Typography>
              <Typography fontSize={13} sx={{ opacity: '0.5' }}>
                - {dayjs(session.endTime).tz(session.timezone).format('h:mm A')}
              </Typography>
            </Stack>
            <Typography
              bgcolor="rgba(255, 255, 255, 0.1)"
              padding="2px 4px"
              color="#fff"
              fontSize={10}
              fontWeight={700}
              lineHeight={1.2}
              borderRadius="2px"
            >
              {session.format === 'person' ? 'IRL' : 'ONLINE'}
            </Typography>
          </Stack>
          <Typography fontSize={18} fontWeight={700} lineHeight={1.4} mt="10px">
            {session.title}
          </Typography>
          <Stack direction={'row'} spacing={1} alignItems="center" mt="14px">
            {session.track && (
              <Stack
                direction={'row'}
                alignItems={'center'}
                spacing="5px"
                p="4px 8px"
                borderRadius="20px"
                bgcolor="rgba(255, 255, 255, 0.1)"
              >
                <HeroMapIcon />
                <Typography fontSize={10} lineHeight={1.2} color="#fff">
                  {session.track}
                </Typography>
              </Stack>
            )}
            {session.type && (
              <Stack direction={'row'} alignItems={'center'} spacing="5px">
                <CubeIcon />
                <Typography fontSize={10} lineHeight={1.2} color="#67DBFF">
                  {session.type}
                </Typography>
              </Stack>
            )}
            {session.experience_level && (
              <Stack direction={'row'} alignItems={'center'} spacing="5px">
                <AcademicCapIcon />
                <Typography fontSize={10} lineHeight={1.2} color="#FFB070">
                  {session.experience_level}
                </Typography>
              </Stack>
            )}
          </Stack>
          {session.speakers.length > 2 && (
            <Stack direction={'row'} spacing={1} alignItems="center" mt="14px">
              <SpeakWaveIcon />
              {session.speakers
                ? JSON.parse(session.speakers).map(
                    (speaker: any, index: number) => (
                      <Stack
                        key={`Speaker-${index}`}
                        direction={'row'}
                        spacing="4px"
                        alignItems={'center'}
                      >
                        <Box
                          component={'img'}
                          height={20}
                          width={20}
                          borderRadius={10}
                          src={
                            people.find(
                              (item: any) =>
                                item.author?.id === speaker.author.id,
                            )?.avatar || '/user/avatar_p.png'
                          }
                        />
                        <Typography
                          fontSize={13}
                          lineHeight={1.4}
                          sx={{ opacity: 0.56 }}
                        >
                          {formatUserName(speaker.username)}
                        </Typography>
                      </Stack>
                    ),
                  )
                : null}
            </Stack>
          )}
          <Stack
            direction={'row'}
            alignItems={'center'}
            spacing="5px"
            sx={{ opacity: '0.56' }}
            mt="10px"
          >
            <MapIcon size={4} />
            <Typography
              fontSize={13}
              textTransform={session.format !== 'online' ? 'uppercase' : 'none'}
            >
              {session.format === 'online'
                ? session.video_url
                : session.location}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          gap={'10px'}
          alignItems={'flex-end'}
          minWidth={'fit-content'}
          ml={1}
        >
          {userDID && session.creatorDID === userDID && (
            <Stack
              direction={'row'}
              gap={'4px'}
              padding={'2px 4px'}
              bgcolor={'rgba(255, 209, 135, 0.10)'}
              borderRadius={'2px'}
              alignItems={'center'}
            >
              <UserCircleIcon color={'#FFCC66'} size={4} />
              <Typography
                textTransform={'uppercase'}
                fontWeight={700}
                fontSize={'10px'}
                color={'#FFC77D'}
              >
                My Session
              </Typography>
            </Stack>
          )}
          <Tooltip
            title={
              !isRSVP ? (
                <Typography
                  sx={{ cursor: 'pointer' }}
                  fontSize={'14px'}
                  onClick={handleRSVPTicketTooltip}
                >
                  RSVP
                </Typography>
              ) : (
                <Typography
                  sx={{ cursor: 'pointer' }}
                  fontSize={'14px'}
                  onClick={handleCancelTicketTooltip}
                >
                  Cancel
                </Typography>
              )
            }
            sx={{ cursor: 'pointer', borderRadius: '8px' }}
          >
            <Stack
              padding="4px"
              spacing="4px"
              direction="row"
              alignItems="center"
              borderRadius="8px"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              sx={{
                opacity: 0.7,
                color: isRSVP ? '#7DFFD1' : 'white',
                backgroundColor: isRSVP
                  ? 'rgba(125, 255, 209, 0.10)'
                  : 'rgba(255, 255, 255, 0.05)',
                width: 'fit-content',
              }}
              height="fit-content"
              onClick={handleTicketClick}
            >
              {isLoading ? (
                <CircularProgress
                  size={'24px'}
                  sx={{ color: '#7DFFD1' }}
                ></CircularProgress>
              ) : isRSVP ? (
                hover ? (
                  <CancelIcon />
                ) : (
                  <TicketIcon color={'#7DFFD1'} />
                )
              ) : (
                <TicketIcon color={'white'} />
              )}
              <Typography variant="bodyS">
                {rsvpNb !== undefined ? rsvpNb : 0}
              </Typography>
            </Stack>
          </Tooltip>
        </Stack>
      </Stack>
      {!isLast && <Divider />}
    </>
  );
};

export default SessionCard;
