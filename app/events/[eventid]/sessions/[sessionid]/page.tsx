'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';
import {
  Stack,
  Typography,
  SwipeableDrawer,
  Divider,
  Box,
  Select,
  OutlinedInput,
  MenuItem,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import { TimeView } from '@mui/x-date-pickers/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from '@/utils/dayjs';
import { ZuInput, ZuButton, ZuSwitch } from '@/components/core';
import {
  PlusCircleIcon,
  XMarkIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  MapIcon,
  SessionIcon,
  MicrophoneIcon,
  TagIcon,
  PlusIcon,
  MinusIcon,
  ShareIcon,
  ArrowUpTrayIcon,
} from '@/components/icons';
import BpCheckbox from '@/components/event/Checkbox';
import {
  Anchor,
  Session,
  ProfileEdge,
  Profile,
  CeramicResponseType,
  EventEdge,
  Venue,
  Event,
  FilmOptionType,
} from '@/types';
import { EXPREIENCE_LEVEL_TYPES } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { supabase } from '@/utils/supabase/client';
import { SessionSupabaseData } from '@/types';
import { supaEditSession } from '@/services/session';
import Link from 'next/link';
import formatDateAgo from '@/utils/formatDateAgo';
import SelectCategories from '@/components/select/selectCategories';
import SelectSearchUser from '@/components/select/selectSearchUser';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { useEditorStore } from '@/components/editor/useEditorStore';
import {
  FormLabel,
  FormLabelDesc,
} from '@/components/typography/formTypography';
import { Thumbnail } from '../../components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { formatUserName } from '@/utils/format';
import { useDialog } from '@/components/dialog/DialogContext';

const EditorPreview = dynamic(
  () => import('@/components/editor/EditorPreview'),
  {
    ssr: false,
  },
);

const SuperEditor = dynamic(() => import('@/components/editor/SuperEditor'), {
  ssr: false,
});

const Home = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showDialog } = useDialog();

  const [tabName, setTabName] = useState('Sessions');
  const params = useParams();
  const searchParams = useSearchParams();
  const [eventData, setEventData] = useState<Event>();
  const { authenticate, composeClient, ceramic, isAuthenticated, profile } =
    useCeramicContext();
  const [sessionView, setSessionView] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);
  const eventId = params.eventid.toString();
  const isPublic = searchParams.get('public') === '1';
  const [urlOption, setUrlOption] = useState<string>('');
  const [session, setSession] = useState<Session>();
  const [isRsvped, setIsRsvped] = useState<boolean>(false);
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const [locationAvatar, setLocationAvatar] = useState<string>('');
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const [canViewSessions, setCanViewSessions] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [currentHref, setCurrentHref] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const profileId = profile?.id || '';
  const [directions, setDirections] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isDirections, setIsDirections] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Venue>();
  const [bookedSessionsForDay, setBookedSessionsForDay] = useState<Session[]>(
    [],
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [person, setPerson] = useState(true);
  const [online, setOnline] = useState(false);
  const [sessionName, setSessionName] = useState<string>('');
  const [sessionTrack, setSessionTrack] = useState<string>(
    session?.track ?? '',
  );
  const [sessionTags, setSessionTags] = useState<string[]>([]);
  const [initialSessionTags, setIntialSessionTags] = useState<FilmOptionType[]>(
    [],
  );
  const sessionDescriptionEditorStore = useEditorStore();
  const [sessionType, setSessionType] = useState<string>('');
  const [sessionExperienceLevel, setSessionExperienceLevel] =
    useState<string>(' ');
  const [sessionVideoURL, setSessionVideoURL] = useState<string>(' ');
  const [sessionDate, setSessionDate] = useState<Dayjs | null>();
  const [sessionStartTime, setSessionStartTime] = useState<Dayjs>(
    dayjs().tz(eventData?.timezone).set('hour', 0).set('minute', 0),
  );
  const adminId = ceramic?.did?.parent || '';
  const [sessionEndTime, setSessionEndTime] = useState<Dayjs>(
    dayjs().tz(eventData?.timezone).set('hour', 0).set('minute', 0),
  );
  const [sessionOrganizers, setSessionOrganizers] = useState<Array<any>>([
    profile,
  ]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Array<any>>([]);
  const [sessionLocation, setSessionLocation] = useState<string>('');
  const [sessionLiveStreamLink, setSessionLiveStreamLink] =
    useState<string>('');
  const [sessionRecordingLink, setSessionRecordingLink] = useState<string>('');
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [hiddenOrganizer, setHiddenOrganizer] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<Session[]>([]);
  const [sessionUpdated, setSessionUpdated] = useState<boolean>(false);
  const [tagsChanged, setTagsChanged] = useState<boolean>(false);
  const [passingTitle, setPassingTitle] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateSessionPublic = useMutation({
    mutationFn: async ({ isPublic }: { isPublic: boolean }) => {
      const { data, error } = await supabase
        .from('sessions')
        .update({ isPublic })
        .eq('id', session?.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setSessionUpdated((prevState) => !prevState);
    },
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const toggleOpenPublic = useCallback(() => {
    const isPublic = !session?.isPublic;
    showDialog({
      title: isPublic ? 'Open to Public' : 'Make Private',
      message: isPublic
        ? `You will list this session to the “Public Sessions” Tab. Once shared to this event's Public Sessions, this session will be viewable by all users.`
        : `You will hide this session from the “Public Sessions” Tab. This session will no longer be viewable by all users.`,
      confirmText: 'Share',
      onConfirm: () => updateSessionPublic.mutateAsync({ isPublic }),
    });
  }, [session?.isPublic, showDialog, updateSessionPublic]);

  const handleChange = (val: string[]) => {
    setSessionTags(val);
    setTagsChanged(true);
  };
  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on ZucityEvent {
              createdAt
              description
              endTime
              externalUrl
              gated
              id
              imageUrl
              meetingUrl
              profileId
              spaceId
              startTime
              status
              tagline
              timezone
              title
              tracks
              members{
              id
              }
              admins{
              id
              }
              superAdmin{
              id
              }
              space {
                id
                name
                gated
                avatar
                banner
                description
              }
              profile {
                username
                avatar
              }
              customLinks {
                title
                links
              }
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
          setEventData(response.data.node);
          return response.data.node;
        }
      }
    } catch (err) {
      console.log('Failed to fetch event: ', err);
    }
  };

  const getSession = async () => {
    try {
      const { data: venueData } = await supabase
        .from('venues')
        .select('*')
        .eq('eventId', eventId);
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('*')
        .eq('uuid', params.sessionid.toString())
        .single();
      if (sessionData) {
        setSession(sessionData);
        setSessionName(sessionData.title);
        setSessionTrack(sessionData.track);
        setSessionTags(sessionData.tags);
        sessionData.tags &&
          setIntialSessionTags(
            sessionData.tags.split(',').map((item: string) => ({
              value: item.trim(),
              label: item.trim(),
            })),
          );
        setSessionType(sessionData.type);
        setSessionExperienceLevel(sessionData.experience_level);
        setSessionLiveStreamLink(sessionData.liveStreamLink);
        setSessionVideoURL(sessionData.video_url);
        setSessionRecordingLink(sessionData.recording_link);
        const sessionDate = dayjs(sessionData.startTime).startOf('day');
        setSessionDate(sessionDate);
        const sessionStartTime = dayjs(sessionDate)
          .hour(dayjs(sessionData.startTime).tz(eventData?.timezone).hour())
          .minute(
            dayjs(sessionData.startTime).tz(eventData?.timezone).minute(),
          );
        setSessionStartTime(sessionStartTime);
        const sessionEndTime = dayjs(sessionDate)
          .hour(dayjs(sessionData.endTime).tz(eventData?.timezone).hour())
          .minute(dayjs(sessionData.endTime).tz(eventData?.timezone).minute());
        setSessionEndTime(sessionEndTime);
        setSessionOrganizers(JSON.parse(sessionData.organizers));
        setSessionSpeakers(JSON.parse(sessionData.speakers));
        sessionDescriptionEditorStore.setValue(
          JSON.stringify(sessionData.description)
            .slice(1, -1)
            .replace(/\\\\/g, '\\')
            .replace(/\\"/g, '"'),
        );
        const isCustomLocation =
          sessionData.location.startsWith('Custom Location:');
        setSessionLocation(isCustomLocation ? 'Custom' : sessionData.location);

        if (isCustomLocation) {
          setCustomLocation(
            sessionData.location.replace('Custom Location: ', ''),
          );
        }

        if (sessionData.format === 'online') {
          setPerson(false);
          setOnline(true);
        }
        if (sessionData.format === 'person' && !isCustomLocation) {
          setSelectedRoom(
            venueData?.filter((item) => item.name === sessionData.location)[0],
          );
          const dayName = sessionDate.format('dddd');
          const selectedDay = sessionDate.format('YYYY-MM-DD');
          if (sessionData.location == '') {
            return;
          }
          const available = JSON.parse(
            venueData?.filter((item) => item.name === sessionData.location)[0]
              .bookings,
          );
          setAvailableTimeSlots(available[dayName.toLowerCase()] || []);
          const { data: bookedSessions } = await supabase
            .from('sessions')
            .select('*')
            .eq('location', sessionData.location);
          if (bookedSessions) {
            const bookedSessionsDay = bookedSessions.filter((session) => {
              const sessionStartDay = dayjs(session.startTime).format(
                'YYYY-MM-DD',
              );

              return (
                sessionStartDay === selectedDay && session.id !== sessionData.id
              );
            });

            setBookedSessionsForDay(bookedSessionsDay);
          }
        }
      }
      const { data: rsvpData } = await supabase
        .from('rsvp')
        .select('*')
        .eq('sessionID', sessionData.id)
        .eq('userDID', ceramic?.did?.parent.toString().toLowerCase());
      if (rsvpData && rsvpData.length > 0) {
        setIsRsvped(true);
      }
      const { data: locationData, error: locationError } = await supabase
        .from('venues')
        .select('avatar')
        .eq('name', sessionData.location)
        .eq('eventId', sessionData.eventId)
        .single();
      if (locationError) {
        console.error('Error fetching data:', locationError);
      }
      setLocationAvatar(locationData?.avatar);
      const { data: deleteData, error: deleteError } = await supabase
        .from('sessions')
        .select('*')
        .eq('creatorDID', ceramic?.did?.parent.toString().toLowerCase())
        .eq('id', sessionData.id)
        .single();
      if (deleteError) {
        console.error('Error fetching data:', deleteError);
      }
      if (deleteData) {
        setShowDeleteButton(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleRSVPClick = async (sessionID: string) => {
    setIsLoading(true);
    try {
      const { error: rsvpError } = await supabase.from('rsvp').insert({
        userDID: ceramic?.did?.parent.toString().toLowerCase(),
        sessionID: sessionID,
      });

      if (rsvpError) {
        throw rsvpError;
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

      setIsRsvped(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleCancelRSVP = async (sessionID: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('rsvp')
      .delete()
      .eq('sessionID', sessionID);
    if (error) {
      console.log('Failed to cancel RSVP: ', error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setIsRsvped(false);
  };

  const handleDateChange = async (date: Dayjs) => {
    if (date && person && sessionLocation !== 'Custom') {
      const dayName = date.format('dddd'); // Get the day name (e.g., 'Monday')
      const selectedDay = date.format('YYYY-MM-DD');
      if (sessionLocation == '') {
        return;
      }
      const available = JSON.parse(
        venues.filter((item) => item.name === sessionLocation)[0].bookings,
      );
      setAvailableTimeSlots(available[dayName.toLowerCase()] || []);
      const bookedSessions = await getBookedSession();
      if (bookedSessions) {
        const bookedSessionsDay = bookedSessions.filter((session) => {
          const sessionStartDay = dayjs(session.startTime).format('YYYY-MM-DD');

          return sessionStartDay === selectedDay;
        });

        setBookedSessionsForDay(bookedSessionsDay);
      }
    }
    setSessionDate(date);
    setSessionStartTime(
      dayjs.tz(date, eventData?.timezone).set('hour', 0).set('minute', 0),
    );
    setSessionEndTime(
      dayjs.tz(date, eventData?.timezone).set('hour', 0).set('minute', 0),
    );
  };

  const isDateInRange = (
    date: Dayjs,
    startDate?: string,
    endDate?: string,
  ): boolean => {
    return (
      date.isAfter(dayjs(startDate).subtract(1, 'day')) &&
      date.isBefore(dayjs(endDate).add(1, 'day'))
    );
  };

  const isDateAvailable = (date: Dayjs): boolean => {
    if (sessionLocation === 'Custom') return false;
    if (!selectedRoom?.bookings) return true;
    const available = JSON.parse(selectedRoom?.bookings!);
    const dayName = date.format('dddd');
    const availableTime = available[dayName.toLowerCase()];
    return (
      availableTime.filter((item: any) => {
        return item.startTime && item.endTime;
      }).length === 0
    );
  };

  const isTimeAvailable = (date: Dayjs, isStart: boolean): boolean => {
    let timezone = eventData?.timezone;

    if (sessionDate == null) return true;
    const formattedTime = date.format('HH:mm');
    const isNotWithinBookedSession = bookedSessionsForDay.every((session) => {
      const sessionStartTime = dayjs(session.startTime)
        .tz('UTC')
        .tz(timezone)
        .format('HH:mm');
      const sessionEndTime = dayjs(session.endTime)
        .tz('UTC')
        .tz(timezone)
        .format('HH:mm');

      if (isStart) {
        return (
          formattedTime < sessionStartTime || formattedTime >= sessionEndTime
        );
      } else {
        return (
          formattedTime <= sessionStartTime || formattedTime > sessionEndTime
        );
      }
    });
    const isWithinAvailableSlot = availableTimeSlots.some((slot: any) => {
      let startTime;
      let endTime;
      if (isStart) {
        const startTime = dayjs
          .tz(slot.startTime, 'HH:mm', 'UTC')
          .tz(timezone)
          .format('HH:mm');
        const endTime = dayjs
          .tz(slot.endTime, 'HH:mm', 'UTC')
          .tz(timezone)
          .format('HH:mm');
        if (endTime >= startTime) {
          return formattedTime >= startTime && formattedTime < endTime;
        } else {
          return !(formattedTime < startTime && formattedTime >= endTime);
        }
      } else {
        startTime = sessionStartTime.tz(timezone).format('HH:mm');
        endTime = dayjs
          .tz(slot.endTime, 'HH:mm', 'UTC')
          .tz(timezone)
          .format('HH:mm');
        if (endTime >= startTime) {
          return formattedTime >= startTime && formattedTime <= endTime;
        } else {
          return !(formattedTime < startTime && formattedTime > endTime);
        }
      }
    });
    return isWithinAvailableSlot && isNotWithinBookedSession;
  };

  const getPeople: () => Promise<void> = async () => {
    try {
      const response: any = await composeClient.executeQuery(`
        query MyQuery {
          zucityProfileIndex(first: 1000) {
            edges {
              node {
                id
                username
                avatar
                author {
                  id
                }
              }
            }
          }
        }
      `);

      if ('zucityProfileIndex' in response.data) {
        const profileData: ProfileEdge = response.data as ProfileEdge;
        const fetchedPeople: Profile[] =
          profileData.zucityProfileIndex.edges.map((edge) => edge.node);
        setPeople(fetchedPeople);
      } else {
        console.error('Invalid data structure:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch sesssions:', error);
    }
  };
  const handleSpeakerChange = (users: Profile[]) => {
    setSessionSpeakers(users);
  };

  const handleOrganizerChange = (users: Profile[]) => {
    setSessionOrganizers(users);
  };
  const handleDelete = async (sessionID: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionID);
      if (error) {
        throw error;
      }
      sessionStorage.setItem('tab', 'Sessions');
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.log(error);
    }
  };
  const getBookedSession = async () => {
    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('location', sessionLocation);
      if (data) {
        setBookedSessions(data);
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('venues')
        .select('*')
        .eq('eventId', eventId);
      if (data !== null) {
        setVenues(data);
        const locations = data.map((item) => item.name);
        setLocations(locations);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const isSessionOverlap = (
    bookedSessions: Session[],
    startTime: Dayjs,
    endTime: Dayjs,
  ) => {
    const newSessionStart = startTime;
    const newSessionEnd = endTime;
    let timezone = eventData?.timezone;
    for (let session of bookedSessions) {
      const sessionStart = dayjs(session.startTime).tz('UTC').tz(timezone);
      const sessionEnd = dayjs(session.endTime).tz('UTC').tz(timezone);
      if (
        (newSessionStart.isBefore(sessionEnd) &&
          newSessionStart.isAfter(sessionStart)) ||
        (newSessionEnd.isAfter(sessionStart) &&
          newSessionEnd.isBefore(sessionEnd)) ||
        (newSessionStart.isBefore(sessionStart) &&
          newSessionEnd.isAfter(sessionEnd))
      ) {
        return true;
      }
    }
    return false;
  };

  const updateSession = async () => {
    if (!isAuthenticated) {
      return;
    }
    const bookedSessions = await getBookedSession();
    let bookedSessionsForDay: any[] = [];
    if (bookedSessions) {
      const bookedSessionsDay = bookedSessions.filter((session) => {
        const sessionStartDay = dayjs(session.startTime)
          .utc()
          .format('YYYY-MM-DD');

        return (
          sessionStartDay ===
            dayjs(sessionStartTime).utc().format('YYYY-MM-DD') &&
          session.uuid !== params.sessionid.toString()
        );
      });
      bookedSessionsForDay = bookedSessionsDay;
    }
    let timezone = eventData?.timezone;
    const description = sessionDescriptionEditorStore.getValueString();
    const format = person ? 'person' : 'online';

    const error =
      !eventId ||
      !sessionStartTime ||
      !description ||
      !sessionEndTime ||
      !sessionName ||
      !sessionTrack ||
      !sessionOrganizers ||
      !profileId;

    if (error) {
      typeof window !== 'undefined' &&
        window.alert('Please fill necessary fields!');
      return;
    } else if (dayjs(sessionEndTime).utc() <= dayjs(sessionStartTime).utc()) {
      typeof window !== 'undefined' &&
        window.alert('Please check the input session time');
      return;
    } else if (
      isSessionOverlap(
        bookedSessionsForDay,
        dayjs(sessionStartTime).tz('UTC').tz(timezone).set('second', 0),
        dayjs(sessionEndTime).tz('UTC').tz(timezone).set('second', 0),
      )
    ) {
      typeof window !== 'undefined' &&
        window.alert(
          'The new session overlaps with an existing session, please refresh and choose another venue/time',
        );
      return;
    }

    if (format === 'person') {
      if (sessionLocation === 'Custom' && !customLocation) {
        typeof window !== 'undefined' &&
          window.alert('Please fill custom location field');
        return;
      }
      if (!sessionLocation) {
        typeof window !== 'undefined' &&
          window.alert('Please fill location field');
        return;
      }
    } else {
      if (!sessionVideoURL) {
        typeof window !== 'undefined' &&
          window.alert('Please fill virtual location field');
        return;
      }
    }
    const formattedData: SessionSupabaseData = {
      title: sessionName,
      description,
      experience_level: sessionExperienceLevel,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]').toString(),
      startTime: sessionStartTime
        ? dayjs.tz(sessionStartTime, timezone).toISOString()
        : null,
      endTime: sessionEndTime
        ? dayjs.tz(sessionEndTime, timezone).toISOString()
        : null,
      profileId,
      eventId,
      tags: tagsChanged ? sessionTags.join(',') : session?.tags,
      type: sessionType,
      format,
      track: sessionTrack,
      timezone: timezone,
      video_url: sessionVideoURL,
      location:
        sessionLocation === 'Custom'
          ? `Custom Location: ${customLocation} ${directions}`
          : sessionLocation,
      organizers: JSON.stringify(sessionOrganizers),
      speakers: JSON.stringify(sessionSpeakers),
      creatorDID: adminId,
      uuid: params.sessionid.toString(),
      liveStreamLink: sessionLiveStreamLink,
      recording_link: sessionRecordingLink,
    };
    console.log(formattedData, sessionEndTime, sessionStartTime);
    try {
      setBlockClickModal(true);
      const response = await supaEditSession(formattedData);
      if (response.status === 200) {
        setShowModal(true);
        setSessionUpdated((prevState) => !prevState);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
    }
  };

  useQuery({
    queryKey: ['eventSessionDetail', ceramic?.did?.parent, sessionUpdated],
    queryFn: async () => {
      setCurrentHref(window.location.href);
      getPeople();
      getSession();
      getLocation();
    },
  });

  const List = (anchor: Anchor) => {
    if (!state['right']) return null;
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          title="Session Updated it"
          message="Please view it."
          showModal={showModal}
          onClose={() => {
            toggleDrawer('right', false);
            setShowModal(false);
          }}
          onConfirm={() => {
            toggleDrawer('right', false);
            setShowModal(false);
          }}
        />
        <Dialog
          showModal={blockClickModal}
          showActions={false}
          title="Updating Session"
          message="Please wait while the session is being updated..."
        />
        <Box
          sx={{
            width:
              anchor === 'top' || anchor === 'bottom'
                ? 'auto'
                : isMobile
                  ? '100%'
                  : '762px',
            backgroundColor: '#222222',
          }}
          role="presentation"
          zIndex="100"
          borderLeft="1px solid #383838"
        >
          <Box
            display="flex"
            alignItems="center"
            height="50px"
            borderBottom="1px solid #383838"
            paddingX={3}
            gap={2}
          >
            <ZuButton
              startIcon={<XMarkIcon />}
              onClick={() => toggleDrawer('right', false)}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              Close
            </ZuButton>
            <Typography variant="subtitleSB">Modify Session</Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="20px" padding={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitleMB">Modify Session</Typography>
              {/*<ZuButton
                startIcon={<ArchiveBoxIcon size={5} />}
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Save Draft
              </ZuButton>*/}
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Session Details</Typography>
              <Stack spacing="10px">
                <Typography variant="bodyBB">New Session Name*</Typography>
                <ZuInput
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Change Name"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Select a New Track*</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Attach a relevant track this session relates to
                </Typography>
                <Select
                  value={sessionTrack}
                  style={{ width: '100%' }}
                  onChange={(e) => setSessionTrack(e.target.value)}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#222222',
                        maxHeight: 200,
                        overflow: 'auto',
                      },
                    },
                  }}
                >
                  {eventData?.tracks?.split(',').map((i, index) => {
                    return (
                      <MenuItem value={i} key={`EventTrack_Index${index}`}>
                        {i}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">New Session Tags</Typography>
                  <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                    Search or create categories related to your space
                  </Typography>
                </Stack>
                <SelectCategories
                  onChange={handleChange}
                  initialValues={initialSessionTags}
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">
                  New Session Description*
                </Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Write new introduction for this session
                </Typography>
                <SuperEditor
                  value={sessionDescriptionEditorStore.value}
                  onChange={(val) => {
                    sessionDescriptionEditorStore.setValue(val);
                  }}
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">New Session Type</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Choose a type for your session to relay its nature to guests
                </Typography>
                <ZuInput
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  placeholder="Meetup, Activity, Party, etc.."
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">New Experience Level</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Select a level experience may be needed for this session
                </Typography>
                <Select
                  value={sessionExperienceLevel}
                  style={{ width: '100%' }}
                  onChange={(e) => setSessionExperienceLevel(e.target.value)}
                  input={<OutlinedInput label="Experience_Level" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#222222',
                      },
                    },
                  }}
                >
                  {EXPREIENCE_LEVEL_TYPES.map((i, index) => {
                    return (
                      <MenuItem value={i.key} key={`Speaker_Index${index}`}>
                        {i.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Live-Stream Link</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Enter a link for where this session will be streamed
                </Typography>
                <ZuInput
                  value={sessionLiveStreamLink}
                  onChange={(e) => setSessionLiveStreamLink(e.target.value)}
                  placeholder="https://"
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Recording Link</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                  Enter a link for where this session will be recorded
                </Typography>
                <ZuInput
                  value={sessionRecordingLink}
                  onChange={(e) => setSessionRecordingLink(e.target.value)}
                  placeholder="https://"
                />
              </Stack>
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Location & Booking</Typography>
              <Stack spacing="10px">
                <Typography variant="bodyBB">Session Format*</Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  gap="20px"
                  flexDirection={isMobile ? 'column' : 'row'}
                >
                  <Box
                    bgcolor={person ? '#484E45' : '#373737'}
                    borderRadius="10px"
                    padding="10px"
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    flex={1}
                    onClick={() => {
                      setPerson((prev) => !prev);
                      setOnline((prev) => !prev);
                    }}
                  >
                    <BpCheckbox checked={person} />
                    <Stack>
                      <Typography
                        color="white"
                        fontSize="16px"
                        fontWeight={600}
                        fontFamily="Inter"
                      >
                        In-Person
                      </Typography>
                      <Typography
                        color="white"
                        fontSize="10px"
                        fontFamily="Inter"
                      >
                        This is a physical event
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    bgcolor={online ? '#484E45' : '#373737'}
                    borderRadius="10px"
                    padding="10px"
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    flex={1}
                    onClick={() => {
                      setPerson((prev) => !prev);
                      setOnline((prev) => !prev);
                    }}
                  >
                    <BpCheckbox checked={online} />
                    <Stack>
                      <Typography
                        color="white"
                        fontSize="16px"
                        fontWeight={600}
                        fontFamily="Inter"
                      >
                        Online
                      </Typography>
                      <Typography
                        color="white"
                        fontSize="10px"
                        fontFamily="Inter"
                      >
                        Specially Online Event
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Stack>
              {person && (
                <Stack spacing="30px">
                  <Stack spacing="10px">
                    <Typography variant="bodyBB">Select Location*</Typography>
                    <Typography variant="bodyS">
                      Book a location to host this session
                    </Typography>
                    <Select
                      value={sessionLocation}
                      onChange={async (e) => {
                        const selectedRoom = venues.find(
                          (item) => item.name === e.target.value,
                        );
                        setSelectedRoom(selectedRoom);
                        setSessionLocation(e.target.value);
                        setSessionDate(null);
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#222222',
                            maxHeight: 200,
                            overflow: 'auto',
                          },
                        },
                      }}
                    >
                      {locations.map((location, index) => (
                        <MenuItem
                          key={`Location-Index${index}`}
                          value={location}
                        >
                          {location}
                        </MenuItem>
                      ))}
                      <MenuItem key="custom_location" value="Custom">
                        Custom
                      </MenuItem>
                    </Select>
                    {sessionLocation && sessionLocation !== 'Custom' && (
                      <Stack>
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          borderRadius="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          spacing="10px"
                          padding="10px"
                        >
                          <Typography variant="caption">
                            Your are booking at:
                          </Typography>
                          <Stack
                            borderRadius="10px"
                            padding="10px"
                            bgcolor="#313131"
                            direction="row"
                            spacing="10px"
                          >
                            <Box
                              component="img"
                              width="60px"
                              height="60px"
                              borderRadius="8px"
                              src={selectedRoom?.avatar}
                            />
                            <Stack spacing="4px">
                              <Typography variant="bodyBB">
                                {sessionLocation}
                              </Typography>
                              {/*<Typography variant="bodyS">
                                Sessions booked: {bookedSessions.length}
                              </Typography>*/}
                              <Typography variant="caption">
                                Capacity: {selectedRoom?.capacity}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                    {sessionLocation && sessionLocation === 'Custom' && (
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack spacing="10px">
                          <FormLabel>Custom Location</FormLabel>
                          <FormLabelDesc>
                            Write name of the location
                          </FormLabelDesc>
                          <ZuInput
                            value={customLocation}
                            placeholder="Type location name"
                            onChange={(e) => setCustomLocation(e.target.value)}
                          />
                          <ZuButton
                            endIcon={
                              !isDirections ? (
                                <PlusIcon size={4} />
                              ) : (
                                <MinusIcon size={4} />
                              )
                            }
                            onClick={() => setIsDirections((prev) => !prev)}
                          >
                            {!isDirections
                              ? 'Add Directions'
                              : 'Remove Directions'}
                          </ZuButton>
                          {isDirections && (
                            <ZuInput
                              placeholder="Directions description"
                              onChange={(e) => setDirections(e.target.value)}
                            />
                          )}
                          {customLocation && (
                            <Stack
                              borderRadius="10px"
                              border="1px solid #383838"
                              padding="10px"
                              spacing="10px"
                            >
                              <Typography variant="caption">
                                CUSTOM LOCATIONS:
                              </Typography>
                              <Stack
                                borderRadius="10px"
                                bgcolor="#373737"
                                padding="10px"
                              >
                                <Typography variant="bodyBB">
                                  {customLocation}
                                </Typography>
                                <Typography variant="bodyS">
                                  {directions}
                                </Typography>
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                  {sessionLocation && (
                    <Stack spacing="20px">
                      <Stack spacing="10px">
                        <Typography variant="bodyBB">Book a Date*</Typography>
                        <Typography variant="bodyS">
                          View and select the available dates and times for this
                          location
                        </Typography>
                        <Typography variant="bodyB">
                          Your booking will be at the event timezone:{' '}
                          {eventData?.timezone}
                        </Typography>
                        <DesktopDatePicker
                          timezone={eventData?.timezone}
                          value={sessionDate}
                          onChange={(newValue) => {
                            if (newValue !== null) {
                              handleDateChange(newValue);
                            }
                          }}
                          shouldDisableDate={(date: Dayjs) =>
                            !isDateInRange(
                              date,
                              eventData?.startTime,
                              eventData?.endTime,
                            ) || isDateAvailable(date)
                          }
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                          slotProps={{
                            popper: {
                              sx: {
                                '& .MuiPickersDay-root': { color: 'black' },
                                '& .MuiPickersDay-root.Mui-selected': {
                                  backgroundColor: '#D7FFC4',
                                },
                                '& .MuiPickersCalendarHeader-root': {
                                  color: 'black',
                                },
                              },
                            },
                          }}
                        />
                      </Stack>
                      {sessionDate && (
                        <Stack direction="row" spacing="20px">
                          <Stack spacing="10px" flex={1}>
                            <Typography variant="bodyBB">Start Time</Typography>
                            <DesktopTimePicker
                              key={sessionLocation}
                              value={sessionStartTime}
                              ampm={false}
                              onChange={(newValue) => {
                                if (newValue !== null) {
                                  const combined = dayjs
                                    .tz(sessionDate, eventData?.timezone)
                                    .set('hour', newValue.hour())
                                    .set('minute', newValue.minute());
                                  setSessionStartTime(combined);
                                }
                              }}
                              shouldDisableTime={(
                                date: Dayjs,
                                view: TimeView,
                              ) => {
                                if (
                                  (view === 'minutes' || view === 'hours') &&
                                  sessionLocation !== 'Custom'
                                ) {
                                  if (view === 'hours') {
                                    let availableMinutes = 0;
                                    for (
                                      let minute = 0;
                                      minute < 60;
                                      minute += 5
                                    ) {
                                      const checkTime = dayjs.tz(
                                        date.set('minute', minute),
                                        eventData?.timezone as string,
                                      );
                                      if (isTimeAvailable(checkTime, true)) {
                                        availableMinutes += 5;
                                      }
                                    }
                                    return availableMinutes < 5;
                                  } else {
                                    return !isTimeAvailable(
                                      dayjs.tz(
                                        date,
                                        eventData?.timezone as string,
                                      ),
                                      true,
                                    );
                                  }
                                }
                                return false;
                              }}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                },
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#313131',
                                  borderRadius: '10px',
                                },
                              }}
                              slotProps={{
                                field: {
                                  readOnly: true,
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPickersDay-root': { color: 'black' },
                                    '& .MuiPickersDay-root.Mui-selected': {
                                      backgroundColor: '#D7FFC4',
                                    },
                                    '& .MuiPickersCalendarHeader-root': {
                                      color: 'black',
                                    },
                                    '& .MuiMultiSectionDigitalClock-root': {
                                      color: 'black',
                                    },
                                  },
                                },
                              }}
                            />
                          </Stack>
                          <Stack spacing="10px" flex={1}>
                            <Typography variant="bodyBB">End Time</Typography>
                            <DesktopTimePicker
                              key={sessionLocation}
                              value={sessionEndTime}
                              ampm={false}
                              onChange={(newValue) => {
                                if (newValue !== null) {
                                  const combined = dayjs
                                    .tz(sessionDate, eventData?.timezone)
                                    .set('hour', newValue.hour())
                                    .set('minute', newValue.minute());
                                  setSessionEndTime(combined);
                                }
                              }}
                              shouldDisableTime={(
                                date: Dayjs,
                                view: TimeView,
                              ) => {
                                if (
                                  (view === 'minutes' || view === 'hours') &&
                                  sessionLocation !== 'Custom'
                                ) {
                                  if (view === 'hours') {
                                    for (
                                      let minute = 0;
                                      minute < 60;
                                      minute += 5
                                    ) {
                                      const checkTime = dayjs.tz(
                                        date.set('minute', minute),
                                        eventData?.timezone as string,
                                      );
                                      if (isTimeAvailable(checkTime, false)) {
                                        return false;
                                      }
                                    }
                                    return true;
                                  } else {
                                    return !isTimeAvailable(
                                      dayjs.tz(
                                        date,
                                        eventData?.timezone as string,
                                      ),
                                      false,
                                    );
                                  }
                                }
                                return false;
                              }}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  color: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                },
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#313131',
                                  borderRadius: '10px',
                                },
                              }}
                              slotProps={{
                                field: {
                                  readOnly: true,
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPickersDay-root': { color: 'black' },
                                    '& .MuiPickersDay-root.Mui-selected': {
                                      backgroundColor: '#D7FFC4',
                                    },
                                    '& .MuiPickersCalendarHeader-root': {
                                      color: 'black',
                                    },
                                    '& .MuiMultiSectionDigitalClock-root': {
                                      color: 'black',
                                    },
                                  },
                                },
                              }}
                            />
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  )}

                  {sessionLocation &&
                    sessionDate &&
                    sessionStartTime !==
                      dayjs().set('hour', 0).set('minute', 0) &&
                    sessionEndTime !==
                      dayjs().set('hour', 0).set('minute', 0) && (
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          spacing="10px"
                          padding="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          borderRadius="10px"
                        >
                          <Typography variant="caption">
                            Date & times your are booking:
                          </Typography>
                          <Stack
                            borderRadius="10px"
                            padding="10px"
                            bgcolor="#313131"
                            spacing="10px"
                          >
                            <Typography variant="bodyBB">
                              {`${sessionDate.format('MMMM')}` +
                                ' ' +
                                `${sessionDate.format('DD')}` +
                                ', ' +
                                `${sessionDate.format('YYYY')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              Start Time:{' '}
                              {`${sessionStartTime.format('hh:mm A')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              End Time: :{' '}
                              {`${sessionEndTime.format('hh:mm A')}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                </Stack>
              )}
              {online && (
                <Stack spacing="30px">
                  <Stack spacing="10px">
                    <Typography variant="bodyBB">Virtual Location</Typography>
                    <Typography variant="bodyS">
                      Provide a URL where this session will be hosted
                    </Typography>
                    <ZuInput
                      onChange={(e) => setSessionVideoURL(e.target.value)}
                      placeholder="https://"
                    />
                  </Stack>
                  <Stack spacing="20px">
                    <Stack spacing="10px">
                      <Typography variant="bodyBB">Select a Date</Typography>
                      <Typography variant="bodyS">
                        Pick a date for this session
                      </Typography>
                      <DesktopDatePicker
                        onChange={(newValue) => {
                          if (newValue !== null) {
                            handleDateChange(newValue);
                          }
                        }}
                        shouldDisableDate={(date: Dayjs) =>
                          !isDateInRange(
                            date,
                            eventData?.startTime,
                            eventData?.endTime,
                          )
                        }
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                        }}
                        slotProps={{
                          popper: {
                            sx: {
                              ...{
                                '& .MuiPickersDay-root': { color: 'black' },
                                '& .MuiPickersDay-root.Mui-selected': {
                                  backgroundColor: '#D7FFC4',
                                },
                                '& .MuiPickersCalendarHeader-root': {
                                  color: 'black',
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing="20px">
                      <Stack spacing="10px" flex={1}>
                        <Typography variant="bodyBB">Start Time</Typography>
                        <DesktopTimePicker
                          value={sessionStartTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null) {
                              const combined = dayjs
                                .tz(sessionDate, eventData?.timezone)
                                .set('hour', newValue.hour())
                                .set('minute', newValue.minute());
                              setSessionStartTime(combined);
                            }
                          }}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#313131',
                              borderRadius: '10px',
                            },
                          }}
                          slotProps={{
                            field: {
                              readOnly: true,
                            },
                            popper: {
                              sx: {
                                ...{
                                  '& .MuiPickersDay-root': { color: 'black' },
                                  '& .MuiPickersDay-root.Mui-selected': {
                                    backgroundColor: '#D7FFC4',
                                  },
                                  '& .MuiPickersCalendarHeader-root': {
                                    color: 'black',
                                  },
                                  '& .MuiMultiSectionDigitalClock-root': {
                                    color: 'black',
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Stack>
                      <Stack spacing="10px" flex={1}>
                        <Typography variant="bodyBB">End Time</Typography>
                        <DesktopTimePicker
                          value={sessionEndTime}
                          ampm={false}
                          onChange={(newValue) => {
                            if (newValue !== null) {
                              const combined = dayjs
                                .tz(sessionDate, eventData?.timezone)
                                .set('hour', newValue.hour())
                                .set('minute', newValue.minute());
                              setSessionEndTime(combined);
                            }
                          }}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#313131',
                              borderRadius: '10px',
                            },
                          }}
                          slotProps={{
                            field: {
                              readOnly: true,
                            },
                            popper: {
                              sx: {
                                ...{
                                  '& .MuiPickersDay-root': { color: 'black' },
                                  '& .MuiPickersDay-root.Mui-selected': {
                                    backgroundColor: '#D7FFC4',
                                  },
                                  '& .MuiPickersCalendarHeader-root': {
                                    color: 'black',
                                  },
                                  '& .MuiMultiSectionDigitalClock-root': {
                                    color: 'black',
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                  {sessionLocation &&
                    sessionDate &&
                    sessionStartTime !==
                      dayjs().set('hour', 0).set('minute', 0) &&
                    sessionEndTime !==
                      dayjs().set('hour', 0).set('minute', 0) && (
                      <Stack spacing="10px">
                        <Stack alignItems="center">
                          <ArrowDownIcon />
                        </Stack>
                        <Stack
                          spacing="10px"
                          padding="10px"
                          border="1px solid rgba(255, 255, 255, 0.10)"
                          borderRadius="10px"
                        >
                          <Typography variant="caption">
                            Date & times your are booking:
                          </Typography>
                          <Stack
                            borderRadius="10px"
                            padding="10px"
                            bgcolor="#313131"
                            spacing="10px"
                          >
                            <Typography variant="bodyBB">
                              {`${sessionDate.format('MMMM')}` +
                                ' ' +
                                `${sessionDate.format('DD')}` +
                                ', ' +
                                `${sessionDate.format('YYYY')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              Start Time:{' '}
                              {`${sessionStartTime.format('hh:mm A')}`}
                            </Typography>
                            <Typography variant="bodyS">
                              End Time: :{' '}
                              {`${sessionEndTime.format('hh:mm A')}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    )}
                </Stack>
              )}
            </Stack>
            <Stack
              direction={'column'}
              spacing="30px"
              bgcolor="#262626"
              padding="20px"
              borderRadius="10px"
            >
              <Typography variant="subtitleMB">Session Participants</Typography>
              <Stack direction={'row'} spacing="10px">
                <ZuSwitch
                  checked={hiddenOrganizer}
                  onChange={() => setHiddenOrganizer((v) => !v)}
                />
                <Stack spacing="10px">
                  <Typography variant="bodyBB">
                    Hide yourself as an organizer for this session
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    By default the creator of a session is listed as an
                    organizer of it
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Organizers*</Typography>
                  <Typography variant="bodyS">
                    Type or search a person
                  </Typography>
                </Stack>
                <SelectSearchUser
                  users={people}
                  onChange={handleOrganizerChange}
                  initialUsers={sessionOrganizers}
                  fixedUsers={[profile as Profile]}
                  removedInitialUsers={hiddenOrganizer}
                />
              </Stack>
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Speakers</Typography>
                  <Typography variant="bodyS">
                    Type or search a person
                  </Typography>
                </Stack>
                <SelectSearchUser
                  users={people}
                  onChange={handleSpeakerChange}
                  initialUsers={sessionSpeakers}
                />
              </Stack>
            </Stack>
            <Box
              display="flex"
              gap="20px"
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <ZuButton
                sx={{
                  flex: 1,
                  width: isMobile ? '100%' : 'auto',
                }}
                startIcon={<XMarkIcon />}
                onClick={() => toggleDrawer('right', false)}
              >
                Discard
              </ZuButton>
              <ZuButton
                sx={{
                  color: '#67DBFF',
                  backgroundColor: 'rgba(103, 219, 255, 0.10)',
                  flex: 1,
                  width: isMobile ? '100%' : 'auto',
                }}
                startIcon={<PlusCircleIcon color="#67DBFF" />}
                onClick={updateSession}
              >
                Modify Session
              </ZuButton>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  };

  useEffect(() => {
    const detectScrollPosition = () => {
      const position = window.pageYOffset;
      if (position > 50) {
        setPassingTitle(true);
      } else {
        setPassingTitle(false);
      }
    };

    window.addEventListener('scroll', detectScrollPosition);

    return () => {
      window.removeEventListener('scroll', detectScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (session?.id) {
      const checkAuth = async () => {
        try {
          const eventDetails = await getEventDetailInfo();
          const admins =
            eventDetails?.admins?.map((admin) => admin.id.toLowerCase()) || [];
          const superadmins =
            eventDetails?.superAdmin?.map((superAdmin) =>
              superAdmin.id.toLowerCase(),
            ) || [];
          const members =
            eventDetails?.members?.map((member) => member.id.toLowerCase()) ||
            [];
          if (!ceramic.did && localStorage.getItem('ceramic:eth_did')) {
            await authenticate();
          }
          const adminId = ceramic?.did?.parent.toString().toLowerCase() || '';
          if (session.isPublic) {
            setCanViewSessions(true);
            return {};
          }
          if (!adminId) {
            setDialogTitle('You are not logged in');
            setDialogMessage('Please login and refresh the page');
            setShowLoginModal(true);
          } else {
            if (
              superadmins.includes(adminId) ||
              admins.includes(adminId) ||
              members.includes(adminId)
            ) {
              setCanViewSessions(true);
            } else {
              setDialogTitle('You are not a member of this event');
              setDialogMessage(
                'Please contact the event organizers to get more information',
              );
              setShowLoginModal(true);
            }
          }
          return {};
        } catch (err) {
          console.log(err);
        }
      };
      checkAuth();
    }
  }, [session?.id]);

  const isInTime = useMemo(() => {
    return (
      dayjs(session?.startTime)
        .tz(eventData?.timezone)
        .isBefore(dayjs().tz(eventData?.timezone)) &&
      dayjs(session?.endTime)
        .tz(eventData?.timezone)
        .isAfter(dayjs().tz(eventData?.timezone))
    );
  }, [session?.startTime, session?.endTime, eventData?.timezone]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        title={dialogTitle}
        message={dialogMessage}
        showModal={showLoginModal}
        onConfirm={() => {
          setShowLoginModal(false);
          sessionStorage.setItem('tab', 'About');
          router.push(`/events/${eventId}`);
        }}
      />
      <Stack
        color="white"
        position={'sticky'}
        top={'50px'}
        zIndex={10}
        sx={{
          backdropFilter: 'blur(20px)',
        }}
      >
        <Thumbnail
          name={passingTitle ? eventData?.title : 'View Session'}
          imageUrl={eventData?.imageUrl}
          backFun={() => {
            sessionStorage.setItem(
              'tab',
              isPublic ? 'Public Sessions' : 'Sessions',
            );
            router.push(`/events/${eventId}`);
          }}
        />
        {/* <Stack
          direction="row"
          paddingX={2}
          spacing={3}
          bgcolor="rgba(34, 34, 34, 0.8)"
          height="45px"
          alignItems="center"
          borderBottom="1px solid rgba(255, 255, 255, 0.1)"
          sx={{
            backdropFilter: 'blur(20px)'
          }}
        >
          <Stack direction="row" spacing={2} height="100%">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              borderBottom={tabName === 'About' ? '1px solid white' : 'none'}
              sx={{ cursor: 'pointer' }}
            >
              <CalendarIcon />
              <Typography
                onClick={() => {
                  sessionStorage.setItem('tab', 'About');
                  router.push(`/events/${eventId}`);
                }}
                color="white"
                variant="bodyMB"
              >
                About
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              borderBottom={tabName === 'Sessions' ? '1px solid white' : 'none'}
              sx={{ cursor: 'pointer' }}
            >
              {canViewSessions ? <SessionIcon /> : <LockIcon />}
              <Typography
                onClick={() => {
                  if (canViewSessions) {
                    setTabName('Sessions');
                    sessionStorage.setItem('tab', 'Sessions');
                    router.push(`/events/${eventId}`);
                  }
                }}
                color="white"
                variant="bodyMB"
                sx={{ cursor: canViewSessions ? 'pointer' : 'not-allowed' }}
              >
                Sessions
              </Typography>
            </Stack>
          </Stack>
        </Stack> */}
      </Stack>
      {session && (
        <Stack
          sx={{
            color: 'white',
            [theme.breakpoints.down('sm')]: { padding: '20px 10px' },
          }}
          padding="20px"
          bgcolor="#222222"
          height="auto"
        >
          <Stack
            direction={isTablet ? 'column' : 'row'}
            gap="20px"
            justifyContent="center"
          >
            <Stack
              gap="20px"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  gap: '10px',
                },
              }}
            >
              {session.creatorDID === adminId && (
                <Stack
                  padding="10px"
                  bgcolor="#ffc77d1a"
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  border="1px solid rgba(255, 199, 125, .1)"
                  borderRadius={'8px'}
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '10px',
                    },
                  }}
                >
                  <Typography
                    fontSize={'14px'}
                    lineHeight={'160%'}
                    color={'rgba(255, 199, 125, 1)'}
                    fontWeight={600}
                  >
                    You created this session
                  </Typography>
                  <Stack direction="row" spacing="10px">
                    <ZuButton
                      startIcon={<EditIcon size={5} />}
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
                      onClick={() => toggleDrawer('right', true)}
                    >
                      Edit
                    </ZuButton>
                    <ZuButton
                      startIcon={<ArrowUpTrayIcon size={5} />}
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
                      onClick={toggleOpenPublic}
                    >
                      {session.isPublic ? 'Make Private' : 'Open to Public'}
                    </ZuButton>
                  </Stack>
                </Stack>
              )}

              <Stack
                borderRadius="10px"
                border={!isMobile ? '1px solid #383838' : 'none'}
                bgcolor={!isMobile ? '#2d2d2d' : 'transparent'}
                width={isTablet ? '100%' : '600px'}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  width={'100%'}
                  padding={!isMobile ? '10px' : '10px 10px 10px 0'}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '10px',
                    }}
                  >
                    <CopyToClipboard
                      text={currentHref}
                      onCopy={() => {
                        setShowCopyToast(true);
                      }}
                    >
                      <ZuButton
                        sx={{
                          padding: '8px 10px 8px 14px',
                          backgroundColor: '#ffffff0a',
                          '&:hover': { backgroundColor: '#ffffff1a' },
                        }}
                        startIcon={<ShareIcon size={4} />}
                      >
                        Share
                      </ZuButton>
                    </CopyToClipboard>
                  </Box>
                </Stack>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  open={showCopyToast}
                  autoHideDuration={800}
                  onClose={() => {
                    setShowCopyToast(false);
                  }}
                >
                  <Alert severity="success" variant="filled">
                    Copy share link to clipboard
                  </Alert>
                </Snackbar>
                <Stack padding={!isMobile ? '20px' : '0 0 20px'} spacing="20px">
                  <Stack spacing="10px">
                    <Box flex={1}>
                      {isInTime ? (
                        <Typography
                          bgcolor="#7DFFD11A"
                          padding="4px 8px"
                          color="#7DFFD1"
                          variant="bodyX"
                          borderRadius="2px"
                          marginRight="10px"
                        >
                          · LIVE
                        </Typography>
                      ) : null}
                      <Typography
                        bgcolor="rgba(255, 255, 255, 0.06)"
                        padding="4px 8px"
                        variant="caption"
                        textTransform="uppercase"
                        borderRadius="2px"
                      >
                        {session.track}
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing="14px">
                      <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                        {dayjs(session.startTime)
                          .tz(eventData?.timezone)
                          .format('dddd, MMMM D')}
                      </Typography>
                      <Typography variant="bodyS">
                        {dayjs(session.startTime)
                          .tz(eventData?.timezone)
                          .format('h:mm A')}{' '}
                        -{' '}
                        {dayjs(session.endTime)
                          .tz(eventData?.timezone)
                          .format('h:mm A')}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack spacing="10px">
                    <Typography
                      variant="subtitleLB"
                      lineHeight={1.2}
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {session.title}
                    </Typography>
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      spacing={'6px'}
                    >
                      <MapIcon size={4} fill="rgba(255, 255, 255, 0.5)" />
                      {session.format === 'online' ? (
                        <Link
                          href={session.video_url || ''}
                          target="_blank"
                          style={{ textDecoration: 'none' }}
                        >
                          <Typography
                            variant="bodyM"
                            color="white"
                            sx={{ opacity: 0.5 }}
                          >
                            {session.video_url?.slice(0, 10)}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                          {session.location}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                  <Stack spacing="10px">
                    <Stack direction={'row'} spacing={1} alignItems="center">
                      <Typography variant="bodyS" sx={{ opacity: 0.7 }}>
                        Speakers:
                      </Typography>
                      {JSON.parse(session.speakers).map(
                        (speaker: any, index: number) => (
                          <Stack
                            key={`Speaker-${index}`}
                            direction={'row'}
                            spacing="4px"
                            alignItems={'center'}
                          >
                            <Box
                              component={'img'}
                              height={24}
                              width={24}
                              borderRadius={12}
                              src={
                                people.find(
                                  (item: any) =>
                                    item.author?.id === speaker.author.id,
                                )?.avatar || '/user/avatar_p.png'
                              }
                            />
                            <Typography variant="bodyB">
                              {formatUserName(speaker.username)}
                            </Typography>
                          </Stack>
                        ),
                      )}
                    </Stack>
                  </Stack>
                  {session.liveStreamLink && (
                    <Stack spacing="10px">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="bodyS" sx={{ opacity: 0.7 }}>
                          LiveStream Link:
                        </Typography>
                        <Typography
                          variant="bodyB"
                          component="a"
                          href={session.liveStreamLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: 'underline', color: '#fff' }}
                        >
                          {session.liveStreamLink.slice(0, 20) + '...'}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                  {session.recording_link && (
                    <Stack spacing="10px">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="bodyS" sx={{ opacity: 0.7 }}>
                          Recording Link:
                        </Typography>
                        <Typography
                          variant="bodyB"
                          component="a"
                          href={session.recording_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: 'underline', color: '#fff' }}
                        >
                          {session.recording_link.slice(0, 20) + '...'}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="end" spacing="5px">
                    <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                      By:
                    </Typography>
                    <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                      {formatUserName(
                        JSON.parse(session.organizers)[0].username,
                      )}
                    </Typography>
                  </Stack>
                  {ceramic.did?.parent && (
                    <Stack spacing="10px">
                      <Stack
                        direction="row"
                        padding="10px 14px"
                        alignItems="center"
                        spacing="10px"
                        border={
                          isRsvped
                            ? '1px solid rgba(125, 255, 209, 0.1)'
                            : '1px solid rgba(255, 255, 255, 0.10)'
                        }
                        borderRadius="10px"
                        bgcolor={
                          isRsvped ? 'rgba(125, 255, 209, 0.1)' : '#383838'
                        }
                        justifyContent="center"
                        color={isRsvped ? 'rgb(125, 255, 209)' : ''}
                        sx={{
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={() => {
                          if (isRsvped) {
                            handleCancelRSVP(session.id);
                          } else {
                            handleRSVPClick(session.id);
                          }
                        }}
                      >
                        {!isLoading ? (
                          isRsvped ? (
                            hover ? (
                              <CancelIcon />
                            ) : (
                              <SessionIcon fill={'rgb(125, 255, 209)'} />
                            )
                          ) : (
                            <SessionIcon />
                          )
                        ) : (
                          <></>
                        )}
                        {!isLoading ? (
                          isRsvped ? (
                            <Typography variant="bodyBB">
                              {hover ? 'Cancel RSVP?' : "RSVP'd"}
                            </Typography>
                          ) : (
                            <Typography variant="bodyBB">
                              RSVP Session
                            </Typography>
                          )
                        ) : (
                          <></>
                        )}
                        {isLoading && (
                          <CircularProgress
                            size={'20px'}
                            sx={{
                              color: isRsvped ? 'rgb(125, 255, 209)' : 'white',
                            }}
                          />
                        )}
                      </Stack>
                      {/*<Typography variant="bodyS">Attending: 000</Typography>*/}
                    </Stack>
                  )}
                </Stack>
                {session.video_url && (
                  <Stack spacing="14px" padding="20px">
                    <Typography variant="subtitleSB" sx={{ opacity: 0.6 }}>
                      Video Stream
                    </Typography>
                    <Stack
                      height="421px"
                      borderRadius="10px"
                      bgcolor="black"
                    ></Stack>
                  </Stack>
                )}
                <Stack spacing="20px" padding={!isMobile ? '20px' : '0 0 20px'}>
                  <Typography variant="subtitleSB">Description</Typography>
                  <EditorPreview
                    value={session.description}
                    collapsed={isCollapsed}
                    onCollapse={(collapsed) => {
                      setIsCanCollapse((v) => {
                        return v || collapsed;
                      });
                      setIsCollapsed(collapsed);
                    }}
                  />
                  {isCanCollapse && (
                    <ZuButton
                      startIcon={
                        isCollapsed ? (
                          <ChevronDownIcon size={4} />
                        ) : (
                          <ChevronUpIcon size={4} />
                        )
                      }
                      sx={{ backgroundColor: '#313131', width: '100%' }}
                      onClick={() => setIsCollapsed((prev) => !prev)}
                    >
                      {isCollapsed ? 'Show More' : 'Show Less'}
                    </ZuButton>
                  )}
                </Stack>
                <Stack padding={!isMobile ? '20px' : '0 0 20px'} spacing="20px">
                  <Stack spacing="10px">
                    <Stack direction="row" spacing="10px">
                      <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                        Last Edited By:
                      </Typography>
                      <Typography variant="bodyS">
                        {formatUserName(
                          JSON.parse(session.organizers)[0].username,
                        )}
                      </Typography>
                      <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                        {formatDateAgo(session.createdAt)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing="10px">
                      <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                        Edited By:
                      </Typography>
                      <Typography variant="bodyS">
                        {formatUserName(
                          JSON.parse(session.organizers)[0].username,
                        )}
                      </Typography>
                      <Typography variant="bodyS" sx={{ opacity: 0.5 }}>
                        {formatDateAgo(session.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="bodySB" sx={{ opacity: 0.5 }}>
                    View All Edit Logs
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing="20px" width={isTablet ? '100%' : '320px'}>
              <Stack
                padding="14px 14px 14px 0"
                borderBottom="1px solid #383838"
              >
                <Typography variant="subtitleMB">Session Details</Typography>
              </Stack>
              <Stack spacing="10px">
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                    Format:
                  </Typography>
                  <Typography variant="bodyM" textTransform="uppercase">
                    {session.format}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                    Type:
                  </Typography>
                  <Typography variant="bodyM">{session.type}</Typography>
                </Stack>
                <Stack direction="row" spacing="10px" alignItems="center">
                  <Typography variant="bodyM" sx={{ opacity: 0.5 }}>
                    Experience Level:
                  </Typography>
                  <Typography variant="bodyM">
                    {session.experience_level}
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                divider={<Divider sx={{ border: '1px solid #383838' }} />}
                spacing="20px"
              >
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px" alignItems="center">
                    {/*<Cog6Icon size={5} />*/}
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Session Organizers
                    </Typography>
                  </Stack>
                  <Stack
                    flexWrap="wrap"
                    gap="10px"
                    direction="row"
                    alignItems="center"
                  >
                    {JSON.parse(session.organizers).map(
                      (organizer: any, index: number) => (
                        <Stack
                          key={`Speaker-${index}`}
                          direction={'row'}
                          spacing={0.5}
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
                                  item.author?.id === organizer.author.id,
                              )?.avatar || '/user/avatar_p.png'
                            }
                          />
                          <Typography variant="bodyS">
                            {formatUserName(organizer.username)}
                          </Typography>
                        </Stack>
                      ),
                    )}
                  </Stack>
                </Stack>
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px">
                    <MicrophoneIcon size={5} />
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Speakers
                    </Typography>
                  </Stack>
                  <Stack flexWrap="wrap" gap="10px" direction="row">
                    {JSON.parse(session.speakers).map(
                      (speaker: any, index: number) => (
                        <Stack
                          key={`Speaker-${index}`}
                          direction={'row'}
                          spacing={0.5}
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
                          <Typography variant="bodyS">
                            {formatUserName(speaker.username)}
                          </Typography>
                        </Stack>
                      ),
                    )}
                  </Stack>
                </Stack>
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px">
                    <TagIcon size={5} />
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Tags
                    </Typography>
                  </Stack>
                  <Stack flexWrap="wrap" gap="10px" direction="row">
                    {session.tags?.split(',').map((tag: any, index: number) => (
                      <Stack
                        key={`Speaker-${index}`}
                        padding="4px 8px"
                        alignItems={'center'}
                        bgcolor="#2d2d2d"
                        borderRadius="10px"
                      >
                        <Typography variant="bodyS" textTransform="uppercase">
                          {tag}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                <Stack spacing="20px">
                  <Stack direction="row" spacing="10px">
                    <MapIcon size={5} />
                    <Typography variant="bodyM" sx={{ opacity: 0.7 }}>
                      Location
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing="20px">
                    <Box
                      component="img"
                      borderRadius="10px"
                      width="80px"
                      height="80px"
                      src={locationAvatar || eventData?.imageUrl}
                    />
                    <Stack alignItems="center">
                      <Typography variant="bodyM">
                        {session.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                {showDeleteButton && (
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    spacing={2}
                    sx={{ marginTop: 2 }}
                  >
                    <ZuButton
                      variant="contained"
                      color="error"
                      onClick={() => toggleDrawer('right', true)}
                    >
                      Edit
                    </ZuButton>
                    <ZuButton
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(session.id)}
                    >
                      Delete
                    </ZuButton>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
      {!isMobile ? (
        <SwipeableDrawer
          hideBackdrop={true}
          sx={{
            position: 'relative',
            zIndex: 1001,
            '& .MuiDrawer-paper': {
              height: '100vh',
              boxShadow: 'none',
              backgroundColor: 'transparent',
              paddingLeft: '80px', // WARNING:!! Leave space for editorjs to operate, DONT DELETE
            },
          }}
          anchor="right"
          open={state['right']}
          onClose={() => toggleDrawer('right', false)}
          onOpen={() => toggleDrawer('right', true)}
        >
          {List('right')}
        </SwipeableDrawer>
      ) : state.right ? (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 100,
          }}
        >
          {List('right')}
        </Box>
      ) : null}
    </LocalizationProvider>
  );
};

export default Home;
