import { Stack, useTheme } from '@mui/material';

const Container = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Stack
      spacing={3}
      boxSizing={'border-box'}
      sx={{
        width: '100%',
        padding: '20px',
        maxWidth: '1200px',
        px: '240px',
        [theme.breakpoints.down('lg')]: {
          px: '120px',
        },
        [theme.breakpoints.down('md')]: {
          px: '20px',
        },
        [theme.breakpoints.down('sm')]: {
          px: '16px',
        },
      }}
    >
      {children}
    </Stack>
  );
};

export default Container;
