import FormHeader from '@/components/form/FormHeader';
import { GlobeAltIcon, WindowIcon } from '@/components/icons';
import { Box, Typography, Stack, Divider } from '@mui/material';
import Link from 'next/link';

import ShowMoreEdit from '@/components/editor/ShowMoreEdit';

interface DappDetailProps {
  handleClose: () => void;
}

export default function DappDetail({ handleClose }: DappDetailProps) {
  return (
    <Box>
      <FormHeader title="Submit Your App" handleClose={handleClose} />
      <Stack display="flex" flexDirection="column" gap="20px" padding="20px">
        <img
          src="https://images.wsj.net/im-43460061?width=608&height=405&pixel_ratio=2"
          alt="dapp-detail"
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '620/280',
            borderRadius: '10px',
          }}
        />
        <Stack direction="row" gap="10px">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap="10px"
            borderRadius="10px"
            border="1px solid rgba(255, 255, 255, 0.10)"
            bgcolor="rgba(255, 255, 255, 0.10)"
            p="10px 14px"
            width="300px"
            sx={{ cursor: 'pointer' }}
          >
            <WindowIcon />
            <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
              Open App
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap="10px"
            borderRadius="10px"
            bgcolor="rgba(255, 255, 255, 0.05)"
            p="10px 14px"
            flex={1}
            sx={{ cursor: 'pointer' }}
          >
            <GlobeAltIcon />
            <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
              Website
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap="10px"
            borderRadius="10px"
            bgcolor="rgba(255, 255, 255, 0.05)"
            p="10px 14px"
            flex={1}
            sx={{ cursor: 'pointer' }}
          >
            <GlobeAltIcon />
            <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
              Docs
            </Typography>
          </Stack>
        </Stack>
        <Typography fontSize={18} fontWeight={800} lineHeight={1.4}>
          LottoPGF
        </Typography>
        <Stack direction="column" gap="10px">
          <Stack direction="row" alignItems="center" gap="10px">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Categories:
            </Typography>
            <Typography
              p="4px 8px"
              fontSize={13}
              borderRadius="4px"
              bgcolor="rgba(255, 255, 255, 0.05)"
            >
              LottoPGF
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap="10px">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Developer:
            </Typography>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
              Lotto PGF
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Typography fontSize={16} fontWeight={600} lineHeight={1.4}>
          App Description:
        </Typography>
        <ShowMoreEdit value="dasdsadasd" />
        <Divider />
        <Stack direction="column" gap="10px">
          <Stack direction="row" alignItems="center" gap="10px">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Status:
            </Typography>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
              In Development
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap="10px">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Repository Link:
            </Typography>
            <Link
              href="https://github.com/lotto-pgf"
              target="_blank"
              style={{
                fontSize: 13,
                lineHeight: 1.4,
                opacity: 0.8,
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
              }}
            >
              https://github.com/project/repo-1
            </Link>
          </Stack>
          <Typography
            p="4px 8px"
            fontSize={13}
            borderRadius="4px"
            bgcolor="rgba(255, 255, 255, 0.05)"
            width="fit-content"
          >
            Open-Source
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
