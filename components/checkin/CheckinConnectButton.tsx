import { ZuButton } from '@/components/core';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Stack } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

interface IProps {
  address: string;
}

export default function CheckinConnectButton({ address }: IProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            style={{
              width: '100%',
            }}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Stack
                    width="100%"
                    gap="18px"
                    height={'100%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <ZuButton
                      startIcon={<ArrowCircleRightIcon />}
                      sx={{
                        width: '100%',
                        border: '1px solid rgba(215, 255, 196, 0.20)',
                        backgroundColor: 'rgba(215, 255, 196, 0.10)',
                        color: '#D7FFC4',
                      }}
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </ZuButton>
                  </Stack>
                );
              }

              if (chain.unsupported) {
                return (
                  <ZuButton
                    sx={{
                      width: '100%',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                    onClick={openChainModal}
                  >
                    Wrong Network
                  </ZuButton>
                );
              }

              if (connected) {
                return (
                  <Stack
                    width="100%"
                    gap="14px"
                    height={'100%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <ZuButton
                      startIcon={
                        <Image
                          src="/user/wallet.png"
                          alt="wallet"
                          height={24}
                          width={24}
                        />
                      }
                      sx={{
                        width: '100%',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }}
                      onClick={() => {
                        openAccountModal();
                      }}
                    >
                      {address}
                    </ZuButton>
                  </Stack>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
