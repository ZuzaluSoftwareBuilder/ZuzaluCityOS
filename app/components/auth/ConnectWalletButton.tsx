import { cn, Button } from "@heroui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Wallet} from '@phosphor-icons/react';

const ConnectWalletButton: React.FC = () => {
    const { openConnectModal } = useConnectModal();
    return (
        <Button
            className={cn(
                'w-full flex items-center gap-[10px] rounded-[8px] h-[40px]',
                'border border-[rgba(255,255,255,0.1)]',
                'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]',
                'text-white text-[14px] leading-[1.2] font-[500]'
            )}
            startContent={<Wallet size={20} weight={'fill'} format={'Stroke'} />}
            onPress={openConnectModal}
        >
            Connect Wallet
        </Button>
    );
};

export default ConnectWalletButton;