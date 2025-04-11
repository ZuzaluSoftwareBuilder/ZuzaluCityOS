import SpaceHomeLayout from '@/app/spaces/components/spaceHomeLayout';
import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import theme from 'theme/theme';

export const metadata: Metadata = {
  title: 'Zuzalu City',
  description: 'Zuzalu City Powered By Ethereum Community Fund',
};

function SpaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <SpaceHomeLayout>{children}</SpaceHomeLayout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default SpaceLayout;
