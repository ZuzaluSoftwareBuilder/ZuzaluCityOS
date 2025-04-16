import { ceramic, composeClient } from '@/constant';
import { AuthSource, IAbstractAuthContext } from '@/types/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { useCeramicContext } from './CeramicContext';
import { useSupabaseContext } from './SupabaseContext';

const initialContext: IAbstractAuthContext = {
  ceramic,
  composeClient,
  authStatus: 'idle',
  isCheckingInitialAuth: true,
  isAuthenticated: false,
  authSource: 'supabase', // Default to supabase
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
  username: undefined,
  profile: undefined,
  newUser: undefined,
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
  const [authSource, setAuthSource] = useState<AuthSource>('supabase');

  const ceramicCtx = useCeramicContext();
  const supabaseCtx = useSupabaseContext();

  const currentCtx = authSource === 'ceramic' ? ceramicCtx : supabaseCtx;

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (authSource === 'supabase' && !supabaseUrl) {
      console.warn(
        'Supabase configuration unavailable, falling back to Ceramic',
      );
      setAuthSource('ceramic');
    }
  }, [authSource]);

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
