import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { Button, cn } from '@heroui/react';
import { Wallet } from '@phosphor-icons/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

export interface IConnectWalletButtonProps {
  isLoading?: boolean;
  authenticate: () => Promise<void>;
  onInitiateConnect: () => void;
}

const ConnectWalletButton: React.FC<IConnectWalletButtonProps> = ({
  isLoading: ceramicLoading,
  authenticate,
  onInitiateConnect,
}) => {
  const { isCheckingInitialAuth } = useAbstractAuthContext();
  const { openConnectModal } = useConnectModal();
  const { isConnected, isConnecting: wagmiConnecting } = useAccount();

  const isLoading = wagmiConnecting || ceramicLoading;

  const handleConnect = useCallback(async () => {
    if (!isConnected) {
      onInitiateConnect();
      if (openConnectModal) {
        openConnectModal();
      } else {
        console.error('openConnectModal is not available');
      }
    } else {
      try {
        await authenticate();
      } catch (error) {
        console.error('Error during authenticate call:', error);
      }
    }
  }, [isConnected, openConnectModal, authenticate, onInitiateConnect]);

  return (
    <Button
      className={cn(
        'w-full flex items-center gap-[10px] rounded-[8px] h-[40px]',
        'border border-[rgba(255,255,255,0.1)]',
        'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]',
        'text-white text-[14px] leading-[1.2] font-[500]',
      )}
      startContent={
        isLoading ? null : (
          <Wallet size={20} weight={'fill'} format={'Stroke'} />
        )
      }
      isDisabled={isCheckingInitialAuth || isLoading}
      onPress={handleConnect}
      isLoading={isLoading}
    >
      {isConnected
        ? ceramicLoading
          ? 'Signing In...'
          : 'Sign In Message'
        : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWalletButton;
