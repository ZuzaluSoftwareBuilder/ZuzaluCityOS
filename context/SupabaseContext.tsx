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

const initialContext: SupabaseAuthContext = {
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
};

const SupabaseContext = createContext<SupabaseAuthContext>(initialContext);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState({
    status: 'idle' as AuthStatus,
    error: null as string | null,
    isPromptVisible: false,
    connectSource: 'invalidAction' as ConnectSource,
    isCheckingInitialAuth: true,
  });

  const [userState, setUserState] = useState({
    session: null as Session | null,
    user: null as User | null,
    username: undefined as string | undefined,
    profile: undefined as Profile | undefined,
    newUser: undefined as boolean | undefined,
  });

  const [signatureState, setSignatureState] = useState({
    nonce: '',
    signature: '',
  });

  const isAuthenticated = authState.status === 'authenticated';
  const isAuthenticating = authState.status === 'authenticating';
  const isFetchingProfile = authState.status === 'fetching_profile';
  const isCreatingProfile = authState.status === 'creating_profile';

  const { address, isConnected } = useAccount();
  const { litDisconnect } = useLitContext();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const prevIsConnectedRef = useRef<boolean | undefined>();

  const handleError = useCallback(
    (message: string, resetToIdle = false, throwError = true) => {
      setAuthState((prev) => ({
        ...prev,
        status: resetToIdle ? 'idle' : 'error',
        error: resetToIdle ? null : message,
      }));
      if (throwError) throw new Error(message);
      return null;
    },
    [],
  );

  const updateAuthState = useCallback(
    (status: AuthStatus, error: string | null = null) => {
      setAuthState((prev) => ({ ...prev, status, error }));
    },
    [],
  );

  const resetAuthState = useCallback(() => {
    safeRemoveLocalStorage(StorageKey_Username);
    setUserState({
      session: null,
      user: null,
      username: undefined,
      profile: undefined,
      newUser: undefined,
    });
    setAuthState((prev) => ({
      ...prev,
      status: 'idle',
      error: null,
      isPromptVisible: false,
    }));
  }, []);

  const getMessageToSign = useCallback((nonce: string) => {
    return `Please sign this message to log in or register.\n\nNonce: ${nonce}`;
  }, []);

  const getProfileFromSupabase = useCallback(
    async (userId: string): Promise<Profile | null> => {
      if (!userId) {
        return handleError(
          'Get profile failed, please try again.',
          false,
          false,
        );
      }

      updateAuthState('fetching_profile');

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profile) {
          safeSetLocalStorage(StorageKey_Username, profile.username);
          setUserState((prev) => ({
            ...prev,
            profile: {
              id: profile.user_id,
              username: profile.username,
              avatar: profile.avatar,
            },
            username: profile.username,
            newUser: false,
          }));
          updateAuthState('authenticated');
          return {
            ...profile,
            id: profile.user_id,
            username: profile.username,
          };
        } else {
          safeRemoveLocalStorage(StorageKey_Username);
          setUserState((prev) => ({
            ...prev,
            username: undefined,
            profile: undefined,
            newUser: true,
          }));
          updateAuthState('authenticated');
          return handleError('Get profile failed, please try again.');
        }
      } catch (error: any) {
        return handleError(
          `Failed to fetch profile: ${error.message || 'Please try again later'}`,
        );
      }
    },
    [handleError, updateAuthState],
  );

  useEffect(() => {
    const checkInitialAuth = async () => {
      setAuthState((prev) => ({ ...prev, isCheckingInitialAuth: true }));
      updateAuthState('authenticating');

      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[SupabaseContext] Error getting session:', error);
          throw new Error(
            `[SupabaseContext] Get Session Failed: ${error.message}`,
          );
        }

        if (currentSession) {
          setUserState((prev) => ({
            ...prev,
            session: currentSession,
            user: currentSession.user,
          }));
          await getProfileFromSupabase(currentSession.user.id);
        } else {
          resetAuthState();
        }
      } catch (error: any) {
        console.error('[SupabaseContext] Initial auth check failed:', error);
        resetAuthState();
      } finally {
        setAuthState((prev) => ({ ...prev, isCheckingInitialAuth: false }));
      }
    };

    checkInitialAuth();
  }, []);

  const logout = useCallback(async () => {
    updateAuthState('idle');
    await supabase.auth.signOut();
    resetAuthState();
  }, [resetAuthState, updateAuthState]);

  const performFullLogoutAndReload = useCallback(async () => {
    try {
      await disconnectAsync();
      await logout();
      litDisconnect();
    } catch (error) {
      console.error(
        '[SupabaseContext] Error during disconnect operations:',
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
      authState.status === 'authenticated'
    ) {
      performFullLogoutAndReload();
    }
    prevIsConnectedRef.current = isConnected;
  }, [isConnected, performFullLogoutAndReload, authState.status]);

  const authenticate = useCallback(async () => {
    if (!isConnected || !address) {
      handleError('Wallet not connected, cannot authenticate.', false, false);
      return;
    }

    if (
      authState.status === 'authenticating' ||
      authState.status === 'authenticated'
    ) {
      return;
    }

    safeSetLocalStorage(StorageKey_SupabaseAuthPending, '1');
    updateAuthState('authenticating');
    setUserState((pre) => ({
      ...pre,
      newUser: undefined,
    }));

    try {
      const [currentNonce, isRegistration] = await Promise.all([
        getNonce(address),
        checkRegistration(address),
      ]);

      if (!currentNonce) {
        handleError('Nonce not found', false, true);
      }

      setSignatureState((pre) => ({
        ...pre,
        nonce: currentNonce,
      }));

      const messageToSign = getMessageToSign(currentNonce);
      const signature = await signMessageAsync({ message: messageToSign });

      setSignatureState((pre) => ({
        ...pre,
        signature,
      }));

      if (!isRegistration) {
        setUserState((prev) => ({
          ...prev,
          username: undefined,
          profile: undefined,
          newUser: true,
        }));
        safeRemoveLocalStorage(StorageKey_Username);
        updateAuthState('authenticated');
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
        handleError(error.message || 'VerifyOtp failed');
      } else {
        setUserState((prev) => ({
          ...prev,
          session: data.session,
          user: data.user,
        }));
        await getProfileFromSupabase(data.user?.id!);
      }
    } catch (error: any) {
      if (isUserDenied(error)) {
        handleError('User denied signature or cancelled.', true, true);
      } else {
        const backendError = error.response?.data?.error;
        const errorMessage =
          backendError || error.message || 'Please try again';
        handleError(errorMessage);
      }
    } finally {
      safeRemoveLocalStorage(StorageKey_SupabaseAuthPending);
    }
  }, [
    isConnected,
    address,
    authState.status,
    signMessageAsync,
    getProfileFromSupabase,
    handleError,
    updateAuthState,
    getMessageToSign,
  ]);

  const createProfile = useCallback(
    async (newUsername: string) => {
      if (!address) {
        handleError(`${CreateProfileErrorPrefix} Failed to create profile.`);
        return;
      }

      updateAuthState('creating_profile');

      try {
        const { token } = await verify({
          address: address!,
          message: getMessageToSign(signatureState.nonce),
          signature: signatureState.signature,
          username: newUsername || '',
        });

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          handleError(
            `${CreateProfileErrorPrefix}: ${error.message || 'Please try again'}`,
          );
          return;
        }

        setUserState((prev) => ({
          ...prev,
          session: data.session,
          user: data.user,
        }));

        await getProfileFromSupabase(data.user?.id!);
      } catch (error: any) {
        handleError(
          `${CreateProfileErrorPrefix}: ${error.message || 'Please try again'}`,
        );
      }
    },
    [
      address,
      getMessageToSign,
      signatureState,
      getProfileFromSupabase,
      handleError,
      updateAuthState,
    ],
  );

  const getProfile = useCallback(async (): Promise<Profile | null> => {
    if (!userState.user?.id) {
      return null;
    }
    return getProfileFromSupabase(userState.user.id);
  }, [userState.user, getProfileFromSupabase]);

  const hideAuthPrompt = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isPromptVisible: false }));
    if (authState.status === 'error') {
      resetAuthState();
    }
  }, [authState.status, resetAuthState]);

  const showAuthPrompt = useCallback(
    async (source: ConnectSource = 'invalidAction') => {
      if (safeGetLocalStorage(StorageKey_SupabaseAuthPending)) {
        await disconnectAsync();
        safeRemoveLocalStorage(StorageKey_SupabaseAuthPending);
      }

      setAuthState((prev) => ({
        ...prev,
        connectSource: source,
        isPromptVisible: true,
      }));

      if (authState.status === 'error') {
        resetAuthState();
      }
    },
    [disconnectAsync, authState.status, resetAuthState],
  );

  const setConnectSource = useCallback((source: ConnectSource) => {
    setAuthState((prev) => ({ ...prev, connectSource: source }));
  }, []);

  const contextValue: SupabaseAuthContext = {
    supabase,
    session: userState.session,
    user: userState.user,
    authStatus: authState.status,
    isCheckingInitialAuth: authState.isCheckingInitialAuth,
    isAuthenticated,
    authenticate,
    username: userState.username,
    profile: userState.profile,
    newUser: userState.newUser,
    logout,
    performFullLogoutAndReload,
    isAuthPromptVisible: authState.isPromptVisible,
    showAuthPrompt,
    hideAuthPrompt,
    createProfile,
    getProfile,
    connectSource: authState.connectSource,
    setConnectSource,
    authError: authState.error,
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
