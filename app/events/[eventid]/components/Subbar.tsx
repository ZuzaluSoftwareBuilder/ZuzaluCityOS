'use client';
import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import {
  SessionIcon,
  LockIcon,
  AnnouncementsIcon,
  InformationIcon,
} from 'components/icons';

interface SubbarProps {
  tabName: string;
  setTabName: (value: string | ((prevVar: string) => string)) => void;
  canViewSessions: boolean;
}

interface TabItem {
  name: string;
  icon: React.ElementType;
  label: string;
  requiresPermission?: boolean;
  noWrap?: boolean;
}

const tabItems: TabItem[] = [
  {
    name: 'About',
    icon: InformationIcon,
    label: 'Overview',
  },
  {
    name: 'Sessions',
    icon: SessionIcon,
    label: 'Sessions',
    requiresPermission: true,
  },
  {
    name: 'Public Sessions',
    icon: SessionIcon,
    label: 'Public Sessions',
    noWrap: true,
  },
  {
    name: 'Announcements',
    icon: AnnouncementsIcon,
    label: 'Announcements',
  },
];

const Subbar: React.FC<SubbarProps> = ({
  tabName,
  setTabName,
  canViewSessions,
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
        {tabItems.map((item) => (
          <Stack
            key={item.name}
            direction="row"
            alignItems="center"
            position="relative"
            sx={{
              cursor:
                item.requiresPermission && !canViewSessions
                  ? 'not-allowed'
                  : 'pointer',
              padding: '0 14px',
              height: '100%',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '1px',
                backgroundColor: 'white',
                opacity: tabName === item.name ? 1 : 0,
                transition: 'opacity 0.2s ease',
              },
              '&:hover': {
                '& > div': {
                  opacity:
                    item.requiresPermission && !canViewSessions ? 0.6 : 1,
                },
              },
            }}
            onClick={(e) => handleTabClick(item.name, e)}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                opacity: tabName === item.name ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
              }}
            >
              {item.requiresPermission && !canViewSessions ? (
                <LockIcon />
              ) : (
                <item.icon />
              )}
              <Typography
                color="white"
                variant="bodyMB"
                sx={{
                  cursor:
                    item.requiresPermission && !canViewSessions
                      ? 'not-allowed'
                      : 'pointer',
                  whiteSpace: item.noWrap ? 'nowrap' : 'normal',
                }}
              >
                {item.label}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Subbar;
