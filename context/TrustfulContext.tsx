/* eslint-disable no-unused-vars */
import { GiveBadgeStepAddress } from '@/app/spaces/[spaceid]/trustful/components/GiveBadge';
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from 'react';
import { Address } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { scroll, scrollSepolia } from 'viem/chains';
import {
  isDev,
  Role,
  ROLES,
  spaceIdValue,
  TRUSTFUL_SCHEMAS,
} from '@/app/spaces/[spaceid]/trustful/constants/constants';
import {
  getAllAttestationTitles,
  getAllEventsBySpaceId,
  getSession,
  getUserRole,
  hasRole,
} from '@/app/spaces/[spaceid]/trustful/service';
import { EthereumAddress } from '@/app/spaces/[spaceid]/trustful/utils/types';
// import toast from 'react-hot-toast';
import { getSpace } from '@/app/spaces/[spaceid]/trustful/service/backend/getSpace';
import toast from 'react-hot-toast';

interface User {
  address: Address;
  role: Role;
}

interface Schema {
  index: string;
  id: string;
}

enum BadgeStatus {
  DEFAULT = 'Default',
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
}

export interface Badge {
  id: string;
  title: string;
  status: BadgeStatus;
  comment?: string;
  timeCreated: number;
  attester: string;
  recipient: string;
  txid: string;
  schema: Schema;
  revoked: boolean;
  responseId?: string;
}

interface TrustfulContextType {
  setUserRole: Dispatch<SetStateAction<User | null>>;
  userRole: User | null;

  /**BadgeContext */
  selectedBadge: Badge | null;
  setSelectedBadge: Dispatch<SetStateAction<Badge | null>>;

  /**GiveBadgeContext */
  badgeInputAddress: null | EthereumAddress; // TODO: Allowing EthereumAddress here also, Check this after
  setBadgeInputAddress: Dispatch<SetStateAction<null | EthereumAddress>>;
  addressStep: GiveBadgeStepAddress;
  setAddressStep: Dispatch<SetStateAction<GiveBadgeStepAddress>>;
  inputBadgeTitleList: string[] | null;
  setInputBadgeTitleList: Dispatch<SetStateAction<string[] | null>>;
  newTitleAdded: boolean;
  setNewTitleAdded: Dispatch<SetStateAction<boolean>>;
}

const defaultContextValue: TrustfulContextType = {
  userRole: null,
  setUserRole: () => {},

  /**BadgeContext */
  selectedBadge: null,
  setSelectedBadge: () => {},

  /**GiveBadgeContext */
  badgeInputAddress: null,
  setBadgeInputAddress: () => {},
  addressStep: GiveBadgeStepAddress.INSERT_ADDRESS,
  setAddressStep: () => {},
  inputBadgeTitleList: null,
  setInputBadgeTitleList: () => {},
  newTitleAdded: false,
  setNewTitleAdded: () => {},
};

const TrustfulContext = createContext<TrustfulContextType>(defaultContextValue);

interface TrustfulContextProviderProps {
  children: ReactNode;
}

export const TrustfulContextProvider: React.FC<
  TrustfulContextProviderProps
