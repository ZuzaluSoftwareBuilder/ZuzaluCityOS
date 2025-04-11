import Drawer from '@/components/drawer';
import useOpenDraw from '@/hooks/useOpenDraw';
import { Event, RegistrationAndAccess } from '@/types';
import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { TitleWithTag } from '../Common';
import { TagProps, TicketingMethod } from '../types';
import Panel from './Panel';
import ScrollpassForm from './ScrollpassForm';
import ZupassForm from './ZupassForm';

interface AccessRulesProps {
  regAndAccess?: RegistrationAndAccess;
  event?: Event;
  type?: 'zupass' | 'scrollpass';
  isAvailable?: boolean;
}

export default function AccessRules({
  regAndAccess,
  type = 'zupass',
  isAvailable,
}: AccessRulesProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();

  const tags = useMemo(() => {
    const tags: TagProps[] = [];
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      if (!regAndAccess?.scrollPassTickets) {
        tags.push({ type: 'required', text: 'Requires Tickets' });
      }
    }
    if (regAndAccess?.ticketType === TicketingMethod.ZuPass) {
      if (!regAndAccess?.zuPassInfo) {
        tags.push({ type: 'required', text: 'Requires Tickets' });
      }
    }
    if (regAndAccess?.scrollPassTickets?.length) {
      const data = regAndAccess?.scrollPassTickets.filter(
        (ticket) => ticket.checkin === '1',
      );
      if (data.length === 0) {
        tags.push({ type: 'warning', text: 'Requires completed SETUP' });
      }
    }
    if (regAndAccess?.zuPassInfo?.length) {
      const data = regAndAccess?.zuPassInfo.filter((ticket) => ticket.access);
      if (data.length === 0) {
        tags.push({ type: 'warning', text: 'Requires completed SETUP' });
      }
    }
    return tags;
  }, [
    regAndAccess?.scrollPassTickets,
    regAndAccess?.ticketType,
    regAndAccess?.zuPassInfo,
  ]);

  return (
    <Stack spacing="20px">
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        {type === 'zupass' ? (
          <ZupassForm onClose={handleClose} regAndAccess={regAndAccess} />
        ) : (
          <ScrollpassForm regAndAccess={regAndAccess} onClose={handleClose} />
        )}
      </Drawer>
      <TitleWithTag
        title="Access Rules"
        desc="Select which tickets will have access to the event’s apps"
        tags={tags}
        required={regAndAccess?.checkinOpen !== '1'}
      />
      {isAvailable ? (
        <Panel handleOpen={handleOpen} regAndAccess={regAndAccess} />
      ) : (
        <Box p="10px" bgcolor="rgba(255, 255, 255, 0.05)" borderRadius="10px">
          <Typography
            fontSize={18}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.8 }}
          >
            Unavailable
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
