import { ReactNode } from 'react';
import { useMediaQuery as useResponsiveMediaQuery } from 'react-responsive';

export const SCREEN_BREAKPOINTS = {
  XL: {
    MIN: 1445,
  },
  PC: {
    MIN: 1200,
  },
  TABLET: {
    MIN: 810,
    MAX: 1199,
  },
  MOBILE: {
    MIN: 1,
    MAX: 809,
  },
} as const;

const useMediaQuery = () => {
  const isXl = useResponsiveMediaQuery({ minWidth: SCREEN_BREAKPOINTS.XL.MIN });
  const isPc = useResponsiveMediaQuery({ minWidth: SCREEN_BREAKPOINTS.PC.MIN });
  const isTablet = useResponsiveMediaQuery({
    minWidth: SCREEN_BREAKPOINTS.TABLET.MIN,
    maxWidth: SCREEN_BREAKPOINTS.TABLET.MAX,
  });
  const isMobile = useResponsiveMediaQuery({
    minWidth: SCREEN_BREAKPOINTS.MOBILE.MIN,
    maxWidth: SCREEN_BREAKPOINTS.MOBILE.MAX,
  });

  return { isXl, isPc, isTablet, isMobile };
};

interface ResponsiveProps {
  children: ReactNode;
}

export const Mobile = ({ children }: ResponsiveProps) => {
  const isMobile = useResponsiveMediaQuery({
    minWidth: SCREEN_BREAKPOINTS.MOBILE.MIN,
    maxWidth: SCREEN_BREAKPOINTS.MOBILE.MAX,
  });
  return isMobile ? <>{children}</> : null;
};

export const Tablet = ({ children }: ResponsiveProps) => {
  const isTablet = useResponsiveMediaQuery({
    minWidth: SCREEN_BREAKPOINTS.TABLET.MIN,
    maxWidth: SCREEN_BREAKPOINTS.TABLET.MAX,
  });
  return isTablet ? <>{children}</> : null;
};

export const PC = ({ children }: ResponsiveProps) => {
  const isPc = useResponsiveMediaQuery({ minWidth: SCREEN_BREAKPOINTS.PC.MIN });
  return isPc ? <>{children}</> : null;
};

export const XL = ({ children }: ResponsiveProps) => {
  const isXl = useResponsiveMediaQuery({ minWidth: SCREEN_BREAKPOINTS.XL.MIN });
  return isXl ? <>{children}</> : null;
};

export const NotMobile = ({ children }: ResponsiveProps) => {
  const isNotMobile = useResponsiveMediaQuery({
    minWidth: SCREEN_BREAKPOINTS.TABLET.MIN,
  });
  return isNotMobile ? <>{children}</> : null;
};

export { useMediaQuery };
