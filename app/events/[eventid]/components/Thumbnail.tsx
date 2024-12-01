'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Typography, useTheme, Skeleton } from '@mui/material';
import { ZuButton } from 'components/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import { ArrowFatLeftIcon } from '@/components/icons';

interface IThumbnail {
  name?: string;
  backFun?: Function;
  imageUrl?: string;
}

const Thumbnail: React.FC<IThumbnail> = ({ name, imageUrl, backFun }) => {
  const router = useRouter();
  const { breakpoints } = useTheme();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding="6px 20px"
      borderBottom="1px solid #383838"
      bgcolor="rgba(43, 43, 43, 0.8)"
      sx={{
        backdropFilter: 'blur(20px)',
      }}
    >
      <Stack direction="row" spacing="10px" alignItems="center">
        <ZuButton
          sx={{
            backgroundColor: '#333333',
            minWidth: 'unset',
            padding: '6px 10px',
          }}
          onClick={() => (backFun ? backFun() : router.back())}
        >
          <ArrowFatLeftIcon />
        </ZuButton>
        {imageUrl ? (
          <Image
            src={imageUrl}
            width={24}
            height={24}
            style={{ borderRadius: '8px', width: '24px', height: '24px' }}
            alt="event_image"
          />
        ) : (
          <Skeleton
            variant="rectangular"
            width={24}
            height={24}
            sx={{
              borderRadius: '8px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        )}

        {name ? (
          <Typography variant="h6" color="white">
            {name}
          </Typography>
        ) : (
          <Skeleton
            variant="text"
            width={100}
            height={32}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default Thumbnail;
