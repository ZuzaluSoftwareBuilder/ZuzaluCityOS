'use client';
import { Stack } from '@mui/material';
import {
  CalendarIcon,
  HomeIcon,
  SpaceIcon,
  SpacePlusIcon,
} from 'components/icons';
import { useRouter } from 'next/navigation';

const IconSidebar = () => {
  const router = useRouter();
  return (
    <Stack
      bgcolor="#2D2D2D"
      direction="column"
      spacing={3}
      width="65px"
      height="auto"
      paddingTop={3}
    >
      <Stack direction="column" spacing={3} alignItems="center">
        <Stack sx={{ cursor: 'pointer' }} onClick={() => router.replace('/')}>
          <HomeIcon />
        </Stack>
        {/*<Stack>*/}
        {/*  <StreamIcon />*/}
        {/*</Stack>*/}
        <Stack
          sx={{ cursor: 'pointer' }}
          onClick={() => router.replace('/spaces')}
        >
          <SpaceIcon />
        </Stack>
        <Stack
          sx={{ cursor: 'pointer' }}
          onClick={() => router.replace('/events')}
        >
          <CalendarIcon />
        </Stack>
        {/*<Stack>*/}
        {/*  <BoltIcon />*/}
        {/*</Stack>*/}
      </Stack>
      <Stack direction="column" spacing={3} alignItems="center">
        {/*<Box*/}
        {/*  component="img"*/}
        {/*  src="/1.webp"*/}
        {/*  height="40px"*/}
        {/*  width="40px"*/}
        {/*  borderRadius="20px"*/}
        {/*/>*/}
        {/*<Box*/}
        {/*  component="img"*/}
        {/*  src="/3.webp"*/}
        {/*  height="40px"*/}
        {/*  width="40px"*/}
        {/*  borderRadius="20px"*/}
        {/*/>*/}
        {/*<Box*/}
        {/*  component="img"*/}
        {/*  src="/2.webp"*/}
        {/*  height="40px"*/}
        {/*  width="40px"*/}
        {/*  borderRadius="20px"*/}
        {/*/>*/}
        <Stack
          sx={{ cursor: 'pointer' }}
          onClick={() => router.replace('/spaces/create')}
        >
          <SpacePlusIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default IconSidebar;
