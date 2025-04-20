import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { PermissionName } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

export enum PermissionCheckType {
  /**
   * if check role, only owner/admin has permission by default
   */
  ROLE = 'role',
  SPECIFIC_PERMISSION = 'specific_permission',
  NONE = 'none',
}

export enum PermissionCheckStatus {
  CHECKING = 'checking',
  GRANTED = 'granted',
  DENIED = 'denied',
  WALLET_NOT_CONNECTED = 'wallet_not_connected',
}

export interface ICheckWalletPermissionConfig {
  permissionCheck: {
    type: PermissionCheckType;
    // when type is SPECIFIC_PERMISSION, permissionName is required
    permissionName?: PermissionName;
  };

  callbacks?: {
    onWalletNotConnected?: () => void;
    onNoPermission?: () => void;
  };
}

export interface IPermissionCheckResult {
  allChecksComplete: boolean;
  status: PermissionCheckStatus;
  hasPermission: boolean;
  details: {
    isWalletConnected: boolean;
    isAuthenticated: boolean;
    isOwner: boolean;
    isAdmin: boolean;
    isMember: boolean;
    checkType: PermissionCheckType;
    permissionName?: PermissionName;
  };
  utils: {
    checkSpecificPermission: (name: PermissionName) => boolean;
  };
}

/**
 * @example
 * // check if user is owner or admin
 * const { hasPermission } = useCheckWalletConnectAndSpacePermission({
 *   permissionCheck: { type: PermissionCheckType.ROLE },
 *   callbacks: { onNoPermission: () => router.push('/spaces/${spaceId}') }
 * });
 *
 * @example
 * // check if user has specific permission, e.g. CREATE_EVENTS
 * const { hasPermission } = useCheckWalletConnectAndSpacePermission({
 *   permissionCheck: {
 *     type: PermissionCheckType.SPECIFIC_PERMISSION,
 *     permissionName: PermissionName.CREATE_EVENTS
 *   },
 *   callbacks: { onNoPermission: () => router.push('/') }
 * });
 */
const useCheckWalletConnectAndSpacePermission = ({
  permissionCheck = { type: PermissionCheckType.ROLE },
  callbacks = {},
}: ICheckWalletPermissionConfig): IPermissionCheckResult => {
  const { isAuthenticated, profile } = useAbstractAuthContext();
  // TODO wait supabase update, confirm profile.id of space permission
  const profileId = profile?.id;
  const { isOwner, isAdmin, isMember, isLoading, checkPermission } =
    useSpacePermissions();
  const { isConnected, isConnecting, status: walletStatus } = useAccount();
  const { isSuccess, isError } = useWalletClient();
  const clientReady = isSuccess || isError;

  const { onNoPermission, onWalletNotConnected } = callbacks;

  const [checkStatus, setCheckStatus] = useState({
    walletChecked: false,
    permissionChecked: false,
  });

  const [hasPermission, setHasPermission] = useState(false);

  const allChecksComplete = useMemo(() => {
    return checkStatus.walletChecked && checkStatus.permissionChecked;
  }, [checkStatus]);

  const currentStatus = useMemo((): PermissionCheckStatus => {
    if (!isConnected && clientReady) {
      return PermissionCheckStatus.WALLET_NOT_CONNECTED;
    }

    if (!allChecksComplete) {
      return PermissionCheckStatus.CHECKING;
    }

    return hasPermission
      ? PermissionCheckStatus.GRANTED
      : PermissionCheckStatus.DENIED;
  }, [isConnected, clientReady, allChecksComplete, hasPermission]);

  useEffect(() => {
    if (typeof walletStatus !== 'undefined') {
      if (
        (walletStatus === 'connected' || walletStatus === 'disconnected') &&
        !checkStatus.walletChecked
      ) {
        console.log('wallet status confirmed:', walletStatus);
        setCheckStatus((prev) => ({ ...prev, walletChecked: true }));
      }
    } else if (!isConnecting && !checkStatus.walletChecked) {
      console.log('wallet status confirmed:', isConnected);
      setCheckStatus((prev) => ({ ...prev, walletChecked: true }));
    }
  }, [walletStatus, isConnecting, isConnected, checkStatus.walletChecked]);

  useEffect(() => {
    if (!isLoading && !!profileId && !checkStatus.permissionChecked) {
      switch (permissionCheck.type) {
        case PermissionCheckType.SPECIFIC_PERMISSION:
          if (permissionCheck.permissionName) {
            const hasSpecificPermission = checkPermission(
              permissionCheck.permissionName,
            );
            setHasPermission(hasSpecificPermission);
          } else {
            console.warn(
              'permissionName is required when using SPECIFIC_PERMISSION type',
            );
            setHasPermission(false);
          }
          break;

        case PermissionCheckType.ROLE:
          setHasPermission(isOwner || isAdmin);
          break;

        case PermissionCheckType.NONE:
          setHasPermission(true);
          break;

        default:
          setHasPermission(false);
      }

      setCheckStatus((prev) => ({ ...prev, permissionChecked: true }));
    }
  }, [
    profileId,
    isLoading,
    isOwner,
    isAdmin,
    checkPermission,
    permissionCheck,
    checkStatus.permissionChecked,
  ]);

  useEffect(() => {
    if (!isConnected && clientReady) {
      console.log('user is not connected');
      onWalletNotConnected?.() || onNoPermission?.();
      return;
    }

    if (!allChecksComplete) {
      return;
    }

    console.log('all checks complete');

    if (isAuthenticated && !hasPermission) {
      console.log(
        'user is authenticated but does not have required permissions',
      );
      onNoPermission?.();
    }
  }, [
    allChecksComplete,
    isConnected,
    isAuthenticated,
    hasPermission,
    onNoPermission,
    onWalletNotConnected,
    checkStatus.walletChecked,
    clientReady,
  ]);

  return {
    allChecksComplete,
    status: currentStatus,
    hasPermission,
    details: {
      isAuthenticated,
      isOwner,
      isAdmin,
      isMember,
      isWalletConnected: isConnected,
      checkType: permissionCheck.type,
      permissionName:
        permissionCheck.type === PermissionCheckType.SPECIFIC_PERMISSION
          ? permissionCheck.permissionName
          : undefined,
    },
    utils: {
      checkSpecificPermission: checkPermission,
    },
  };
};

export default useCheckWalletConnectAndSpacePermission;
