import akashaSdk from '../akasha';

export async function setUserInterests(
  topics: { labelType: string; value: string }[],
) {
  const response = await akashaSdk.services.gql.client.CreateInterests(
    {
      i: {
        content: {
          topics,
        },
      },
    },
    {
      context: { source: akashaSdk.services.gql.contextSources.composeDB },
    },
  );
  return response.setAkashaProfileInterests;
}

export async function getUserInterests() {
  const response = await akashaSdk.services.gql.client.GetInterests();
  return response.akashaProfileInterestsIndex;
}

export async function getProfileInterestsByDid(did: string) {
  const response = await akashaSdk.services.gql.client.GetInterestsByDid({
    id: did,
  });
  return response.node;
}
