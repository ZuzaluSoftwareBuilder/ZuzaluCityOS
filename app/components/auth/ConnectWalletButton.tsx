import { cn, Button } from '@heroui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Wallet } from '@phosphor-icons/react';
import { useAccount, useConnect } from 'wagmi';

export interface IConnectWalletButtonProps {
  isLoading?: boolean;
  onConnectClick?: () => void;
}

const ConnectWalletButton: React.FC<IConnectWalletButtonProps> = ({
  isLoading: externalLoading,
  onConnectClick,
}) => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, isConnecting } = useAccount();

  const isLoading = externalLoading || isConnecting;
  const showSigningMessage = externalLoading && isConnected && !isConnecting;

  const handleConnect = () => {
    if (onConnectClick) {
      onConnectClick();
    }

    if (showSigningMessage) {
      console.log('Already in signing process, not opening modal');
      return;
    }

    if (openConnectModal) {
      console.log('Opening connect modal');
      openConnectModal();
    } else {
      console.error('openConnectModal is not available');
    }
  };
  
  return (
    <Button
      className={cn(
        'w-full flex items-center gap-[10px] rounded-[8px] h-[40px]',
        'border border-[rgba(255,255,255,0.1)]',
        'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]',
        'text-white text-[14px] leading-[1.2] font-[500]',
      )}
      startContent={isLoading ? null : <Wallet size={20} weight={'fill'} format={'Stroke'} />}
      onPress={handleConnect}
      isLoading={isLoading}
    >
      {showSigningMessage ? 'Sign In Message' : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWalletButton;
