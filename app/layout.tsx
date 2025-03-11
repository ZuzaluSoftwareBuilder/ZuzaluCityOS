'use client';
// import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';
import { WalletProvider } from '../context/WalletContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { CeramicProvider } from '../context/CeramicContext';
import { Header } from '@/components/layout';
import AuthPrompt from '@/components/AuthPrompt';
import AppContextProvider from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { ZupassProvider } from '@/context/ZupassContext';
import '@/utils/yupExtensions';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LitProvider } from '@/context/LitContext';
import { DialogProvider } from '@/components/dialog/DialogContext';
import { GlobalDialog } from '@/components/dialog/GlobalDialog';
import { ToastProvider } from '@/components/toast/ToastContext';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { HeroUIProvider } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@mui/material';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const queryClient = new QueryClient();

// export const metadata: Metadata = {
//   title: 'Zuzalu City',
//   description: 'Zuzalu City Powered By Ethereum Community Fund',
// };
const ceramicDown = process.env.NEXT_PUBLIC_CERAMIC_DOWN === 'true';
function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(ceramicDown);

  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 809px)');
  const isSpaceEditPage = pathname?.includes('/spaces/') && pathname?.includes('/edit');
  const shouldHideHeader = isMobile && isSpaceEditPage;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html
      lang="en"
      className={`dark ${inter.className}`}
      style={{ backgroundColor: '#222', height: '100vh' }}
    >
      <head>
        <link rel="icon" href="/logo.webp" />
      </head>
      <title>Zuzalu City</title>
      <meta
        name="description"
        content="Zuzalu City Powered By Ethereum Community Fund"
      />
      <body>
        <AppRouterCacheProvider>
          <HeroUIProvider>
            <DialogProvider>
              <ToastProvider>
                <ThemeProvider theme={theme}>
                  <QueryClientProvider client={queryClient}>
                    <NuqsAdapter>
                      <LitProvider>
                        <CeramicProvider>
                          <WalletProvider>
                            <ZupassProvider>
                              <AppContextProvider>
                                <ReactQueryDevtools initialIsOpen={false} />
                                {!shouldHideHeader && <Header />}
                                {isClient && <AuthPrompt />}
                                <GlobalDialog />
                                {isClient && ceramicDown && (
                                  <Dialog
                                    title="Upgrading Ceramic Node"
                                    message="We are currently upgrading our Ceramic node. Some data may be temporarily unavailable or inconsistent. We apologize for any inconvenience."
                                    showModal={show}
                                    onClose={() => setShow(false)}
                                    onConfirm={() => setShow(false)}
                                  />
                                )}
                                <div
                                  style={{ minHeight: `calc(100vh - 50px)` }}
                                >
                                  {children}
                                </div>
                              </AppContextProvider>
                            </ZupassProvider>
                          </WalletProvider>
                        </CeramicProvider>
                      </LitProvider>
                    </NuqsAdapter>
                  </QueryClientProvider>
                </ThemeProvider>
              </ToastProvider>
            </DialogProvider>
          </HeroUIProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export default RootLayout;
