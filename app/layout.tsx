'use client';
// import type { Metadata } from 'next';
import './globals.css';
import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'theme/theme';
import { WalletProvider } from '../context/WalletContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { CeramicProvider } from '../context/CeramicContext';
import { Header } from '@/components/layout';
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
import {
  HeroUIProvider,
  ToastProvider as HeroToastProvider,
} from '@heroui/react';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import NewAuthPrompt from '@/app/components/auth/NewAuthPrompt';
import { BuildInRoleProvider } from '@/context/BuildInRoleContext';

// 添加在这里 - import语句之后，组件定义之前
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = window.process || {};
  // 可能还需要添加Buffer polyfill
  if (!window.Buffer) window.Buffer = require('buffer/').Buffer;
}

const queryClient = new QueryClient();

const ceramicDown = process.env.NEXT_PUBLIC_CERAMIC_DOWN === 'true';
function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(ceramicDown);

  const pathname = usePathname();
  const isMobileAndTablet = useMediaQuery('(max-width: 1199px)');
  const isSpacePage = pathname?.startsWith('/spaces/');
  const shouldHideHeader = isMobileAndTablet && isSpacePage;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html
      lang="en"
      className="dark"
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
                          <BuildInRoleProvider>
                            <WalletProvider>
                              <ZupassProvider>
                                <AppContextProvider>
                                  <ReactQueryDevtools initialIsOpen={false} />
                                  <HeroToastProvider
                                    placement={'bottom-left'}
                                    toastOffset={20}
                                    toastProps={{
                                      classNames: {
                                        base: 'max-w-[350px]',
                                      },
                                      variant: 'flat',
                                    }}
                                    regionProps={{
                                      classNames: { base: 'z-[1500]' },
                                    }}
                                  />
                                  {!shouldHideHeader && <Header />}
                                  {isClient && <NewAuthPrompt />}
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
                          </BuildInRoleProvider>
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
