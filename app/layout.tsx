'use client';
// import type { Metadata } from 'next';
import './globals.css';
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

const queryClient = new QueryClient();

// export const metadata: Metadata = {
//   title: 'Zuzalu City',
//   description: 'Zuzalu City Powered By Ethereum Community Fund',
// };

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <html lang="en">
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
          <DialogProvider>
            <ToastProvider>
              <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                  <LitProvider>
                    <CeramicProvider>
                      <WalletProvider>
                        <ZupassProvider>
                          <AppContextProvider>
                            <ReactQueryDevtools initialIsOpen={false} />
                            <Header />
                            {isClient && <AuthPrompt />}
                            <GlobalDialog />
                            {isClient && (
                              <Dialog
                                title="Upgrading Ceramic Node"
                                message="We are currently upgrading our Ceramic node. Some data may be temporarily unavailable or inconsistent. We apologize for any inconvenience."
                                showModal={show}
                                onClose={() => setShow(false)}
                                onConfirm={() => setShow(false)}
                              />
                            )}
                            <div style={{ minHeight: `calc(100vh - 50px)` }}>
                              {children}
                            </div>
                          </AppContextProvider>
                        </ZupassProvider>
                      </WalletProvider>
                    </CeramicProvider>
                  </LitProvider>
                </QueryClientProvider>
              </ThemeProvider>
            </ToastProvider>
          </DialogProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export default RootLayout;
