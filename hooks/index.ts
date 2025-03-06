import { useTheme } from '@mui/material';
import { useMediaQuery as useMuiMediaQuery } from '@mui/material';

const useMediaQuery = () => {
  const { breakpoints } = useTheme();
  const isMobile = useMuiMediaQuery(breakpoints.down('md'));
  return { isMobile };
};

export { useMediaQuery };
