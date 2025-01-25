import { SearchIcon } from '@/components/icons';
import { InputAdornment, OutlinedInput } from '@mui/material';

import { Stack } from '@mui/material';

export default function List() {
  return (
    <Stack direction="row" flex={1} p="20px">
      <OutlinedInput
        placeholder="Search dApps"
        sx={{
          backgroundColor: 'var(--Inactive-White, rgba(255, 255, 255, 0.05))',
          p: '12px 14px',
          borderRadius: '10px',
          height: '40px',
          width: '100%',
          border: '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
          opacity: 0.7,
          color: 'white',
          fontSize: '16px',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        // onChange={(e) => setSearchVal(e.target.value)}
        startAdornment={
          <InputAdornment position="start" sx={{ opacity: 0.6 }}>
            <SearchIcon />
          </InputAdornment>
        }
      />
      <Stack direction="column" flex={1}></Stack>
    </Stack>
  );
}
