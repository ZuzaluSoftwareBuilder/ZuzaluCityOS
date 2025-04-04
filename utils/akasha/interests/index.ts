import { getAkashaSDK } from '../akasha';

export async function setUserInterests(
  topics: { labelType: string; value: string }[],
) {
  const sdk = await getAkashaSDK();
  if (!sdk) {
    throw new Error('AKASHA SDK not initialized');
  }
  const response = await sdk.services.gql.client.CreateInterests(
    {
      i: {
        content: {
          topics,
        },
      },
    },
    {
      context: { source: sdk.services.gql.contextSources.composeDB },
    },
  );
  return response.setAkashaProfileInterests;
}

export async function getUserInterests() {
  const sdk = await getAkashaSDK();
  if (!sdk) {
    throw new Error('AKASHA SDK not initialized');
  }
  const response = await sdk.services.gql.client.GetInterests();
  return response.akashaProfileInterestsIndex;
}

export async function getProfileInterestsByDid(did: string) {
  const sdk = await getAkashaSDK();
  if (!sdk) {
    throw new Error('AKASHA SDK not initialized');
  }
  const response = await sdk.services.gql.client.GetInterestsByDid({
    id: did,
  });
  return response.node;
}
