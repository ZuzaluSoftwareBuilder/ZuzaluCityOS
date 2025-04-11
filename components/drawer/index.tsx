import { Box, SwipeableDrawer, useTheme } from '@mui/material';
import React from 'react';

interface EventDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

const EventDrawer: React.FC<EventDrawerProps> = ({
  open,
  onClose,
  onOpen,
  children,
}) => {
  const breakpoints = useTheme().breakpoints;
  return (
    <SwipeableDrawer
      hideBackdrop={false}
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      ModalProps={{
        keepMounted: false,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          background: '#222',
          borderLeft: '1px solid #383838',
        },
      }}
    >
      <Box
        sx={{
          width: '700px',
          [breakpoints.down(700)]: {
            width: '100vw',
            borderLeft: 'none',
          },
        }}
        role="presentation"
        zIndex="100"
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

export default EventDrawer;
