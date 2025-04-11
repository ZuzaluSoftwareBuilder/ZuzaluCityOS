'use client';
import { ZuButton } from '@/components/core';
import { useDialog } from '@/components/dialog/DialogContext';
import FormHeader from '@/components/form/FormHeader';
import {
  Cog6Icon,
  LinkIcon,
  MapIcon,
  PencilIcon,
  ShareIcon,
  TicketIcon,
  TrashIcon,
} from '@/components/icons';
import { useToast } from '@/components/toast/ToastContext';
import { useCeramicContext } from '@/context/CeramicContext';
import { CalEvent } from '@/types';
import { supabase } from '@/utils/supabase/client';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Menu,
  Stack,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditorPreview = dynamic(
  () => import('@/components/editor/EditorPreview'),
  {
    ssr: false,
  },
);

interface ViewEventProps {
  event: CalEvent;
  isAdmin: boolean;
  handleClose: () => void;
  handleEdit: (type: string) => void;
  refetch: () => void;
}

export default function ViewEvent({
  event,
  isAdmin,
  handleClose,
  handleEdit,
  refetch,
}: ViewEventProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { showToast } = useToast();
  const { ceramic } = useCeramicContext();
  const userDID = ceramic.did?.parent.toString().toLowerCase() || '';

  const { data: rsvpData, refetch: refetchRSVP } = useQuery({
    queryKey: ['getRSVPData', event.id],
    queryFn: () => {
      return supabase
        .from('rsvp_sideEvents')
        .select('*')
        .eq('sideEventID', event.uuid);
    },
    select: (data: any) => data.data ?? [],
    enabled: !!event.uuid,
  });

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      return supabase.from('rsvp_sideEvents').insert({
        sideEventID: event.uuid,
        userDID,
      });
    },
    onSuccess: () => {
      refetchRSVP();
    },
  });

  const { showDialog } = useDialog();

  const dateContent = useMemo(() => {
    const { start_date, end_date, timezone } = event;
    const start = dayjs(start_date).tz(timezone);
    const end = dayjs(end_date).tz(timezone);
    if (start.isSame(end, 'day')) {
      return (
        <Stack direction="row" gap="10px" alignItems="center">
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.5 }}
          >
            {start.format('dddd, MMMM D')}
          </Typography>
          <Typography
            fontSize={14}
            lineHeight={1.6}
          >{`${start.format('h:mm A')} - ${end.format('h:mm A')}`}</Typography>
          <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.9 }}>
            {timezone ? dayjs().tz(timezone).format('z') : ''}
          </Typography>
        </Stack>
      );
    }
    return (
      <Stack direction="row" gap="10px" alignItems="center">
        <Typography
          fontSize={14}
          fontWeight={600}
          lineHeight={1.6}
          sx={{ opacity: 0.5 }}
        >
          {start.format('dddd, MMMM D')}
        </Typography>
        <Typography
          fontSize={14}
          lineHeight={1.6}
        >{`${start.format('h:mm A')}`}</Typography>
        <Typography
          fontSize={14}
          fontWeight={600}
          lineHeight={1.6}
          sx={{ opacity: 0.5 }}
        >
          ~
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={600}
          lineHeight={1.6}
          sx={{ opacity: 0.5 }}
        >
          {end.format('dddd, MMMM D')}
        </Typography>
        <Typography
          fontSize={14}
          lineHeight={1.6}
        >{`${end.format('h:mm A')}`}</Typography>
        <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.9 }}>
          {timezone ? dayjs().tz(timezone).format('z') : ''}
        </Typography>
      </Stack>
    );
  }, [event]);

  const creator = JSON.parse(event.creator);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleManageClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleMenuClick = useCallback(
    (type: 'edit' | 'delete') => {
      setAnchorEl(null);
      if (type === 'edit') {
        handleEdit('edit');
      } else if (type === 'delete') {
        showDialog({
          title: 'Delete Event',
          message: 'Are you sure you want to delete this event?',
          confirmText: 'Delete',
          onConfirm: async () => {
            await supabase.from('sideEvents').delete().eq('id', event.id);
            handleClose();
            refetch();
          },
        });
      }
    },
    [event.id, handleClose, handleEdit, refetch, showDialog],
  );

  const handleRSVP = useCallback(() => {
    rsvpMutation.mutate();
  }, [rsvpMutation]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1200 }}>
          <FormHeader title="View Event" handleClose={handleClose} />
        </Box>

        <Stack
          sx={{
            flex: 1,
            overflowY: 'scroll',
            padding: '20px',
            gap: '20px',
            paddingBottom: '125px',
          }}
        >
          {isAdmin && (
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
                startIcon={<Cog6Icon size={5} color="currentColor" />}
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
                onClick={handleManageClick}
              >
                Manage
              </ZuButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    style: {
                      backgroundColor: 'rgba(34, 34, 34, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      zIndex: 9999,
                      padding: '2px 10px',
                      width: '200px',
                      marginTop: '8px',
                      backdropFilter: 'blur(10px)',
                    },
                  },
                }}
              >
                <Stack flexDirection="column" sx={{ gap: '10px' }}>
                  {!event.recurring &&
                    [
                      {
                        title: 'Edit Event',
                      },
                    ].map((item) => (
                      <Stack
                        key={item.title}
                        direction="row"
                        gap="10px"
                        alignItems="center"
                        p="6px"
                        borderRadius="8px"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                        }}
                        onClick={() => handleMenuClick('edit')}
                      >
                        <PencilIcon size={4} />
                        <Typography fontSize={13} lineHeight={1.4}>
                          {item.title}
                        </Typography>
                      </Stack>
                    ))}
                  {!event.recurring && <Divider />}
                  {[
                    {
                      title: 'Delete Event',
                    },
                  ].map((item) => (
                    <Stack
                      key={item.title}
                      direction="row"
                      gap="10px"
                      alignItems="center"
                      p="6px"
                      borderRadius="8px"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                      onClick={() => handleMenuClick('delete')}
                    >
                      <TrashIcon size={4} color="#FF5E5E" />
                      <Typography
                        fontSize={13}
                        lineHeight={1.4}
                        color="#FF5E5E"
                      >
                        {item.title}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Menu>
            </Stack>
          )}
          {event.image_url && (
            <Image
              src={event.image_url}
              alt="event"
              width={1200}
              height={338}
              style={{
                width: '100%',
                height: 338,
                objectFit: 'contain',
              }}
            />
          )}
          {dateContent}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize={20} fontWeight={700} lineHeight={1.2}>
              {event.name}
            </Typography>
            <CopyToClipboard
              text={window.location.href}
              onCopy={() => {
                showToast({ message: 'Copy share link to clipboard!' });
              }}
            >
              <IconButton>
                <ShareIcon />
              </IconButton>
            </CopyToClipboard>
          </Stack>
          <Stack
            p="10px"
            bgcolor="rgba(255, 255, 255, 0.05)"
            borderRadius="10px"
            gap="10px"
          >
            {event.location_name && (
              <Stack direction="row" gap="6px" alignItems="center">
                <MapIcon size={4.5} style={{ opacity: 0.5 }} />
                <Typography
                  fontSize={13}
                  lineHeight={1.4}
                  sx={{ opacity: 0.8 }}
                >
                  {event.location_name}
                </Typography>
              </Stack>
            )}
            {event.location_url && (
              <Stack direction="row" gap="6px" alignItems="center">
                <LinkIcon size={4.5} style={{ opacity: 0.5 }} />
                <Link
                  href={event.location_url}
                  target="_blank"
                  fontSize={13}
                  lineHeight={1.4}
                  sx={{ opacity: 0.8 }}
                >
                  {event.location_url}
                </Link>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" gap="10px" alignItems="center">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              By:
            </Typography>
            <Stack direction="row" gap="5px" alignItems="center">
              {creator.avatar && (
                <Image
                  src={creator.avatar}
                  alt={creator.username}
                  width={20}
                  height={20}
                  style={{ borderRadius: '50%' }}
                />
              )}
              <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
                {creator.username}
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          {event.description ? (
            <EditorPreview collapsable={false} value={event.description} />
          ) : (
            <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.8 }}>
              No Description Provided
            </Typography>
          )}
        </Stack>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
          }}
        >
          <Stack
            p="20px"
            bgcolor="#222"
            borderTop="1px solid rgba(255, 255, 255, 0.1)"
            gap="10px"
          >
            <Stack
              direction="row"
              gap="4px"
              alignItems="center"
              justifyContent="center"
            >
              <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
                Attending:
              </Typography>
              <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
                {rsvpData?.length || 0}
              </Typography>
            </Stack>
            <ZuButton
              sx={{
                color: '#fff',
                backgroundColor: '#383838',
                width: '100%',
                height: '40px',
              }}
              startIcon={
                !rsvpMutation.isPending ? <TicketIcon size={5} /> : null
              }
              disabled={
                rsvpMutation.isPending || rsvpData
                  ? rsvpData.some((rsvp: any) => rsvp.userDID === userDID)
                  : true
              }
              onClick={handleRSVP}
            >
              {rsvpMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'RSVP'
              )}
            </ZuButton>
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
