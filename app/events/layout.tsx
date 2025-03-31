import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';

import ExploreLayout from '@/components/layout/explore/exploreLayout';

export const metadata: Metadata = {
  title: 'Zuzalu City',
  description: 'Zuzalu City Powered By Ethereum Community Fund',
};

function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <ExploreLayout selected={'Events'}>{children}</ExploreLayout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default EventLayout;