> = ({ children }) => {
  const [userRole, setUserRole] = useState<User | null>(null);

  /**BadgeContext */
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  /**GiveBadgeContext */
  const [badgeInputAddress, setBadgeInputAddress] =
    useState<null | EthereumAddress>(null);
  const [addressStep, setAddressStep] = useState<GiveBadgeStepAddress>(
    GiveBadgeStepAddress.INSERT_ADDRESS,
  );
  const [inputBadgeTitleList, setInputBadgeTitleList] = useState<
    string[] | null
  >(null);
  const [newTitleAdded, setNewTitleAdded] = useState<boolean>(false);

  const handleBadgeDropdown = async () => {
    if (!address) {
      // toast.error('No account connected. Please connect your wallet.');
      // toast.error(
      //   <span className="flex flex-col">
      //     <strong>No account connected.</strong> <p>Please connect your wallet.</p>
      //   </span>,
      // );
      return;
    }

    if (isDev ? chainId !== scrollSepolia.id : chainId !== scroll.id) {
      // toast.error(
      //   `Unsupported network. Please switch to the ${isDev ? 'Scroll Sepolia' : 'Scroll'} network.`,
      // );
      switchChain({ chainId: isDev ? scrollSepolia.id : scroll.id });
      return;
    }

    const filteredBadges: string[] | Error = await getAllAttestationTitles();

    if (filteredBadges instanceof Error || !filteredBadges) {
      // toast.error(
      //   'Error Read Contract.Error while reading badge titles from the blockchain.',
      // );
      return;
    }

    if (userRole?.role === Role.ROOT || userRole?.role === Role.MANAGER) {
      filteredBadges.push('Manager');
    }

    if (userRole?.address === TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.allowedRole[0]) {
      filteredBadges.push('Check-in');
      filteredBadges.push('Check-out');
    }

    await Promise.all(filteredBadges);

    setInputBadgeTitleList(filteredBadges.sort());
  };

  const TrustfulContextData = useMemo(
    () => ({
      userRole,
      setUserRole,
      selectedBadge,
      setSelectedBadge,
      badgeInputAddress,
      setBadgeInputAddress,
      addressStep,
      setAddressStep,
      inputBadgeTitleList,
      setInputBadgeTitleList,
      newTitleAdded,
      setNewTitleAdded,
    }),
    [
      userRole,
      selectedBadge,
      badgeInputAddress,
      addressStep,
      inputBadgeTitleList,
      newTitleAdded,
    ],
  );

  const { switchChain } = useSwitchChain();
  const { chainId, address } = useAccount();

  useEffect(() => {
    const fetchUserRoleByContract = async () => {
      const isRoot = await hasRole(ROLES.ROOT, address as Address);
      if (isRoot) {
        setUserRole({
          address: address as Address,
          role: Role.ROOT,
        });
        return;
      }
      const isManager = await hasRole(ROLES.MANAGER, address as Address);
      if (isManager) {
        setUserRole({
          address: address as Address,
          role: Role.MANAGER,
        });
        return;
      }
      const isVillager = await hasRole(ROLES.VILLAGER, address as Address);
      if (isVillager) {
        setUserRole({
          address: address as Address,
          role: Role.VILLAGER,
        });
        return;
      }
    };

    const fetchUserRole = async () => {
      if (address) {
        try {
          const getUserRoleByEndpoint = await getUserRole(address as Address);
          if (getUserRoleByEndpoint && getUserRoleByEndpoint?.role) {
            setUserRole({
              address: address as Address,
              role: getUserRoleByEndpoint.role,
            });
            return;
          }
        } catch (error) {
          console.error('Failed to fetch user role from endpoint:', error);
          await fetchUserRoleByContract();
        }
      }
    };

    fetchUserRole();
  }, [address, chainId]);

  useEffect(() => {
    handleBadgeDropdown();

    const fetchAllEvents = async () => {
      try {
        const spaces = await getSpace({ userAddress: address as Address });
        const spaceIds = spaces && spaces.map((space) => space.spaceId);

        if (spaceIds) {
          for (const spaceId of spaceIds) {
            const events = await getAllEventsBySpaceId({
              spaceId: spaceIdValue,
              userAddress: address as Address,
            });

            if (events && events.length > 0) {
              events.map(async (event) => {
                const sessions = await getSession({
                  eventid: event.eventId,
                  userAddress: address as Address,
                });
                if (sessions) {
                  sessions.sessions.forEach((session) => {
                    if (
                      address &&
                      session.hostAddress &&
                      session.hostAddress.toLowerCase() ==
                        address?.toLowerCase()
                    ) {
                      // Add host badge
                      const hostBadgeTitle = `host_${session.name}`;
                      const attendeeBadgeTitle = `attendee_${session.name}`;
                      setInputBadgeTitleList((prevList) => [
                        ...(prevList || []),
                        hostBadgeTitle,
                        attendeeBadgeTitle,
                      ]);
                    }
                  });
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('error', error);
      }
    };
    fetchAllEvents();
  }, [address]);

  return (
    <TrustfulContext.Provider value={TrustfulContextData}>
      {children}
    </TrustfulContext.Provider>
  );
};

export const useTrustful = (): TrustfulContextType => {
  const context = useContext(TrustfulContext);
  if (context === undefined) {
    throw new Error('useTrustful must be used within a TrustfulContext');
  }
  return context;
};
