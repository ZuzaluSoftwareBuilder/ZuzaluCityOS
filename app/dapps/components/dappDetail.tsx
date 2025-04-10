import FormHeader from '@/components/form/FormHeader';
import { GlobeAltIcon, WindowIcon } from '@/components/icons';
import { Box, Typography, Stack, Divider } from '@mui/material';

import { Dapp } from '@/types';
import theme from '@/theme/theme';
import DAppDetailDrawer from '@/app/spaces/[spaceid]/setting/apps/components/DAppDetailDrawer';
import { Image } from '@heroui/react';
import { BoxArrowDown } from '@phosphor-icons/react';
import { Plugs } from '@phosphor-icons/react';
import EditorProWithMore from '@/app/spaces/[spaceid]/components/home/EditorProWithMore';

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
    isInstallable,
    appLogoUrl,
    isLegacy,
  } = data;

  const categoriesArray = categories.split(',');

  return (
    <Box>
      <FormHeader title={appName} handleClose={handleClose} />
      <div className="flex flex-col gap-[20px] p-[20px] mobile:p-[10px]">
        <DAppDetailDrawer.Disclaimer />
        <Image
          src={bannerUrl}
          alt="dapp-detail"
          className="aspect-[620/280] h-auto w-full rounded-[10px] object-fill"
          classNames={{
            wrapper: '!max-w-none w-full',
          }}
        />
        {isInstallable === '1' && (
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center justify-center gap-[5px] rounded-[8px] border border-[#7dffd1]/10 bg-[#7dffd1]/10 p-[4px_8px] text-[13px] text-[#7DFFD1]">
              <Plugs size={16} color="#7DFFD1" weight="fill" />
              Integrated App
            </div>
            <p className="flex items-center gap-[5px] rounded-[8px] bg-white/5 p-[4px_8px] text-[13px]">
              <BoxArrowDown size={16} weight="fill" />
              Installable to Space
            </p>
          </div>
        )}
        <div className="flex flex-row items-center gap-[10px]">
          <Image
            src={isLegacy ? bannerUrl : appLogoUrl || ''}
            alt={appName}
            className="size-[60px] rounded-[10px] border border-[rgba(255,255,255,0.1)] object-cover"
            classNames={{
              wrapper: 'shrink-0',
            }}
          />
          <div className="flex flex-col gap-[5px]">
            <p className="text-[18px] font-bold leading-[1.4]">{appName}</p>
            <p className="text-[13px] leading-[1.4] opacity-80">{tagline}</p>
          </div>
        </div>
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
            bgcolor="rgba(255, 255, 255, 0.05)"
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
              bgcolor="rgba(255, 255, 255, 0.1)"
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
              bgcolor="rgba(255, 255, 255, 0.1)"
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
        <EditorProWithMore
          value={description}
          isEdit={false}
          className={{
            base: 'bg-transparent',
            editorWrapper: 'p-0',
          }}
          collapseHeight={150}
          defaultCollapsed={true}
        />
        <Divider />
        <DAppDetailDrawer.Status
          devStatus={devStatus}
          openSource={openSource}
          repositoryUrl={repositoryUrl}
        />
      </div>
    </Box>
  );
}
