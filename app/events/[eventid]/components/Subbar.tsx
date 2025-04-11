'use client';
import { Stack, Typography } from '@mui/material';
import {
  AnnouncementsIcon,
  CalendarIcon,
  ChatBubbleIcon,
  LockIcon,
  SessionIcon,
} from 'components/icons';
import * as React from 'react';

interface SubbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
  canViewSessions: boolean;
  canViewDiscussions: boolean;
}

const Subbar: React.FC<SubbarProps> = ({
  tabName,
  setTabName,
  canViewSessions,
  canViewDiscussions,
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleTabClick = (
    newTabName: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (newTabName === 'Sessions' && !canViewSessions) {
      return;
    }

    setTabName(newTabName);

    const clickedElement = event.currentTarget;
    const container = scrollContainerRef.current;

    if (container) {
      const containerWidth = container.offsetWidth;
      const elementOffset = clickedElement.offsetLeft;
      const elementWidth = clickedElement.offsetWidth;

      const scrollPosition =
        elementOffset - containerWidth / 2 + elementWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Stack
      ref={scrollContainerRef}
      direction="row"
      paddingX={2}
      spacing={3}
      bgcolor="#222"
      height="45px"
      alignItems="center"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      position={'sticky'}
      top={'50px'}
      zIndex={3}
      width="100vw"
      maxWidth="100vw"
      sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
    >
      <Stack direction="row" height="100%">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={tabName === 'About' ? '1px solid white' : 'none'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={(e) => handleTabClick('About', e)}
        >
          <CalendarIcon />
          <Typography color="white" variant="bodyMB">
            About
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={tabName === 'Sessions' ? '1px solid white' : 'none'}
          sx={{
            cursor: canViewSessions ? 'pointer' : 'not-allowed',
            padding: '0 14px',
          }}
          onClick={(e) => handleTabClick('Sessions', e)}
        >
          {canViewSessions ? <SessionIcon /> : <LockIcon />}
          <Typography
            color="white"
            variant="bodyMB"
            sx={{ cursor: canViewSessions ? 'pointer' : 'not-allowed' }}
          >
            Sessions
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={
            tabName === 'Public Sessions' ? '1px solid white' : 'none'
          }
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={(e) => handleTabClick('Public Sessions', e)}
        >
          <SessionIcon />
          <Typography
            color="white"
            variant="bodyMB"
            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Public Sessions
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={
            tabName === 'Announcements' ? '1px solid white' : 'none'
          }
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={(e) => handleTabClick('Announcements', e)}
        >
          <AnnouncementsIcon />
          <Typography color="white" variant="bodyMB">
            Announcements
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          borderBottom={tabName === 'Discussions' ? '1px solid white' : 'none'}
          sx={{ cursor: 'pointer' }}
        >
          {canViewDiscussions ? <ChatBubbleIcon /> : <LockIcon />}
          <Typography
            onClick={() => canViewDiscussions && setTabName('Discussions')}
            color="white"
            variant="bodyMB"
            sx={{ cursor: canViewDiscussions ? 'pointer' : 'not-allowed' }}
          >
            Discussions
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Subbar;
