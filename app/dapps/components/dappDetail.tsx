import FormHeader from '@/components/form/FormHeader';
import { GlobeAltIcon, WindowIcon } from '@/components/icons';
import { Box, Typography, Stack, Divider } from '@mui/material';
import Link from 'next/link';

import ShowMoreEdit from '@/components/editor/ShowMoreEdit';
import { Dapp } from '@/types';
import theme from '@/theme/theme';
interface DappDetailProps {
  data?: Dapp;
  handleClose: () => void;
}

export default function DappDetail({ handleClose, data }: DappDetailProps) {
  if (!data) return null;
  const {
    appName,
    developerName,
    description,
    bannerUrl,
    categories,
    devStatus,
    openSource,
    repositoryUrl,
    appUrl,
    websiteUrl,
    docsUrl,
    tagline,
  } = data;

  const categoriesArray = categories.split(',');

  return (
    <Box>
      <FormHeader title={appName} handleClose={handleClose} />
      <Stack display="flex" flexDirection="column" gap="20px" padding="20px">
        <img
          src={bannerUrl}
          alt="dapp-detail"
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '620/280',
            borderRadius: '10px',
          }}
        />
        <Stack
          direction="row"
          gap="10px"
          sx={{
            [theme.breakpoints.down(700)]: {
              flexDirection: 'column',
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap="10px"
            borderRadius="10px"
            border="1px solid rgba(255, 255, 255, 0.10)"
            bgcolor="rgba(255, 255, 255, 0.10)"
            p="10px 14px"
            sx={{
              cursor: appUrl ? 'pointer' : 'not-allowed',
              width: '300px',
              [theme.breakpoints.down(700)]: {
                width: '100%',
              },
            }}
            onClick={() => {
              appUrl && window.open(appUrl, '_blank');
            }}
          >
            <WindowIcon />
            <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
              Open App
            </Typography>
          </Stack>
          <Stack direction="row" gap="10px" flex={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              gap="10px"
              borderRadius="10px"
              bgcolor="rgba(255, 255, 255, 0.05)"
              p="10px 14px"
              flex={1}
              sx={{ cursor: websiteUrl ? 'pointer' : 'not-allowed' }}
              onClick={() => {
                websiteUrl && window.open(websiteUrl, '_blank');
              }}
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
              sx={{ cursor: docsUrl ? 'pointer' : 'not-allowed' }}
              onClick={() => {
                docsUrl && window.open(docsUrl, '_blank');
              }}
            >
              <GlobeAltIcon />
              <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
                Docs
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack gap="10px">
          <Typography fontSize={18} fontWeight={800} lineHeight={1.4}>
            {appName}
          </Typography>
          <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
            {tagline}
          </Typography>
        </Stack>
        <Stack direction="column" gap="10px">
          <Stack direction="row" alignItems="center" gap="10px" flexWrap="wrap">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Categories:
            </Typography>
            {categoriesArray.map((category: string) => (
              <Typography
                key={category}
                p="4px 8px"
                fontSize={13}
                borderRadius="4px"
                bgcolor="rgba(255, 255, 255, 0.05)"
              >
                {category}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap="10px">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Developer:
            </Typography>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
              {developerName}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Typography fontSize={16} fontWeight={600} lineHeight={1.4}>
          App Description:
        </Typography>
        <ShowMoreEdit value={description} />
        <Divider />
        <Stack direction="column" gap="10px">
          <Stack direction="row" alignItems="center" gap="10px">
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.5 }}>
              Status:
            </Typography>
            <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
              {devStatus}
            </Typography>
          </Stack>
          {Number(openSource) === 1 && (
            <>
              <Stack direction="row" alignItems="center" gap="10px">
                <Typography
                  fontSize={13}
                  lineHeight={1.4}
                  sx={{ opacity: 0.5 }}
                >
                  Repository Link:
                </Typography>
                <Link
                  href={repositoryUrl || ''}
                  target="_blank"
                  style={{
                    fontSize: 13,
                    lineHeight: 1.4,
                    opacity: 0.8,
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                  }}
                >
                  View Repository
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
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
