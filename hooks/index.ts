import { useMediaQuery as useMuiMediaQuery } from '@mui/material';

const useMediaQuery = () => {
  const isMobile = useMuiMediaQuery('(max-width: 809px)');
  const isTablet = useMuiMediaQuery(
    '(min-width: 810px) and (max-width: 1199px)',
  );
  const isPc = useMuiMediaQuery('(min-width: 1200px)');

  return { isMobile, isTablet, isPc };
};

export { useMediaQuery };
