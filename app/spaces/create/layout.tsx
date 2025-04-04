import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';

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
      {/* <ThemeProvider theme={theme}> */}
      <div>{children}</div>
      {/* </ThemeProvider> */}
    </AppRouterCacheProvider>
  );
}

export default EventLayout;
