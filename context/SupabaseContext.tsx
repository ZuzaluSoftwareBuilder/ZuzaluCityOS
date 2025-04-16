import {
  StorageKey_SupabaseAuthPending,
  StorageKey_Username,
} from '@/constant/StorageKey';
import { CreateProfileErrorPrefix } from '@/context/CeramicContext';
import { useLitContext } from '@/context/LitContext';
import { checkRegistration, getNonce, verify } from '@/services/auth';
import { AuthStatus, ConnectSource, SupabaseAuthContext } from '@/types/auth';
import { Profile } from '@/types/index.js';
import { isUserDenied } from '@/utils/handleError';
import {
  safeGetLocalStorage,
  safeRemoveLocalStorage,
  safeSetLocalStorage,
} from '@/utils/localStorage';
import { supabase } from '@/utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

const SupabaseContext = createContext<SupabaseAuthContext>({
  supabase,
  session: null,
  user: null,
  authStatus: 'idle',
  isCheckingInitialAuth: true,
  isAuthenticated: false,
  authenticate: async () => {},
  username: undefined,
  profile: undefined,
  newUser: undefined,
  logout: async () => {},
  performFullLogoutAndReload: async () => {},
  isAuthPromptVisible: false,
  showAuthPrompt: async () => {},
  hideAuthPrompt: async () => {},
  createProfile: async () => {},
  getProfile: async () => null,
  connectSource: 'invalidAction',
  setConnectSource: () => {},
  authError: null,
  isAuthenticating: false,
  isFetchingProfile: false,
  isCreatingProfile: false,
});

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
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

  const { address, isConnected } = useAccount();
  const { litDisconnect } = useLitContext();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const prevIsConnectedRef = useRef<boolean | undefined>();

  const [nonce, setNonce] = useState<string>('');
  const [signature, setSignature] = useState<string>('');

  const handleAndThrowError = (
    message: string,
    throwError = true,
    resetToIdle?: boolean,
  ) => {
    const errorMessage = `[SupabaseContext] ${message}`;
    setAuthStatus(resetToIdle ? 'idle' : 'error');
    setAuthError(resetToIdle ? null : errorMessage);
    if (!throwError) return null;
    throw new Error(errorMessage);
  };

  const getMessageToSign = (nonce: string) => {
    return `Please sign this message to log in or register.\n\nNonce: ${nonce}`;
  };

  const getProfileFromSupabase = useCallback(
    async (userId: string): Promise<Profile | null> => {
      if (!userId) {
        handleAndThrowError(
          'Cannot fetch profile.userId, please connect wallet and authenticate.',
          false,
        );
        return null;
      }
      setAuthStatus('fetching_profile');
      setAuthError(null);
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profile) {
          safeSetLocalStorage(StorageKey_Username, profile.username);
          setProfile({
            id: profile.user_id,
            username: profile.username,
            avatar: profile.avatar,
          });
          setUsername(profile.username);
          setNewUser(false);
          setAuthStatus('authenticated');
          return {
            ...profile,
            id: profile.user_id,
            username: profile.username,
          };
        } else {
          setUsername(undefined);
          setProfile(undefined);
          safeRemoveLocalStorage(StorageKey_Username);
          setNewUser(true);
          setAuthStatus('authenticated');
          return null;
        }
      } catch (error: any) {
        handleAndThrowError(
          `Failed to fetch profile: ${error.message || 'Please try again later'}`,
        );
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const checkInitialAuth = async () => {
      setIsCheckingInitialAuth(true);
      setAuthStatus('authenticating');
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();
        console.log(
          '[SupabaseContext] checkInitialAuth getSession:',
          currentSession,
        );

        if (error) {
          console.error('[SupabaseContext] Error getting session:', error);
          throw new Error(
            `[SupabaseContext] Get Session Failed: ${error.message}`,
          );
        }

        if (currentSession) {
          setSession(currentSession);
          setSupabaseUser(currentSession.user);
          await getProfileFromSupabase(currentSession.user.id);
        } else {
          resetAuthState();
        }
      } catch (error: any) {
        console.error('[SupabaseContext] Initial auth check failed:', error);
        resetAuthState();
      } finally {
        setIsCheckingInitialAuth(false);
      }
    };
    checkInitialAuth();
  }, []);

  const resetAuthState = useCallback(() => {
    safeRemoveLocalStorage(StorageKey_Username);
    setSession(null);
    setSupabaseUser(null);

    setUsername(undefined);
    setProfile(undefined);
    setNewUser(undefined);
    setAuthError(null);
    setAuthStatus('idle');
    setAuthPromptVisible(false);
  }, []);

  const logout = useCallback(async () => {
    setAuthStatus('authenticating');
    await supabase.auth.signOut();
    resetAuthState();
  }, [resetAuthState]);

  const performFullLogoutAndReload = useCallback(async () => {
    try {
      await disconnectAsync();
      await logout();
      litDisconnect();
    } catch (error) {
      console.error(
        '[SupabaseContext] Error during disconnect operations in performFullLogoutAndReload:',
        error,
      );
    } finally {
      window.location.reload();
    }
  }, [disconnectAsync, litDisconnect, logout]);

  useEffect(() => {
    if (
      prevIsConnectedRef.current === true &&
      !isConnected &&
      authStatus === 'authenticated'
    ) {
      console.warn(
        '[SupabaseContext] Wallet disconnected externally. Performing full logout.',
      );
      performFullLogoutAndReload().catch((error) => {
        console.error(
          '[SupabaseContext] Error during performFullLogoutAndReload after external disconnect:',
          error,
        );
      });
    }
    prevIsConnectedRef.current = isConnected;
  }, [isConnected, performFullLogoutAndReload, authStatus]);

  const authenticate = useCallback(async () => {
    if (!isConnected || !address) {
      handleAndThrowError('Wallet not connected, cannot authenticate.', false);
      return;
    }
    if (authStatus === 'authenticating' || authStatus === 'authenticated') {
      return;
    }

    safeSetLocalStorage(StorageKey_SupabaseAuthPending, '1');
    setAuthStatus('authenticating');
    setAuthError(null);
    setNewUser(undefined);

    try {
      setAuthStatus('authenticating');
      const [currentNonce, isRegistration] = await Promise.all([
        getNonce(address),
        checkRegistration(address),
      ]);
      setNonce(currentNonce);
      if (!currentNonce) {
        handleAndThrowError('Nonce not found');
      }
      const messageToSign = getMessageToSign(currentNonce);
      const signature = await signMessageAsync({ message: messageToSign });
      setSignature(signature);

      if (!isRegistration) {
        setUsername(undefined);
        setProfile(undefined);
        safeRemoveLocalStorage(StorageKey_Username);
        setNewUser(true);
        setAuthStatus('authenticated');
        return;
      }

      const { token } = await verify({
        address,
        message: messageToSign,
        signature,
      });
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      if (error) {
        handleAndThrowError(error.message || 'VerifyOtp failed');
      } else {
        setSession(data.session);
        setSupabaseUser(data.user);
        await getProfileFromSupabase(data.user?.id!);
      }
    } catch (error: any) {
      if (isUserDenied(error)) {
        handleAndThrowError('User denied signature or cancelled.', true, true);
      } else {
        const backendError = error.response?.data?.error;
        const errorMessage =
          backendError || error.message || 'Please try again';
        handleAndThrowError(errorMessage);
      }
    } finally {
      safeRemoveLocalStorage(StorageKey_SupabaseAuthPending);
    }
  }, [
    isConnected,
    address,
    authStatus,
    signMessageAsync,
    getProfileFromSupabase,
  ]);

  const createProfile = useCallback(
    async (newUsername: string) => {
      if (!address) {
        handleAndThrowError(
          `${CreateProfileErrorPrefix} Invalid user info or wallet address, cannot create profile.`,
        );
      }

      setAuthStatus('creating_profile');
      setAuthError(null);

      try {
        const { token } = await verify({
          address: address!,
          message: getMessageToSign(nonce),
          signature,
          username: newUsername || '',
        });
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          handleAndThrowError(
            `${CreateProfileErrorPrefix}: ${error.message || 'Please try again'}`,
          );
        }

        setSession(data.session);
        setSupabaseUser(data.user);
        await getProfileFromSupabase(data.user?.id!);
      } catch (error: any) {
        handleAndThrowError(
          `${CreateProfileErrorPrefix}: ${error.message || 'Please try again'}`,
        );
      }
    },
    [address, nonce, signature, getProfileFromSupabase],
  );

  const getProfile = useCallback(async (): Promise<Profile | null> => {
    if (!supabaseUser?.id) {
      console.warn(
        '[SupabaseContext] getProfile called but user is not authenticated.',
      );
      return null;
    }
    return getProfileFromSupabase(supabaseUser.id);
  }, [supabaseUser, getProfileFromSupabase]);

  const hideAuthPrompt = useCallback(async () => {
    setAuthPromptVisible(false);
    if (authStatus === 'error') {
      resetAuthState();
    }
  }, [authStatus, resetAuthState]);

  const showAuthPrompt = useCallback(
    async (source: ConnectSource = 'invalidAction') => {
      if (safeGetLocalStorage(StorageKey_SupabaseAuthPending)) {
        await disconnectAsync();
        safeRemoveLocalStorage(StorageKey_SupabaseAuthPending);
      }
      setConnectSource(source);
      setAuthPromptVisible(true);
      if (authStatus === 'error') {
        resetAuthState();
      }
    },
    [disconnectAsync, authStatus, resetAuthState],
  );

  const contextValue: SupabaseAuthContext = {
    supabase,
    session,
    user: supabaseUser,
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
  };

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseContext = (): SupabaseAuthContext => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error(
      'useSupabaseContext must be used within a SupabaseProvider',
    );
  }
  return context;
};
