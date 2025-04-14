import { ceramic, composeClient } from '@/constant';
import {
  StorageKey_CeramicEthDid,
  StorageKey_DisplayDid,
  StorageKey_LoggedIn,
  StorageKey_Username,
} from '@/constant/StorageKey';
import { config } from '@/context/WalletContext';
import {
  CREATE_PROFILE_MUTATION,
  GET_OWN_PROFILE_QUERY,
} from '@/services/graphql/profile';
import { Profile } from '@/types/index.js';
import { executeQuery } from '@/utils/ceramic';
import { authenticateCeramic } from '@/utils/ceramicAuth';
import {
  safeGetLocalStorage,
  safeRemoveLocalStorage,
  safeSetLocalStorage,
} from '@/utils/localStorage';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getAccount } from 'wagmi/actions';

type ConnectSource = 'connectButton' | 'invalidAction';
type AuthStatus =
  | 'idle'
  | 'authenticating'
  | 'fetching_profile'
  | 'creating_profile'
  | 'authenticated'
  | 'error';

export const CreateProfileErrorPrefix = '[Create Profile Failed]';

interface CeramicContextType {
  ceramic: CeramicClient;
  composeClient: ComposeClient;
  authStatus: AuthStatus;
  isCheckingInitialAuth: boolean;
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  username: string | undefined;
  profile: Profile | undefined;
  newUser: boolean | undefined;
  logout: () => void;
  isAuthPromptVisible: boolean;
  showAuthPrompt: (source?: ConnectSource) => void;
  hideAuthPrompt: () => void;
  createProfile: (newName: string) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
  connectSource: ConnectSource;
  setConnectSource: (source: ConnectSource) => void;
  authError: string | null;
  isAuthenticating: boolean;
  isFetchingProfile: boolean;
  isCreatingProfile: boolean;
}

const CeramicContext = createContext<CeramicContextType>({
  ceramic,
  composeClient,
  authStatus: 'idle',
  isCheckingInitialAuth: true,
  isAuthenticated: false,
  authenticate: async () => {},
  username: undefined,
  profile: undefined,
  newUser: undefined,
  logout: () => {},
  isAuthPromptVisible: false,
  showAuthPrompt: () => {},
  hideAuthPrompt: () => {},
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
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean | undefined>(undefined);
  const [connectSource, setConnectSource] =
    useState<ConnectSource>('invalidAction');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingInitialAuth, setIsCheckingInitialAuth] = useState(true);
  const isAuthenticated = authStatus === 'authenticated';
  const isAuthenticating = authStatus === 'authenticating';
  const isFetchingProfile = authStatus === 'fetching_profile';
  const isCreatingProfile = authStatus === 'creating_profile';

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

  const getProfile = useCallback(async (): Promise<Profile | null> => {
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
        setProfile(basicProfile);
        setUsername(basicProfile.username);
        setNewUser(false);
        setAuthStatus('authenticated');
        return basicProfile;
      } else {
        setUsername(undefined);
        setProfile(undefined);
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
      const userDeniedSignature = error.message
        ?.toLowerCase()
        .includes('user denied request signature');

      if (userDeniedSignature) {
        setAuthError(null);
        setAuthStatus('idle');
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

  const showAuthPrompt = useCallback(
    (source: ConnectSource = 'invalidAction') => {
      setConnectSource(source);
      setAuthPromptVisible(true);
    },
    [],
  );

  const hideAuthPrompt = useCallback(() => {
    setAuthPromptVisible(false);
  }, []);

  const logout = useCallback(() => {
    safeRemoveLocalStorage(StorageKey_Username);
    safeRemoveLocalStorage(StorageKey_CeramicEthDid);
    safeRemoveLocalStorage(StorageKey_DisplayDid);
    safeRemoveLocalStorage(StorageKey_LoggedIn);

    setUsername(undefined);
    setProfile(undefined);
    setNewUser(undefined);
    setAuthError(null);
    setAuthStatus('idle');
    setAuthPromptVisible(false);
  }, []);

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
