import { ceramic, composeClient } from '@/constant';
import {
  StorageKey_CeramicEthDid,
  StorageKey_DisplayDid,
  StorageKey_LoggedIn,
  StorageKey_Username,
} from '@/constant/StorageKey';
import { useLitContext } from '@/context/LitContext';
import { config } from '@/context/WalletContext';
import {
  CREATE_PROFILE_MUTATION,
  GET_OWN_PROFILE_QUERY,
} from '@/services/graphql/profile';
import { AuthStatus, CeramicAuthContext, ConnectSource } from '@/types/auth';
import { Nullable } from '@/types/common';
import { Profile } from '@/types/index.js';
import { executeQuery } from '@/utils/ceramic';
import { authenticateCeramic } from '@/utils/ceramicAuth';
import {
  safeGetLocalStorage,
  safeRemoveLocalStorage,
  safeSetLocalStorage,
} from '@/utils/localStorage';
import { getWalletAddressFromProfile } from '@/utils/profile';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { getAccount } from 'wagmi/actions';

export const CreateProfileErrorPrefix = '[Create Profile Failed]';

const CeramicContext = createContext<CeramicAuthContext>({
  ceramic,
  composeClient,
  authStatus: 'idle',
  isCheckingInitialAuth: true,
  isAuthenticated: false,
  authenticate: async () => {},
  username: '',
  profile: null,
  newUser: false,
  logout: async () => {},
  performFullLogoutAndReload: async () => {},
  isAuthPromptVisible: false,
  showAuthPrompt: async () => {},
  hideAuthPrompt: async () => {},
  createProfile: async (newName: string) => {},
  getProfile: async () => null,
  connectSource: 'invalidAction',
  setConnectSource: () => {},
  authError: null,
  isAuthenticating: false,
  isFetchingProfile: false,
  isCreatingProfile: false,
});

