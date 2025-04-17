import { ceramic, composeClient } from '@/constant';
import { AuthSource, IAbstractAuthContext } from '@/types/auth';
import { createContext, useContext, useState } from 'react';
import { useCeramicContext } from './CeramicContext';
import { useSupabaseContext } from './SupabaseContext';

const DefaultAuthSource: AuthSource = 'supabase';

const initialContext: IAbstractAuthContext = {
  ceramic,
  composeClient,
  authStatus: 'idle',
  isCheckingInitialAuth: true,
  isAuthenticated: false,
  authSource: DefaultAuthSource,
  setAuthSource: () => {},
  authenticate: async () => {},
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
  username: '',
  profile: null,
  newUser: false,
  isAuthenticating: false,
  isFetchingProfile: false,
  isCreatingProfile: false,
};

const AbstractAuthContext = createContext<IAbstractAuthContext>(initialContext);

export const AbstractAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authSource, setAuthSource] = useState<AuthSource>(DefaultAuthSource);

  const ceramicCtx = useCeramicContext();
  const supabaseCtx = useSupabaseContext();

  const currentCtx = authSource === 'ceramic' ? ceramicCtx : supabaseCtx;

  const contextValue: IAbstractAuthContext = {
    ...currentCtx,

    authSource,
    setAuthSource,

    ceramic: ceramicCtx.ceramic,
    composeClient: ceramicCtx.composeClient,
  };

  return (
    <AbstractAuthContext.Provider value={contextValue}>
      {children}
    </AbstractAuthContext.Provider>
  );
};

export default AbstractAuthContext;
export const useAbstractAuthContext = () => useContext(AbstractAuthContext);
