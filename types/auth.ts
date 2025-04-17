import { Profile } from '@/types/index.js';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { Nullable } from './common';

export type AuthSource = 'ceramic' | 'supabase';
export type ConnectSource = 'connectButton' | 'invalidAction';
export type AuthStatus =
  | 'idle'
  | 'authenticating'
  | 'fetching_profile'
  | 'creating_profile'
  | 'authenticated'
  | 'error';

export interface AuthContextBase {
  // core status
  authStatus: AuthStatus;
  isCheckingInitialAuth: boolean;
  isAuthenticated: boolean;
  isAuthPromptVisible: boolean;
  connectSource: ConnectSource;
  authError: Nullable<string>;

  // user
  username: Nullable<string>;
  profile: Nullable<Profile>;
  newUser: boolean;

  // biz status
  isAuthenticating: boolean;
  isFetchingProfile: boolean;
  isCreatingProfile: boolean;

  // methods
  authenticate: () => Promise<void>;
  logout: () => Promise<void>;
  performFullLogoutAndReload: () => Promise<void>;
  showAuthPrompt: (source?: ConnectSource) => Promise<void>;
  hideAuthPrompt: () => Promise<void>;
  createProfile: (newName: string) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
  setConnectSource: (source: ConnectSource) => void;
}

export interface SupabaseAuthContext extends AuthContextBase {
  supabase: SupabaseClient;
  session: Nullable<Session>;
  user: Nullable<User>;
}

export interface CeramicAuthContext extends AuthContextBase {
  ceramic: CeramicClient;
  composeClient: ComposeClient;
}

export interface IAbstractAuthContext extends AuthContextBase {
  authSource: AuthSource;
  setAuthSource: (source: AuthSource) => void;
  // for old ceramic usage
  ceramic: CeramicClient;
  composeClient: ComposeClient;
}

export interface AuthState {
  status: AuthStatus;
  error: Nullable<string>;
  isPromptVisible: boolean;
  connectSource: ConnectSource;
  isCheckingInitialAuth: boolean;
}

export interface UserState {
  session: Nullable<Session>;
  user: Nullable<User>;
  username: Nullable<string>;
  profile: Nullable<Profile>;
  newUser: boolean;
}

export interface SignatureState {
  nonce: string;
  signature: string;
}