export const CeramicProvider = ({ children }: any) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [isAuthPromptVisible, setAuthPromptVisible] = useState(false);
  const [username, setUsername] = useState<Nullable<string>>(null);
  const [profile, setProfile] = useState<Nullable<Profile>>(null);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [connectSource, setConnectSource] =
    useState<ConnectSource>('invalidAction');
  const [authError, setAuthError] = useState<Nullable<string>>(null);
  const [isCheckingInitialAuth, setIsCheckingInitialAuth] = useState(true);
  const isAuthenticated = authStatus === 'authenticated';
  const isAuthenticating = authStatus === 'authenticating';
  const isFetchingProfile = authStatus === 'fetching_profile';
  const isCreatingProfile = authStatus === 'creating_profile';

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { litDisconnect } = useLitContext();
  const prevIsConnectedRef = useRef<boolean | undefined>();

  useEffect(() => {
    const checkInitialAuth = async () => {
      const did = safeGetLocalStorage(StorageKey_CeramicEthDid);
      if (did) {
        setAuthStatus('authenticating');
        try {
          await authenticateCeramic(ceramic, composeClient);
          await getProfile();
        } catch (error: any) {
          console.error('[CeramicContext] Initial auth check failed:', error);
          setAuthError(
            `Auto sign-in failed: ${error.message || 'Please try again'}`,
          );
          setAuthStatus('error');
        }
      } else {
        setAuthStatus('idle');
      }
      setIsCheckingInitialAuth(false);
    };
    checkInitialAuth();
  }, []);

  const logout = useCallback(async () => {
    safeRemoveLocalStorage(StorageKey_Username);
    safeRemoveLocalStorage(StorageKey_CeramicEthDid);
    safeRemoveLocalStorage(StorageKey_DisplayDid);
    safeRemoveLocalStorage(StorageKey_LoggedIn);

    setUsername(null);
    setProfile(null);
    setNewUser(false);
    setAuthError(null);
    setAuthStatus('idle');
    setAuthPromptVisible(false);
  }, []);

  const performFullLogoutAndReload = useCallback(async () => {
    try {
      await disconnectAsync();
      await logout();
      litDisconnect();
    } catch (error) {
      console.error(
        '[CeramicContext] Error during disconnect operations in performFullLogoutAndReload:',
        error,
      );
    } finally {
      window.location.reload();
    }
  }, [disconnectAsync, litDisconnect, logout]);

  useEffect(() => {
    if (
      !!prevIsConnectedRef.current &&
      !isConnected &&
      authStatus === 'authenticated'
    ) {
      console.warn(
        '[CeramicContext] External disconnection detected, performing full logout and reload.',
      );
      performFullLogoutAndReload().catch((error) => {
        console.error(
          '[CeramicContext] Error during performFullLogoutAndReload after external disconnect:',
          error,
        );
      });
    }
    prevIsConnectedRef.current = isConnected;
  }, [isConnected, authStatus, performFullLogoutAndReload]);

  const getProfile = useCallback(async (): Promise<Nullable<Profile>> => {
    if (!ceramic.did) {
      setAuthStatus('error');
      setAuthError(
        'Cannot fetch profile, please connect wallet and authenticate.',
      );
      throw new Error(
        'Cannot fetch profile, please connect wallet and authenticate.',
      );
    }
    setAuthStatus('fetching_profile');
    setAuthError(null);
    try {
      const result: any = await executeQuery(GET_OWN_PROFILE_QUERY);
      const basicProfile: Profile | undefined =
        result?.data?.viewer?.zucityProfile;

      if (basicProfile?.id) {
        safeSetLocalStorage(StorageKey_Username, basicProfile.username);
        setProfile({
          ...basicProfile,
          did: basicProfile.author?.id || '',
          address: getWalletAddressFromProfile(basicProfile),
        });
        setUsername(basicProfile.username);
        setNewUser(false);
        setAuthStatus('authenticated');
        return basicProfile;
      } else {
        setUsername(null);
        setProfile(null);
        safeRemoveLocalStorage(StorageKey_Username);
        setNewUser(true);
        setAuthStatus('authenticated');
        return null;
      }
    } catch (error: any) {
      console.error(
        '[CeramicContext] getProfile: Error fetching profile:',
        error,
      );
      const errorMessage = `Failed to fetch profile: ${error.message || 'Please try again later'}`;
      setAuthError(errorMessage);
      setAuthStatus('error');
      throw new Error(errorMessage);
    }
  }, []);

  const authenticate = useCallback(async () => {
    if (authStatus === 'authenticating' || authStatus === 'authenticated') {
      return;
    }
    setAuthStatus('authenticating');
    setAuthError(null);
    try {
      await authenticateCeramic(ceramic, composeClient);
      await getProfile();
    } catch (error: any) {
      console.error('[CeramicContext] Authentication failed:', error);
      const errorMessageLower = error.message?.toLowerCase() || '';
      const userDenied =
        errorMessageLower.includes('user denied request signature') ||
        errorMessageLower.includes('user rejected') ||
        errorMessageLower.includes('cancelled') ||
        errorMessageLower.includes('canceled');

      if (userDenied) {
        setAuthError(null);
        setAuthStatus('idle');
        throw new Error('[CeramicContext] User denied signature or cancelled.');
      } else {
        const errorMessage = `Authentication failed: ${error.message || 'Please check wallet connection and try again'}`;
        setAuthError(errorMessage);
        setAuthStatus('error');
        throw new Error(errorMessage);
      }
    }
  }, [authStatus, getProfile]);

  const createProfile = useCallback(
    async (newName: string) => {
      const { address } = getAccount(config);
      if (!ceramic.did || !newName || !address) {
        const errorMsg = `${CreateProfileErrorPrefix} Invalid user info or wallet address, cannot create profile.'`;
        console.error(errorMsg);
        setAuthError(errorMsg);
        setAuthStatus('error');
        throw new Error(errorMsg);
      }
      setAuthStatus('creating_profile');
      setAuthError(null);
      try {
        const update = await executeQuery(CREATE_PROFILE_MUTATION, {
          input: {
            content: {
              username: newName,
              address: address.toString().toLowerCase(),
            },
          },
        });

        if (!update.data || update.errors) {
          console.error(
            '[CeramicContext] createProfile: Error creating profile (GraphQL):',
            update.errors,
          );
          const errorMessage = `${CreateProfileErrorPrefix}: ${update.errors[0]?.message || 'Please try again'}`;
          setAuthError(errorMessage);
          setAuthStatus('error');
          throw new Error(errorMessage);
        } else {
          await getProfile();
        }
      } catch (error: any) {
        console.error(
          '[CeramicContext] createProfile: Error creating profile (Network/Other):',
          error,
        );
        const errorMessage = `${error.message || 'Please try again later'}`;
        setAuthError(errorMessage);
        setAuthStatus('error');
        throw new Error(errorMessage);
      }
    },
    [getProfile],
  );

  const hideAuthPrompt = useCallback(async () => {
    setAuthPromptVisible(false);
  }, []);

  const showAuthPrompt = useCallback(
    async (source: ConnectSource = 'invalidAction') => {
      if (isConnected) {
        await disconnectAsync();
      }
      setConnectSource(source);
      setAuthPromptVisible(true);
    },
    [disconnectAsync, isConnected],
  );

  return (
    <CeramicContext.Provider
      value={{
        ceramic,
        composeClient,
        authStatus,
        isCheckingInitialAuth,
        isAuthenticated,
        authenticate,
        username,
        profile,
        newUser,
        logout,
        performFullLogoutAndReload,
        isAuthPromptVisible,
        showAuthPrompt,
        hideAuthPrompt,
        createProfile,
        getProfile,
        connectSource,
        setConnectSource,
        authError,
        isAuthenticating,
        isFetchingProfile,
        isCreatingProfile,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export default CeramicContext;
export const useCeramicContext = () => useContext(CeramicContext);
