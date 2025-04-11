import {
  AkashaPageInfo,
  BeamsByAuthorDid,
  ZulandContentBlockInput,
  ZulandReadableBeam,
} from '@/types/akasha';
import { ZulandLit } from '@/utils/lit';
import { AccessControlCondition } from '@/utils/lit/types';
import {
  AkashaBeam,
  AkashaBeamFiltersInput,
  AkashaBeamInput,
  AkashaBeamSortingInput,
  AkashaContentBlockBlockDef,
  AkashaContentBlockInput,
  BeamLabeledInput,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import akashaSdk from '../akasha';
import { getAppByEventId } from '../app';
import { createBlockContent } from '../block';
import {
  extractBeamReadableContent,
  extractDecryptedBeamReadableContent,
} from './utils';

const DEFAULT_BEAMS_TAKE = 10;

export async function getBeams(options?: {
  before?: string;
  after?: string;
  first?: number;
  last?: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
}) {
  const beams = await akashaSdk.services.gql.client.GetBeams({
    first: options?.first ?? DEFAULT_BEAMS_TAKE,
    last: options?.last,
    before: options?.before,
    after: options?.after,
    sorting: options?.sorting ?? { createdAt: SortOrder.Desc },
    filters: options?.filters,
  });
  if (beams.akashaBeamIndex === undefined) {
    return null;
  }
  return beams.akashaBeamIndex;
}

export async function getBeamById(id: string): Promise<AkashaBeam | null> {
  const beam = await akashaSdk.services.gql.client.GetBeamById({
    id,
  });
  return (beam.node as AkashaBeam) ?? null;
}

export async function getBeamsByAuthorDid(
  did: string,
  options?: {
    before?: string;
    after?: string;
    first?: number;
    last?: number;
    filters?: AkashaBeamFiltersInput;
    sorting?: AkashaBeamSortingInput;
  },
): Promise<BeamsByAuthorDid | null> {
  const beams = await akashaSdk.services.gql.client.GetBeamsByAuthorDid(
    {
      id: did,
      first: options?.first ?? DEFAULT_BEAMS_TAKE,
      last: options?.last,
      before: options?.before,
      after: options?.after,
      sorting: options?.sorting ?? { createdAt: SortOrder.Desc },
      // filters: options?.filters,
    },
    {
      context: { source: akashaSdk.services.gql.contextSources.composeDB },
    },
  );
  if (JSON.stringify(beams.node) === '{}') {
    return null;
  }
  return beams.node as BeamsByAuthorDid | null;
}

export async function createBeam(beam: AkashaBeamInput) {
  const createAkashaBeamResponse =
    await akashaSdk.services.gql.client.CreateBeam(
      {
        i: {
          content: beam,
        },
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );

  return createAkashaBeamResponse?.createAkashaBeam ?? null;
}

/**
 * @deprecated use createZulandBeamFromBlocks instead
 * @returns the created beam
 */
export async function createBeamFromBlocks(params: {
  eventId: string;
  active: boolean;
  blocks: AkashaContentBlockInput[];
  tags?: Array<BeamLabeledInput>;
}) {
  // step 0: retrieve the app and app version ID from the event ID
  const app = await getAppByEventId(params.eventId);
  if (!app) {
    throw new Error('App not found');
  }
  const appVersionID = app.releases?.edges?.[0]?.node?.id;
  if (!appVersionID) {
    throw new Error(
      'App version not found. An app version is required to create a beam',
    );
  }

  // step 1: create the blocks
  const blockCreationResults = await Promise.all(
    params.blocks.map(createBlockContent),
  );

  // step 2: create the beam
  const beamContent = blockCreationResults.map((block, index) => ({
    blockID: block?.document?.id,
    order: index,
  }));
  const beamToCreate: AkashaBeamInput = {
    active: params.active,
    appID: app.id,
    appVersionID: appVersionID,
    createdAt: new Date().toISOString(),
    content: beamContent,
    tags: params.tags,
  };
  const beam = await createBeam(beamToCreate);
  return beam;
}

export async function createBeamFromPlainBlocks(params: {
  appId: string;
  appVersionId: string;
  active: boolean;
  blocks: AkashaContentBlockInput[];
  tags?: Array<BeamLabeledInput>;
}) {
  // step 1: create the blocks
  const blockCreationResults = await Promise.all(
    params.blocks.map(createBlockContent),
  );

  // step 2: create the beam
  const beamContent = blockCreationResults.map((block, index) => ({
    blockID: block?.document?.id,
    order: index,
  }));
  const beamToCreate: AkashaBeamInput = {
    active: params.active,
    appID: params.appId,
    appVersionID: params.appVersionId,
    createdAt: new Date().toISOString(),
    content: beamContent,
    tags: params.tags,
  };
  const beam = await createBeam(beamToCreate);
  return beam;
}

export async function createZulandBeamFromBlocks(params: {
  eventId: string;
  active?: boolean;
  blocks: ZulandContentBlockInput[];
  tags?: Array<BeamLabeledInput>;
}) {
  // step 0: retrieve the app and app version ID from the event ID
  const app = await getAppByEventId(params.eventId);
  if (!app) {
    throw new Error('App not found');
  }
  // the fisrt release is the latest one (they are ordered by createdAt)
  const appVersion = app.releases?.edges?.[0]?.node;
  if (!appVersion) {
    throw new Error(
      'App version not found. An app version is required to create a beam',
    );
  }

  const ticketRequirements =
    appVersion?.meta?.find((meta) => meta?.property === 'TEXT#ENCRYPTED') ??
    null;

  const standardizedBlocks: AkashaContentBlockInput[] = await Promise.all(
    params.blocks.map(async (block) => {
      let encryptedBlockContent = block.content;
      if (ticketRequirements) {
        // encrypt blocks content here
        try {
          const litACC: AccessControlCondition = JSON.parse(
            ticketRequirements.value,
          );
          const zulandLit = new ZulandLit(litACC.chain);
          await zulandLit.connect();
          encryptedBlockContent = await Promise.all(
            encryptedBlockContent.map(async (blockContent) => {
              return {
                ...blockContent,
                value: JSON.stringify(
                  await zulandLit.encryptString(blockContent.value, [litACC]),
                ),
              };
            }),
          );
        } catch (error) {
          console.error('Error encrypting blocks content', error);
          throw new Error('Error encrypting blocks content');
        }
      }
      return {
        active: block.active ?? true,
        createdAt: block.createdAt ?? new Date().toISOString(),
        kind: block.kind ?? AkashaContentBlockBlockDef.Text,
        nsfw: block.nsfw ?? false,
        appVersionID: appVersion.id,
        content: encryptedBlockContent,
      };
    }),
  );

  const beam = await createBeamFromPlainBlocks({
    appId: app.id,
    appVersionId: appVersion.id,
    active: params.active ?? true,
    blocks: standardizedBlocks,
    tags: params.tags,
  });
  return beam;
}

/***************************************************
 *
 *                READABLE FUNCTIONS
 *
 **************************************************/

export async function getReadableBeams(options?: {
  before?: string;
  after?: string;
  first?: number;
  last?: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
}): Promise<{
  edges: Array<{ cursor: string | undefined; node: ZulandReadableBeam }>;
  pageInfo: AkashaPageInfo;
}> {
  const beams = await getBeams(options);
  if (!beams || !beams.edges) {
    return {
      edges: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
  return {
    edges: await Promise.all(
      beams.edges.map(async (edge) => {
        return {
          cursor: edge?.cursor,
          node: await extractBeamReadableContent(edge?.node as AkashaBeam),
        };
      }),
    ),
    pageInfo: beams.pageInfo,
  };
}

export async function getReadableBeamsFromAppRelease(
  appReleases: {
    id: string;
    createdAt: any;
    source: any;
    version: string;
    meta?: Array<{
      property: string;
      provider: string;
      value: string;
    } | null> | null;
  }[],
  options?: {
    before?: string;
    after?: string;
    first?: number;
    last?: number;
    filters?: AkashaBeamFiltersInput;
    sorting?: AkashaBeamSortingInput;
  },
): Promise<{
  edges: Array<{ cursor: string | undefined; node: ZulandReadableBeam }>;
  pageInfo: AkashaPageInfo;
}> {
  const beams = await getBeams(options);
  if (!beams || !beams.edges) {
    return {
      edges: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
  return {
    edges: (
      await Promise.all(
        beams.edges.map(async (edge) => {
          // check here if the beam needs to be decrypted
          try {
            return {
              cursor: edge?.cursor,
              node: await extractDecryptedBeamReadableContent(
                edge?.node as AkashaBeam,
                appReleases,
              ),
            };
          } catch (error) {
            // console.error('Error decrypting beam', error);
            // remove the beam from the list
            console.warn('skipping beam because of error');
            throw error;
          }
        }),
      )
    ).filter((edge) => edge !== null && edge !== undefined),
    pageInfo: beams.pageInfo,
  };
}

export async function getZulandReadableBeams(
  eventId: string,
  options?: {
    before?: string;
    after?: string;
    first?: number;
    last?: number;
    filters?: AkashaBeamFiltersInput;
    sorting?: AkashaBeamSortingInput;
  },
): Promise<{
  edges: Array<{ cursor: string | undefined; node: ZulandReadableBeam }>;
  pageInfo: AkashaPageInfo;
}> {
  const zulandApp = await getAppByEventId(eventId);
  if (!zulandApp) {
    throw new Error('App not found');
  }

  // retrieve all app versions and filter out null values
  const appVersions =
    zulandApp.releases?.edges
      ?.map((edge) => edge?.node)
      .filter(
        (version): version is NonNullable<typeof version> => version != null,
      ) ?? [];

  const readableBeams = await getReadableBeamsFromAppRelease(appVersions, {
    filters: {
      where: {
        appID: {
          equalTo: zulandApp.id,
        },
      },
    },
    ...options,
  });
  return readableBeams;
}

export async function getReadableBeamsByAuthorDid(
  did: string,
  options?: {
    before?: string;
    after?: string;
    first?: number;
    last?: number;
    filters?: AkashaBeamFiltersInput;
    sorting?: AkashaBeamSortingInput;
  },
): Promise<BeamsByAuthorDid | null> {
  const beams = await getBeamsByAuthorDid(did, options);
  if (!beams) {
    return null;
  }
  const akashaBeamList = beams?.akashaBeamList ? beams.akashaBeamList : null;
  if (!akashaBeamList) {
    return null;
  }
  return {
    ...beams,
    akashaBeamList: {
      pageInfo: akashaBeamList.pageInfo,
      edges: akashaBeamList.edges
        ? ((await Promise.all(
            akashaBeamList.edges.map(async (edge) => {
              if (edge) {
                return {
                  cursor: edge.cursor,
                  node: await extractBeamReadableContent(
                    edge.node as unknown as AkashaBeam,
                  ),
                };
              }
              return null;
            }),
          )) as any)
        : null,
    },
  };
}

export async function getReadableBeamById(
  id: string,
): Promise<ZulandReadableBeam | null> {
  const beam = await getBeamById(id);
  if (!beam) {
    return null;
  }
  return await extractBeamReadableContent(beam);
}

// TODO: remove this if it's not necessary
export * from './utils';
