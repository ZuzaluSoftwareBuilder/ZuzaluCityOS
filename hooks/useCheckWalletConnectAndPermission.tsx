import { useCeramicContext } from '@/context/CeramicContext';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { useRouter } from 'next/navigation';

export interface IProps {
  spaceId: string;
  noPermissionCallback: () => void;
}

const useCheckWalletConnectAndPermission = ({ spaceId }: IProps) => {
  const router = useRouter();
  const { isAuthenticated } = useCeramicContext();
  const { isOwner, isAdmin, isLoading } = useSpacePermissions();
  const { isConnected, isConnecting, status } = useAccount();

  const [checkStatus, setCheckStatus] = useState({
    walletChecked: false,
    permissionChecked: false,
  });

  const allChecksComplete =
    checkStatus.walletChecked && checkStatus.permissionChecked;

  useEffect(() => {
    if (typeof status !== 'undefined') {
      if (
        (status === 'connected' || status === 'disconnected') &&
        !checkStatus.walletChecked
      ) {
        console.log('wallet status confirmed:', status);
        setCheckStatus((prev) => ({ ...prev, walletChecked: true }));
      }
    } else if (!isConnecting && !checkStatus.walletChecked) {
      console.log('wallet status confirmed:', isConnected);
      setCheckStatus((prev) => ({ ...prev, walletChecked: true }));
    }
  }, [status, isConnecting, isConnected, checkStatus.walletChecked]);

  useEffect(() => {
    if (!isLoading && !checkStatus.permissionChecked) {
      setCheckStatus((prev) => ({ ...prev, permissionChecked: true }));
    }
  }, [isLoading, isOwner, isAdmin, checkStatus.permissionChecked]);

  useEffect(() => {
    if (!allChecksComplete) {
      return;
    }

    console.log('all checks complete');

    if (!isConnected) {
      console.log('user is not connected, redirect to home');
      router.push(`/spaces`);
      return;
    }

    if (isAuthenticated && !isOwner && !isAdmin) {
      console.log(
        'user is authenticated but not owner or admin, redirect to home',
      );
      router.push(`/spaces`);
    }
  }, [
    allChecksComplete,
    isConnected,
    isAuthenticated,
    isOwner,
    isAdmin,
    router,
    spaceId,
  ]);

  return {
    isAuthenticated,
    isOwner,
    isAdmin,
    isConnected,
    checkStatus,
    allChecksComplete,
  };
};

export default useCheckWalletConnectAndPermission;
