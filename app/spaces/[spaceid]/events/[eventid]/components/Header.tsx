'use client';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { LeftArrowIcon } from 'components/icons';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface IHeader {
  name?: string;
  spaceId?: string;
  backFun?: Function;
}

const Header: React.FC<IHeader> = ({ name, spaceId, backFun }) => {
  const router = useRouter();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding="10px 14px"
      borderBottom="1px solid #383838"
      bgcolor="#2d2d2d"
      sx={{
        zIndex: 1,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <ZuButton
          startIcon={<LeftArrowIcon />}
          onClick={() => (backFun ? backFun() : router.back())}
        >
          Back
        </ZuButton>
        <Typography variant="h6" color="white" lineHeight="40px">
          {name}
        </Typography>
      </Stack>
      {/*<Stack direction="row" gap={1}>
        <Stack
          direction="row"
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
        >
          <ShareIcon />
        </Stack>
        <Stack
          direction="row"
          padding={1}
          alignItems="center"
          bgcolor="#333333"
          borderRadius={2}
        >
          <ThreeHorizonIcon />
        </Stack>
      </Stack>*/}
    </Stack>
  );
};

export default Header;
