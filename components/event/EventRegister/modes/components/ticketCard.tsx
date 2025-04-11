import { Stack, Typography } from '@mui/material';
import React from 'react';

interface TicketCardProps {
  name: string;
  price: number;
  tokenType: string;
  description: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  name,
  price,
  tokenType,
  description,
}) => {
  return (
    <Stack
      sx={{
        cursor: 'pointer',
        padding: '15px',
        borderRadius: '10px',
        bgcolor: '#2a2a2a',
        '&:hover': {
          bgcolor: '#3a3a3a',
        },
      }}
      spacing="10px"
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="bodyMB">{name}</Typography>
        <Stack direction="row" alignItems="baseline" spacing="5px">
          <Typography variant="bodyMB">{price}</Typography>
          <Typography variant="caption">{tokenType}</Typography>
        </Stack>
      </Stack>
      <Typography variant="bodyS">{description}</Typography>
    </Stack>
  );
};

export default TicketCard;
