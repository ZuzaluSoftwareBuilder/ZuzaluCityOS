'use client';

import { SHA1 } from 'crypto-js';
import { getAkashaSDK } from '../akasha';
import { ZulandCreateAppInput } from '@/types/akasha';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export async function getAppByEventId(eventId: string) {
  const sha1Hash = SHA1(eventId).toString();
  const akashaSdk = await getAkashaSDK();
  if (!akashaSdk) {
    throw new Error('AKASHA SDK not initialized');
  }
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
  const sha1Hash = SHA1(params.eventID).toString();

  const sdk = await getAkashaSDK();
  if (!sdk) {
    throw new Error('AKASHA SDK not initialized');
  }

  const createAppResult = await sdk.services.gql.client.CreateApp(
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
      context: { source: sdk.services.gql.contextSources.composeDB },
    },
  );
  return createAppResult.setAkashaApp;
}
