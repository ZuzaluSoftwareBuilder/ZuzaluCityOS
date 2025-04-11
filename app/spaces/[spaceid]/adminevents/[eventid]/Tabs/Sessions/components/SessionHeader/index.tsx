import { ZuButton } from '@/components/core';
import { Anchor } from '@/types';
import { Stack, Typography, useTheme } from '@mui/material';
import { PlusIcon } from 'components/icons';
import * as React from 'react';

interface SessionHeaderProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  onToggle = (anchor: Anchor, open: boolean) => {},
}) => {
  const { breakpoints } = useTheme();

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      pb="30px"
      borderBottom="1px solid #383838"
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Event Sessions
      </Typography>
      <ZuButton
        startIcon={<PlusIcon size={4} />}
        sx={{ padding: '6px 10px' }}
        onClick={() => onToggle('right', true)}
      >
        Add a Session
      </ZuButton>
    </Stack>
  );
};

export default SessionHeader;
