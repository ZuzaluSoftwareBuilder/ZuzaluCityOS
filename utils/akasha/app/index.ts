import { ZulandCreateAppInput } from '@/types/akasha';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import crypto from 'crypto';
import akashaSdk from '../akasha';

export async function getAppByEventId(eventId: string) {
  const sha1Hash = crypto.createHash('sha1').update(eventId).digest('hex');

  const app = await akashaSdk.services.gql.client.GetApps({
    first: 1,
    filters: {
      where: {
        name: {
          equalTo: `@bg-${sha1Hash}`,
        },
      },
    },
  });
  return app.akashaAppIndex?.edges?.[0]?.node;
}

export async function createApp(params: ZulandCreateAppInput) {
  const sha1Hash = crypto
    .createHash('sha1')
    .update(params.eventID)
    .digest('hex');

  const createAppResult = await akashaSdk.services.gql.client.CreateApp(
    {
      i: {
        content: {
          name: `@bg-${sha1Hash}`,
          description: params.description.slice(0, 2000),
          displayName: params.displayName.slice(0, 24),
          license: params.license || 'MIT',
          createdAt: new Date().toISOString(),
          applicationType: AkashaAppApplicationType.App,
        },
      },
    },
    {
      context: { source: akashaSdk.services.gql.contextSources.composeDB },
    },
  );
  return createAppResult.setAkashaApp;
}
