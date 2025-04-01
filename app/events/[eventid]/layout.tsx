import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';

type Props = {
  params: Promise<{ eventid: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = params.eventid;

  return {
    title: 'Zuzalu City',
    description: 'Zuzalu City Powered By Ethereum Community Fund',
    openGraph: {
      images: [`/api/og?id=${id}&type=event`],
    },
  };
}

function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <div>{children}</div>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default EventLayout;
