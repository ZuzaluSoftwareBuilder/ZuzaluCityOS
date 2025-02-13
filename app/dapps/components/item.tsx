import { Divider, Stack, Typography } from '@mui/material';

export default function Item() {
  return (
    <Stack
      p="10px"
      borderRadius="10px"
      boxSizing="border-box"
      border="1px solid transparent"
      sx={{
        cursor: 'pointer',
        '&:hover': {
          border: '1px solid rgba(255, 255, 255, 0.10)',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
      gap="10px"
      justifyContent="space-between"
    >
      <Stack direction="column" gap="10px">
        <img
          src="/dapps/dappsHeader.png"
          alt="dappsItem"
          width="100%"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '10px',
            aspectRatio: '620/280',
          }}
        />
        <Stack direction="column" gap="5px">
          <Typography
            sx={{
              color: '#fff',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Trustful Reputation
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '13px',
              lineHeight: 1.4,
              opacity: 0.8,
            }}
          >
            A private, token-gated, decentralized social network built by AKASHA
            core
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="column" gap="10px">
        <Stack direction="row">
          <Typography
            p="3px 6px"
            borderRadius="4px"
            bgcolor="rgba(255, 255, 255, 0.1)"
            fontSize={10}
            lineHeight={1.2}
            color="#fff"
            borderRight="4px"
          >
            Developer:
          </Typography>
        </Stack>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.10)' }} />
        <Stack direction="row" gap="5px" alignItems="center" color="#fff">
          <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.5 }}>
            Developer:
          </Typography>
          <Typography fontSize={10} lineHeight={1.2}>
            Blockful.io
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
