'use client';
// import type { Metadata } from 'next';
import NewAuthPrompt from '@/app/components/auth/NewAuthPrompt';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { DialogProvider } from '@/components/dialog/DialogContext';
import { GlobalDialog } from '@/components/dialog/GlobalDialog';
import { AppRouterCacheProvider } from '@/components/emotion/AppRouterCacheProvider';
import { Header } from '@/components/layout';
import { ToastProvider } from '@/components/toast/ToastContext';
import { AbstractAuthProvider } from '@/context/AbstractAuthContext';
import AppContextProvider from '@/context/AppContext';
import { BuildInRoleProvider } from '@/context/BuildInRoleContext';
import { LitProvider } from '@/context/LitContext';
import { ModalProvider } from '@/context/ModalContext';
import { RepositoryProvider } from '@/context/RepositoryContext';
import { SupabaseProvider } from '@/context/SupabaseContext';
import { ZupassProvider } from '@/context/ZupassContext';
import useTheme, { Theme } from '@/hooks/use-theme';
import '@/utils/yupExtensions';
import {
  ToastProvider as HeroToastProvider,
  HeroUIProvider,
} from '@heroui/react';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname } from 'next/navigation';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React, { useCallback, useEffect, useState } from 'react';
import theme from 'theme/theme';
import { CeramicProvider } from '../context/CeramicContext';
import { WalletProvider } from '../context/WalletContext';
import './globals.css';

const queryClient = new QueryClient();

const ceramicDown = process.env.NEXT_PUBLIC_CERAMIC_DOWN === 'true';
const betaUpgrade = process.env.NEXT_PUBLIC_BETA_UPGRADE === 'true';
function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(ceramicDown);
  const [showBetaUpgrade, setShowBetaUpgrade] = useState(false);
  const pathname = usePathname();
  const isMobileAndTablet = useMediaQuery('(max-width: 1199px)');
  const isSpacePage = pathname?.startsWith('/spaces/');
  const shouldHideHeader = isMobileAndTablet && isSpacePage;
  const [HeroTheme] = useTheme(Theme.Dark);

  useEffect(() => {
    setIsClient(true);

    const betaUpgradeShown =
      localStorage.getItem('betaUpgradeShown') === 'true';

    setShowBetaUpgrade(!betaUpgradeShown && betaUpgrade);
  }, []);

  const handleBetaUpgradeClose = useCallback(() => {
    localStorage.setItem('betaUpgradeShown', 'true');
    setShowBetaUpgrade(false);
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
                  <div className={HeroTheme}>
                    <QueryClientProvider client={queryClient}>
                      <NuqsAdapter>
                        <LitProvider>
                          <WalletProvider>
                            <RepositoryProvider>
                              <CeramicProvider>
                                <SupabaseProvider>
                                  <AbstractAuthProvider>
                                    <BuildInRoleProvider>
                                      <ZupassProvider>
                                        <ModalProvider>
                                          <AppContextProvider>
                                            <ReactQueryDevtools
                                              initialIsOpen={false}
                                              buttonPosition="bottom-left"
                                            />
                                            <HeroToastProvider
                                              placement={'bottom-left'}
                                              toastOffset={20}
                                              toastProps={{
                                                classNames: {
                                                  base: 'max-w-[350px]',
                                                  content: 'min-w-0',
                                                  wrapper: 'min-w-0',
                                                  title:
                                                    'break-words whitespace-normal',
                                                  description:
                                                    'break-words whitespace-normal',
                                                },
                                                variant: 'flat',
                                              }}
                                              regionProps={{
                                                classNames: {
                                                  base: 'z-[1500]',
                                                },
                                              }}
                                            />
                                            {!shouldHideHeader && <Header />}
                                            {isClient && <NewAuthPrompt />}
                                            <GlobalDialog />
                                            {isClient && show && (
                                              <Dialog
                                                title="Upgrading Ceramic Node"
                                                message="We are currently upgrading our Ceramic node. Some data may be temporarily unavailable or inconsistent. We apologize for any inconvenience."
                                                showModal={show}
                                                onClose={() => setShow(false)}
                                                onConfirm={() => setShow(false)}
                                              />
                                            )}
                                            {isClient && showBetaUpgrade && (
                                              <Dialog
                                                title="Beta Version Upgrade"
                                                message={
                                                  <>
                                                    We&apos;ve just rolled out a
                                                    major Beta upgrade—our
                                                    default chain has officially
                                                    moved from Scroll to Mainnet
                                                    ! 🚀
                                                    <br />
                                                    <br />
                                                    Any data previously created
                                                    on Scroll is now marked as
                                                    &quot;Legacy&quot; and need
                                                    to be recreated on Mainnet
                                                    now. Thanks for your
                                                    understanding and support as
                                                    we continue to grow and
                                                    improve! 💫
                                                  </>
                                                }
                                                showModal={showBetaUpgrade}
                                                onClose={handleBetaUpgradeClose}
                                                onConfirm={
                                                  handleBetaUpgradeClose
                                                }
                                              />
                                            )}
                                            <div
                                              style={{
                                                minHeight: `calc(100vh - 50px)`,
                                              }}
                                            >
                                              {children}
                                            </div>
                                          </AppContextProvider>
                                        </ModalProvider>
                                      </ZupassProvider>
                                    </BuildInRoleProvider>
                                  </AbstractAuthProvider>
                                </SupabaseProvider>
                              </CeramicProvider>
                            </RepositoryProvider>
                          </WalletProvider>
                        </LitProvider>
                      </NuqsAdapter>
                    </QueryClientProvider>
                  </div>
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
