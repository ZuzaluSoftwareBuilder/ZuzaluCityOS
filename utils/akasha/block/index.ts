import { AkashaContentBlockInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import akashaSdk from '../akasha';

export async function createBlockContent(block: AkashaContentBlockInput) {
  const createAkashaContentBlockResponse =
    await akashaSdk.services.gql.client.CreateContentBlock(
      {
        i: {
          content: block,
        },
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );

  return createAkashaContentBlockResponse?.createAkashaContentBlock ?? null;
}
