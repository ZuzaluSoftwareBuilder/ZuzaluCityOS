import { AkashaProfileStats } from '@/types/akasha';
import { getProfileStatsByDid } from '@/utils/akasha';
import { create } from 'zustand';
interface AkashaAuthState {
  currentAkashaUser: {
    id?: string;
    ethAddress?: string;
    isNewUser: boolean;
  } | null;
  currentAkashaUserStats:
    | AkashaProfileStats['akashaProfile']
    | null
    | undefined;
  loginAkasha: () => Promise<void>;
  setAkashaUserStats: (
    akashaProfile: AkashaProfileStats['akashaProfile'],
  ) => Promise<void>;
}

export const useAkashaAuthStore = create<AkashaAuthState>((set, get) => ({
  currentAkashaUser: null,
  currentAkashaUserStats: null,
  loginAkasha: async () => {
    try {
      // Dynamically import akashaSdk only when needed
      const { default: akashaSdk } = await import('@/utils/akasha/akasha');

      const authRes = await akashaSdk.api.auth.signIn({
        provider: 2, // 2 = Web3Injected
        checkRegistered: false,
        resumeSignIn: false,
      });

      const akashaProfileData = await getProfileStatsByDid(
        authRes.data?.id ?? '',
      );

      set({
        currentAkashaUser: authRes.data,
        currentAkashaUserStats: akashaProfileData?.akashaProfile,
      });
    } catch (error) {
      console.error('Error logging in to Akasha', error);
    }
  },
  setAkashaUserStats: async (
    akashaProfile: AkashaProfileStats['akashaProfile'],
  ) => {
    set({
      currentAkashaUserStats: akashaProfile,
    });
  },
}));
