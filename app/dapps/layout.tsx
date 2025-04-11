import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';
import ExploreLayout from '@/components/layout/explore/exploreLayout';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import theme from 'theme/theme';

export const metadata: Metadata = {
  title: 'Zuzalu City',
  description: 'Zuzalu City Powered By Ethereum Community Fund',
};

function DappsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <ExploreLayout selected={'dapps'}>{children}</ExploreLayout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default DappsLayout;
