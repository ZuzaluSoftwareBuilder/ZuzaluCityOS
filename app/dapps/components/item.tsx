import { Dapp } from '@/types';
import { Divider, Stack, Typography } from '@mui/material';

interface ItemProps {
  data: Dapp;
  onClick: () => void;
}

export default function Item({ data, onClick }: ItemProps) {
  const { appName, developerName, tagline, bannerUrl, categories } = data;
  const tags = categories.split(',');
  return (
    <Stack
      p="10px"
      height="100%"
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
      onClick={onClick}
    >
      <Stack direction="column" gap="10px">
        <img
          src={bannerUrl}
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
            {appName}
          </Typography>
          <Typography
            fontSize={13}
            lineHeight={1.4}
            color="#fff"
            sx={{
              opacity: 0.8,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {tagline}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="column" gap="10px">
        <Stack direction="row" gap="5px" alignItems="center">
          {tags.slice(0, 3).map((tag) => (
            <Typography
              p="3px 6px"
              borderRadius="4px"
              bgcolor="rgba(255, 255, 255, 0.1)"
              fontSize={10}
              lineHeight={1.2}
              color="#fff"
              key={tag}
            >
              {tag}
            </Typography>
          ))}
          {tags.length > 3 && (
            <Typography fontSize={10} lineHeight={1.2} color="#fff">
              +{tags.length - 3}
            </Typography>
          )}
        </Stack>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.10)' }} />
        <Stack direction="row" gap="5px" alignItems="center" color="#fff">
          <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: 0.5 }}>
            Developer:
          </Typography>
          <Typography fontSize={10} lineHeight={1.2}>
            {developerName}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
