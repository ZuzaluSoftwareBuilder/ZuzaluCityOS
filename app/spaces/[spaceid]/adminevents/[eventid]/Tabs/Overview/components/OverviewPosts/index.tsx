import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { EditIcon, InformationIcon } from 'components/icons';
import OverviewPostCard from './OverviewPostCard';

const OverviewPosts = () => {
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" color="white">
            Posts
          </Typography>
          <InformationIcon color="#919191" size={5} />
        </Stack>
        <ZuButton startIcon={<EditIcon size={6} />}>Create New Post</ZuButton>
      </Stack>
      <Stack direction="column" spacing={1}>
        <OverviewPostCard />
        <OverviewPostCard />
      </Stack>
    </Stack>
  );
};

export default OverviewPosts;
