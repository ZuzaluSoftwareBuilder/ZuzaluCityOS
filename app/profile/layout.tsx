import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme';
import ExploreLayout from '@/components/layout/explore/exploreLayout';

export const metadata: Metadata = {
  title: 'Zuzalu Notification',
  description: 'Notification',
};

function NotificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <ExploreLayout selected={''}>{children}</ExploreLayout>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default NotificationLayout;
