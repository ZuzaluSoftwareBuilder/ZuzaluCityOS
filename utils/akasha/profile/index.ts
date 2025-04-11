import { AkashaProfileStats, ZulandProfileInput } from '@/types/akasha';
import { AccessControlCondition } from '@/utils/lit/types';
import { SetOptionsInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';
import * as WagmiChains from '@wagmi/core/chains';
import { createConfig, http } from 'wagmi';
import { readContract } from 'wagmi/actions';
import akashaSdk from '../akasha';
import { getAppByEventId } from '../app';

export async function getProfileByDid(did: string): Promise<{
  akashaProfile: AkashaProfile;
  isViewer: boolean;
} | null> {
  const profile = await akashaSdk.services.gql.client.GetProfileByDid({
    id: did,
  });
  if (JSON.stringify(profile.node) === '{}' || profile.node === undefined) {
    return null;
  }
  return profile?.node as {
    akashaProfile: AkashaProfile;
    isViewer: boolean;
  };
}

/**
 * Get the user profile using the SDK context
 */
export async function getUserProfile() {
  const profile = await akashaSdk.services.gql.client.GetMyProfile();
  return profile.viewer?.akashaProfile ?? null;
}

export async function getProfileById(
  id: string,
): Promise<AkashaProfile | null> {
  const profile = await akashaSdk.services.gql.client.GetProfileByID({
    id,
  });
  if (!profile || !profile.node || Object.keys(profile.node).length === 0) {
    return null;
  }
  return profile.node as AkashaProfile;
}

export async function getProfileStatsByDid(
  did: string,
): Promise<AkashaProfileStats | null> {
  const profileStats = await akashaSdk.services.gql.client.GetProfileStatsByDid(
    {
      id: did,
    },
  );
  if (
    !profileStats ||
    !profileStats.node ||
    Object.keys(profileStats.node).length === 0
  ) {
    return null;
  }
  return profileStats.node as AkashaProfileStats;
}

export async function createProfile(
  profile: ZulandProfileInput,
  appID: string,
  appVersionID: string,
  clientMutationId?: string,
  options?: SetOptionsInput,
) {
  const createProfileResponse =
    await akashaSdk.services.gql.client.CreateProfile(
      {
        i: {
          clientMutationId: clientMutationId,
          content: {
            appID,
            appVersionID,
            createdAt: new Date().toISOString(),
            ...profile,
          },
          options: options,
        },
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );

  return createProfileResponse.setAkashaProfile;
}

export async function createZulandProfile(
  eventId: string,
  profile: ZulandProfileInput,
  clientMutationId?: string,
  options?: SetOptionsInput,
) {
  const zulandApp = await getAppByEventId(eventId);
  if (!zulandApp) {
    throw new Error('App not found for the given event ID');
  }
  const appID = zulandApp.id;
  const appVersionID = zulandApp.releases?.edges?.[0]?.node?.id;
  if (!appVersionID) {
    throw new Error('App version not found for this app');
  }

  const createProfileResponse = await createProfile(
    profile,
    appID,
    appVersionID,
    clientMutationId,
    options,
  );

  return createProfileResponse?.document ?? null;
}

export async function hasUserTicketPermissions(eventId: string) {
  try {
    const app = await getAppByEventId(eventId);
    if (!app) {
      return false;
    }
    const appRelease = app.releases.edges?.[0]?.node;
    if (!appRelease) {
      console.error('App version not found for the given event ID');
      return false;
    }
    const ticketRequirements =
      appRelease.meta?.find((meta) => meta?.property === 'TEXT#ENCRYPTED') ??
      null;
    if (!ticketRequirements) {
      return true;
    }
    const litAcc: AccessControlCondition = ticketRequirements
      ? JSON.parse(ticketRequirements.value)
      : null;

    // this will trigger the connection if not connected
    await akashaSdk.services.common.web3.connect();
    const userAddress = akashaSdk.services.common.web3.state.address;
    if (!userAddress) {
      console.error('User address not found');
      return false;
    }

    // check wagmi chain from litAcc
    let selectedChain = (WagmiChains as any)[`${litAcc.chain}`];
    if (!selectedChain) {
      console.error('Chain not found or not supported');
      selectedChain = WagmiChains.sepolia;
    }

    const config = createConfig({
      chains: [selectedChain],
      transports: {
        [selectedChain.id]: http(),
      },
    });

    const abi = [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
    ];

    const result: BigInt = (await readContract(config, {
      abi,
      address: litAcc.contractAddress as `0x${string}`,
      functionName: 'balanceOf',
      args: [userAddress],
    })) as BigInt;

    if (Number(result) > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking user ticket permissions', error);
    return false;
  }
}
