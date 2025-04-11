import Drawer from '@/components/drawer';
import useOpenDraw from '@/hooks/useOpenDraw';
import useRegAndAccess from '@/hooks/useRegAndAccess';
import { Event, RegistrationAndAccess } from '@/types';
import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import {
  StatusIndicatorPanel,
  TitleWithTag,
  useStatusContext,
} from '../Common';
import { RegistrationAccess, TagProps } from '../types';
import Form from './Form';

interface StatusProps {
  event?: Event;
  regAndAccess?: RegistrationAndAccess;
  isAvailable?: boolean;
}

const RegistrationStatus = ({
  isAvailable = false,
  regAndAccess,
}: StatusProps) => {
  const { status } = useStatusContext();
  const isOpen = status.registrationOpen;

  const { handleRegistrationOpenChange } = useRegAndAccess({ regAndAccess });
  const { handleOpen, handleClose, open } = useOpenDraw();

  const tags = useMemo(() => {
    const tags: TagProps[] = [
      {
        type: 'text',
        text: `Setting: ${regAndAccess?.registrationAccess}`,
      },
    ];
    if (!isAvailable || !isOpen) {
      tags.push({
        type: 'warning',
        text: 'Required to open event',
      });
    }
    return tags;
  }, [isAvailable, isOpen, regAndAccess?.registrationAccess]);

  return (
    <>
      <Stack>
        <TitleWithTag
          tags={tags}
          title="Event Registration"
          desc="Open or close registration on your event page"
          required={!isOpen}
          buttonText={
            regAndAccess?.registrationAccess === RegistrationAccess.Whitelist
              ? 'Open Whitelist'
              : undefined
          }
          onClick={handleOpen}
        />
        <Box mt="20px">
          {!isAvailable ? (
            <Box
              p="10px"
              bgcolor="rgba(255, 255, 255, 0.05)"
              borderRadius="10px"
            >
              <Typography
                fontSize={18}
                fontWeight={700}
                lineHeight={1.2}
                sx={{ opacity: 0.8 }}
              >
                Unavailable
              </Typography>
            </Box>
          ) : (
            <StatusIndicatorPanel
              type="registration"
              name={isOpen ? 'Open' : 'Close'}
              desc={
                isOpen
                  ? 'Registration is opened.'
                  : 'Registration is closed. No one has access to register to your event'
              }
              checked={isOpen}
              onChange={handleRegistrationOpenChange}
            />
          )}
        </Box>
      </Stack>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form onClose={handleClose} regAndAccess={regAndAccess} />
      </Drawer>
    </>
  );
};

export { RegistrationStatus };
