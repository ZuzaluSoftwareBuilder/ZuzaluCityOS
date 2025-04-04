import { AkashaContentBlockInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { getAkashaSDK } from '../akasha';

export async function createBlockContent(block: AkashaContentBlockInput) {
  const sdk = await getAkashaSDK();
  if (!sdk) {
    throw new Error('AKASHA SDK not initialized');
  }
  const createAkashaContentBlockResponse =
    await sdk.services.gql.client.CreateContentBlock(
      {
        i: {
          content: block,
        },
      },
      {
        context: { source: sdk.services.gql.contextSources.composeDB },
      },
    );

  return createAkashaContentBlockResponse?.createAkashaContentBlock ?? null;
}
