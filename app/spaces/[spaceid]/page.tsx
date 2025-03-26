'use client';
import { useParams } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Snackbar,
  Typography,
  Alert,
  Skeleton,
  Stack,
} from '@mui/material';
import { EventCard } from '@/components/cards';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ChevronDownIcon, ShareIcon } from '@/components/icons';
import SidebarButton from '@/components/layout/Sidebar/SidebarButton';
import Image from 'next/image';
import React, { Fragment, useMemo, useState } from 'react';
import { Space, Event } from '@/types';
import {
  EventCardMonthGroup,
  EventCardSkeleton,
  filterUpcomingEvents,
  groupEventsByMonth,
} from '@/components/cards/EventCard';
import { ChevronUpIcon } from '@/components/icons/ChevronUp';
import dynamic from 'next/dynamic';
import useGetShareLink from '@/hooks/useGetShareLink';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';

const EditorPreview = dynamic(
  () => import('@/components/editor/EditorPreview'),
  {
    ssr: false,
  },
);

export default function SpaceDetailPage() {
  const params = useParams();
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const spaceId = params?.spaceid.toString() ?? '';

  const { data: spaceData, isLoading } = useGraphQL(
    ['getSpaceAndEvents', spaceId],
    GET_SPACE_AND_EVENTS_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => {
        return data?.data?.node as Space;
      },
    },
  );

  const eventsData = useMemo(() => {
    return spaceData?.events?.edges.map((edge) => edge.node) as Event[];
  }, [spaceData]);

  const { shareUrl } = useGetShareLink({ id: spaceId, name: spaceData?.name });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          width: 'calc(100% - 280px)',
          maxHeight: 'calc(100vh - 50px)',
          overflowY: 'auto',
          [theme.breakpoints.down('lg')]: {
            width: '100%',
          },
          fontFamily: 'Inter',
          backgroundColor: '#222222',
        }}
        flex={'1'}
      >
        <Box
          sx={{
            padding: '20px',
            width: '100%',
            backgroundColor: '#2b2b2b',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderBottom: '1px solid #ffffff1a',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '240px',
            }}
          >
            {spaceData ? (
              <Image
                src={
                  spaceData.banner ||
                  'https://framerusercontent.com/images/MapDq7Vvn8BNPMgVHZVBMSpwI.png'
                }
                alt={spaceData.name || ''}
                width={1280}
                height={240}
                style={{
                  position: 'absolute',
                  inset: 0,
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                }}
                className="absolute inset-0 object-cover w-full h-full rounded-[10px]"
              />
            ) : (
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={'100%'}
                sx={{ borderRadius: '10px' }}
              />
            )}
            <Box
              sx={{
                width: '90px',
                height: '90px',
                backgroundColor: '#2b2b2b',
                position: 'absolute',
                bottom: '-30px',
                borderRadius: '100%',
                left: '20px',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {spaceData ? (
                <Image
                  loader={() =>
                    spaceData?.avatar ||
                    'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
                  }
                  src={
                    spaceData?.avatar ||
                    'https://framerusercontent.com/images/UkqE1HWpcAnCDpQzQYeFjpCWhRM.png'
                  }
                  style={{ borderRadius: '100%' }}
                  width={80}
                  height={80}
                  alt={spaceData.name}
                />
              ) : (
                <Skeleton variant="circular" width={80} height={80} />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
              }}
            >
              <CopyToClipboard
                text={shareUrl || ''}
                onCopy={() => {
                  setShowCopyToast(true);
                }}
              >
                <SidebarButton
                  sx={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff0a',
                    '&:hover': { backgroundColor: '#ffffff1a' },
                    cursor: 'pointer',
                  }}
                  icon={<ShareIcon />}
                >
                  <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
                </SidebarButton>
              </CopyToClipboard>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Typography fontWeight={700} fontSize={'25px'} lineHeight={'120%'}>
              {spaceData ? spaceData.name : <Skeleton width={200} />}
            </Typography>
            <Typography color={'#bebebe'}>
              {spaceData ? spaceData.tagline : <Skeleton />}
            </Typography>
            <Box
              sx={{
                color: '#7b7b7b',
                fontSize: '10px',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                textTransform: 'uppercase',
              }}
            >
              <p>{spaceData?.tags?.map((tag) => tag.tag).join(', ')}</p>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: '100%', backgroundColor: '#222222' }}>
          <Box
            sx={{
              padding: '20px',
              gap: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            {spaceData ? (
              <>
                <Box
                  sx={{ fontSize: '18px', fontWeight: '700', color: '#919191' }}
                >
                  About {spaceData.name}
                </Box>
                <Box
                  sx={{
                    padding: '20px',
                    width: '100%',
                    backgroundColor: '#ffffff05',
                    borderRadius: '10px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  <EditorPreview
                    value={spaceData.description}
                    collapsed={isCollapsed}
                    onCollapse={(collapsed) => {
                      setIsCanCollapse((v) => {
                        return v || collapsed;
                      });
                      setIsCollapsed(collapsed);
                    }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography variant={'h6'}>
                  <Skeleton width={200} />
                </Typography>
                <Skeleton variant="rounded" width={'100%'} height={80} />
              </>
            )}

            {isCanCollapse && (
              <SidebarButton
                sx={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#2b2b2b',
                  '&:hover': {
                    backgroundColor: '#ffffff1a',
                  },
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
                onClick={() => {
                  setIsCollapsed((v) => !v);
                }}
              >
                <Stack direction="row" spacing={'10px'} alignItems={'center'}>
                  {isCollapsed ? (
                    <ChevronDownIcon size={4} />
                  ) : (
                    <ChevronUpIcon size={4} />
                  )}
                  <span>{isCollapsed ? 'Show More' : 'Show Less'}</span>
                </Stack>
              </SidebarButton>
            )}
          </Box>
          {isLoading ? (
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <EventCardMonthGroup>
                <Skeleton width={60}></Skeleton>
              </EventCardMonthGroup>
              <EventCardSkeleton />
              <EventCardSkeleton />
            </Box>
          ) : eventsData.length > 0 ? (
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Box
                  sx={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#919191',
                  }}
                >
                  Upcoming Events ({filterUpcomingEvents(eventsData).length})
                </Box>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {Object.entries(
                  groupEventsByMonth(filterUpcomingEvents(eventsData)),
                ).map(([key, value], index) => {
                  return (
                    <Fragment key={key + index}>
                      <EventCardMonthGroup>{key}</EventCardMonthGroup>
                      {value.map((event) => {
                        return <EventCard key={event.id} event={event} />;
                      })}
                    </Fragment>
                  );
                })}
              </Box>
              <Box
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              ></Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
