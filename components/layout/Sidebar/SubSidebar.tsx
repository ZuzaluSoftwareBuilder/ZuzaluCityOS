'use client';
import React, { useState } from 'react';
import {
  CalendarIcon,
  ChevronDownIcon,
  SettingIcon,
  TableIcon,
  EventIcon,
  AnnouncementsIcon,
} from 'components/icons';
import SidebarButton from './SidebarButton';
import {
  Box,
  Popover,
  Skeleton,
  Stack,
  StackProps,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation';

import styles from './SubSidebar.module.css';

interface SubSidebarProps {
  spaceId: string;
  title?: string;
  avatar?: string;
  banner?: string;
  isAdmin: boolean;
}

const MenuItem: React.FC<
  React.PropsWithChildren<StackProps & { text: string }>
> = (props) => {
  const { children, text, ...rest } = props;
  return (
    <Stack
      className={styles.menu}
      direction="row"
      justifyContent="space-between"
      padding="6px 10px"
      alignItems="center"
      borderRadius="8px"
      {...rest}
    >
      <Typography className={styles.text} fontSize={'13px'}>
        {text}
      </Typography>
      <span className={styles.icon}>{children}</span>
    </Stack>
  );
};

const SubSidebar: React.FC<SubSidebarProps> = ({
  spaceId,
  title,
  avatar,
  banner,
  isAdmin,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Stack
      sx={{
        minWidth: '280px',
        width: '280px',
        backgroundColor: '#222',
        borderRight: '1px solid #ffffff1a',
        display: 'none',
        [theme.breakpoints.up('lg')]: {
          display: 'block',
        },
        boxSizing: 'border-box',
        fontFamily: 'Inter',
        overflowY: 'auto',
      }}
    >
      <Stack
        sx={{
          width: '100%',
          padding: '10px',
          borderBottom: '1px solid #ffffff1a',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxSizing: 'border-box',
        }}
      >
        <Stack spacing="10px" onMouseLeave={handleClose}>
          <div
            style={{
              backgroundImage: `url(${banner})`,
            }}
            className={styles.spaceButton}
          >
            <Stack
              borderRadius="10px"
              padding="10px 14px"
              direction="row"
              spacing="10px"
              alignItems="center"
              sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(34,34,34,0.1)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={handleClick}
            >
              <Box
                component="img"
                width={35}
                height={35}
                borderRadius={'100%'}
                src={avatar || '/1.webp'}
              />
              <Typography
                flex={1}
                variant="subtitleS"
                color="white"
                fontSize={'18px'}
                lineHeight={'22px'}
                sx={{ textWrap: 'wrap' }}
              >
                {title ? (
                  title
                ) : (
                  <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                )}
              </Typography>
              <ChevronDownIcon size={5} />
            </Stack>
          </div>
          <Popover
            sx={{ width: '100%', marginTop: '14px' }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: 'transparent',
              },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Stack
              padding={'10px'}
              spacing="10px"
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRadius="10px"
              bgcolor="black"
              color="white"
              sx={{
                minWidth: '240px',
                width: '240px',
              }}
            >
              {/* <MenuItem
                text={'Invite People'}
                onClick={() => router.push(`/spaces/${spaceId}/edit/invite`)}
              >
                <UserPlusIcon size={5} />
              </MenuItem>*/}
              {isAdmin && (
                <MenuItem
                  onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                  text={'Space Settings'}
                >
                  <SettingIcon size={5} />
                </MenuItem>
              )}
              {/*<MenuItem
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                text={'Privacy Settings'}
              >
                <ShieldIcon size={5} />
              </MenuItem>
              <MenuItem
                onClick={() => router.push(`/spaces/${spaceId}/edit`)}
                text={'Notification Settings'}
              >
                <NotificationIcon size={5} />
              </MenuItem>*/}
            </Stack>
          </Popover>
        </Stack>
      </Stack>
      <Stack
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '20px 10px',
            boxSizing: 'border-box',
          }}
        >
          <SidebarButton
            icon={<EventIcon />}
            onClick={() => router.push(`/spaces/${spaceId}`)}
            content="Home"
            isActive={pathname === `/spaces/${spaceId}`}
          />
          <SidebarButton
            icon={<CalendarIcon />}
            onClick={() => router.push(`/spaces/${spaceId}/events`)}
            content="Events"
            isActive={pathname === `/spaces/${spaceId}/events`}
          />
          <SidebarButton
            icon={<AnnouncementsIcon />}
            content="Calendar"
            isActive={pathname === `/spaces/${spaceId}/calendar`}
            onClick={() => router.push(`/spaces/${spaceId}/calendar`)}
          />
          {isAdmin && (
            <SidebarButton
              icon={<TableIcon />}
              content="Manage Events"
              isActive={pathname === `/spaces/${spaceId}/adminevents`}
              onClick={() => router.push(`/spaces/${spaceId}/adminevents`)}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SubSidebar;
