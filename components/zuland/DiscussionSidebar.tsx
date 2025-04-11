import { ZuButton } from '@/components/core';
import {
  ChainIcon,
  DiscordIcon,
  FarcasterIcon,
  TelegramIcon,
  TwitterIcon,
  XMarkIcon,
} from '@/components/icons';
import { buildIpfsUrl, Post } from '@/utils/akasha/beam-to-post';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';

interface SidebarProps {
  handleClose: () => void;
  discussion: Post | undefined;
}

const DiscussionSidebar = ({ discussion, handleClose }: SidebarProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#222222',
        padding: '10px',
      }}
      role="presentation"
      zIndex="10"
      borderLeft="1px solid #383838"
    >
      <Box
        display="flex"
        alignItems="center"
        height="50px"
        justifyContent="space-between"
        borderBottom="1px solid #383838"
        paddingX={3}
        gap={2}
      >
        <Typography variant="subtitleSB">Profile</Typography>
        <ZuButton
          startIcon={<XMarkIcon />}
          onClick={handleClose}
          sx={{
            backgroundColor: 'transparent',
          }}
        >
          Close
        </ZuButton>
      </Box>

      <Box display="flex" flexDirection="column" gap="20px" padding={3}>
        <Box bgcolor="#262626" borderRadius="10px" padding="20px">
          <Stack
            marginBottom="20px"
            display="flex"
            direction="column"
            gap="10px"
          >
            <Avatar
              src={buildIpfsUrl(
                discussion?.author.akashaProfile?.avatar?.default.src,
              )}
              alt={discussion?.author.akashaProfile?.name}
              sx={{ width: 32, height: 32 }}
            />
            <Typography variant="h6">
              {discussion?.author.akashaProfile?.name}
            </Typography>
            <Typography variant="body2">
              {discussion?.author.akashaProfile?.description}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2">Address</Typography>
            <Typography variant="body2" color="text.primary">
              {discussion?.author.akashaProfile?.did.id}
            </Typography>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderTop: '1px solid',
              borderColor: 'primary.light',
              paddingTop: '10px',
            }}
          >
            <Typography variant="subtitle2">Socials</Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ padding: '10px' }}
            >
              {discussion?.author.akashaProfile?.links?.map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  target="_blank"
                >
                  <ZuButton
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '10px 10px',
                    }}
                  >
                    {getIconFromLink(link?.href)}
                  </ZuButton>
                </Link>
              ))}
            </Stack>
          </Stack>

          <Stack
            direction="column"
            sx={{
              borderTop: '1px solid',
              borderColor: 'primary.light',
              paddingTop: '10px',
            }}
          >
            <Typography variant="subtitle2">Last Messages</Typography>
            <Typography variant="body2" color="text.secondary">
              List of last messages...
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export const getIconFromLink = (link: string) => {
  if (
    link.startsWith('https://x.com/') ||
    link.startsWith('https://twitter.com/')
  ) {
    return <TwitterIcon width="20px" height="20px" />;
  }
  if (
    link.startsWith('https://discord.gg/') ||
    link.startsWith('https://discord.com/')
  ) {
    return <DiscordIcon width="20px" height="20px" />;
  }
  if (link.startsWith('https://t.me/')) {
    return <TelegramIcon width="20px" height="20px" />;
  }
  if (link.startsWith('https://warpcast.com/')) {
    return <FarcasterIcon width="20px" height="20px" />;
  }
  return <ChainIcon width="20px" height="20px" color="white" />;
};

export default DiscussionSidebar;
