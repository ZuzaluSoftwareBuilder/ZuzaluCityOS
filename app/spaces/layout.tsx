import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';
import SpaceHomeLayout from '@/app/spaces/components/spaceHomeLayout';

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
