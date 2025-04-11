import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import React, { ReactNode } from 'react';
import { createPublicClient } from 'viem';
import { WagmiProvider, createConfig, fallback, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet],
    },
  ],
  {
    appName: 'Zuzalu City',
    projectId: '2ae588c8e2c83e087672119a2b42f330',
    walletConnectParameters: {
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '9999999',
        },
      },
    },
  },
);

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const selectedChain = isDev ? sepolia : mainnet;

const RPC_CONFIG = {
  [sepolia.id]: fallback(
    [http('https://eth-sepolia.reddio.com'), http('/api/rpc')],
    { retryCount: 3 },
  ),
  [mainnet.id]: fallback(
    [http('https://eth-mainnet.reddio.com'), http('/api/rpc')],
    { retryCount: 3 },
  ),
} as const;

export const config = createConfig({
  chains: [selectedChain],
  transports: {
    [sepolia.id]: RPC_CONFIG[sepolia.id],
    [mainnet.id]: RPC_CONFIG[mainnet.id],
  },
  connectors,
  ssr: true,
});

export const client = createPublicClient({
  chain: selectedChain,
  transport: RPC_CONFIG[selectedChain.id],
});

interface WalletProviderProps {
  children: ReactNode;
}

// Create a provider component
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
};
