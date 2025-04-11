import React, { createContext, useContext, useState, useCallback } from 'react';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { authenticateCeramic } from '../utils/ceramicAuth';
import { Profile } from '@/types/index.js';
import { ceramic, composeClient } from '@/constant';
import { getAccount } from 'wagmi/actions';
import { config } from '@/context/WalletContext';
import { executeQuery } from '@/utils/ceramic';
import {
  CREATE_PROFILE_MUTATION,
  GET_OWN_PROFILE_QUERY,
} from '@/services/graphql/profile';

type ConnectSource = 'connectButton' | 'invalidAction';

interface CeramicContextType {
  ceramic: CeramicClient;
  composeClient: ComposeClient;
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
  getProfile: () => Promise<void>;
  connectSource: ConnectSource;
  setConnectSource: (source: ConnectSource) => void;
}

const CeramicContext = createContext<CeramicContextType>({
  ceramic,
  composeClient,
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
  getProfile: async () => {},
  connectSource: 'invalidAction',
  setConnectSource: () => {},
});

export const CeramicProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthPromptVisible, setAuthPromptVisible] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean | undefined>(undefined);
  const [connectSource, setConnectSource] =
    useState<ConnectSource>('invalidAction');
  const authenticate = async () => {
    console.log('authenticate');
    try {
      await authenticateCeramic(ceramic, composeClient);
      await getProfile();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed in CeramicContext:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };
  const showAuthPrompt = (source: ConnectSource = 'invalidAction') => {
    setConnectSource(source);
    setAuthPromptVisible(true);
    const existingusername = localStorage.getItem('username');
    if (existingusername) {
      setIsAuthenticated(true);
    }
  };
  const hideAuthPrompt = useCallback(() => {
    setAuthPromptVisible(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('ceramic:eth_did');
    localStorage.removeItem('display did');
    localStorage.removeItem('logged_in');
    setIsAuthenticated(false);
    setNewUser(false);
  };

  const getProfile = async () => {
    if (ceramic.did !== undefined) {
      const profile: any = await executeQuery(GET_OWN_PROFILE_QUERY);
      const basicProfile: { id: string; username: string } | undefined =
        profile?.data?.viewer?.zucityProfile;
      if (basicProfile?.id) {
        localStorage.setItem('username', basicProfile.username);
        setProfile(basicProfile);
        setUsername(basicProfile.username);
        setNewUser(false);
      } else {
        logout();
        setNewUser(true);
      }
    }
  };

  const createProfile = async (newName: string) => {
    const { address } = getAccount(config);
    if (!ceramic.did || !newName || !address) {
      console.error('Invalid DID or name provided.');
      return;
    }

    try {
      const update = await executeQuery(CREATE_PROFILE_MUTATION, {
        input: {
          content: {
            username: newName,
            address: address.toString().toLowerCase(),
          },
        },
      });

      if (update.errors) {
        console.error('Error creating profile:', update.errors);
      }
      await getProfile();
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <CeramicContext.Provider
      value={{
        ceramic,
        composeClient,
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
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export default CeramicContext;
export const useCeramicContext = () => useContext(CeramicContext);
