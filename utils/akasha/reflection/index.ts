import {
  AkashaGetReflectionsFromBeamResponse,
  AkashaReflections,
  AkashaReflectionsFromBeam,
  ZulandComplexReflectOfReflections,
  ZulandReadableReflection,
  ZulandReadableReflectionResult,
  ZulandReadableReflectionWithChildren,
} from '@/types/akasha';
import { ZulandLit } from '@/utils/lit';
import { AccessControlCondition } from '@/utils/lit/types';
import {
  AkashaReflectConnection,
  AkashaReflectEdge,
  AkashaReflectInput,
  AkashaReflectInterfaceFiltersInput,
  AkashaReflectInterfaceSortingInput,
  AkashaReflectSortingInput,
  CreateOptionsInput,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import akashaSdk from '../akasha';
import { getAppReleaseById } from '../appRelease';
import { getBeamById } from '../beam';
import {
  extractDecryptedReadableReflections,
  extractReadableReflections,
} from './utils';

const DEFAULT_REFLECTIONS_TAKE = 10;

export async function createReflection(
  reflection: AkashaReflectInput,
  clientMutationId?: string,
  options?: CreateOptionsInput,
) {
  const createAkashaReflectionResponse =
    await akashaSdk.services.gql.client.CreateReflect(
      {
        i: {
          clientMutationId,
          content: reflection,
          options,
        },
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );

  return createAkashaReflectionResponse?.createAkashaReflect ?? null;
}

export async function createZulandReflection(
  reflection: AkashaReflectInput,
  clientMutationId?: string,
  options?: CreateOptionsInput,
) {
  // reflection will follow the same Beam encryption requirements
  const parentBeam = await getBeamById(reflection.beamID);
  const appRelease = await getAppReleaseById(parentBeam?.appVersionID);
  let encryptedContent = reflection.content;
  if (!appRelease) {
    throw new Error('App release not found');
  }
  if (appRelease) {
    const ticketRequirements =
      appRelease?.meta?.find((meta) => meta?.property === 'TEXT#ENCRYPTED') ??
      null;
    if (ticketRequirements) {
      const litACC: AccessControlCondition = JSON.parse(
        ticketRequirements.value,
      );
      const zulandLit = new ZulandLit(litACC.chain);
      await zulandLit.connect();

      // encrypt every reflection.content object
      encryptedContent = await Promise.all(
        reflection.content.map(async (content) => {
          if (content) {
            const { ciphertext, dataToEncryptHash } =
              await zulandLit.encryptString(content.value, [litACC]);
            return {
              ...content,
              value: JSON.stringify({ ciphertext, dataToEncryptHash }),
            };
          }
          return content;
        }),
      );
      await zulandLit.disconnect();
    }
  }

  return createReflection(
    {
      ...reflection,
      content: encryptedContent,
    },
    clientMutationId,
    options,
  );
}

export async function getReflectionsFromBeamId(
  beamId: string,
  options?: {
    first?: number;
    after?: string;
    before?: string;
    last?: number;
    sorting?: AkashaReflectInterfaceSortingInput;
    filters?: AkashaReflectInterfaceFiltersInput;
  },
): Promise<AkashaReflectionsFromBeam | null> {
  const reflections =
    await akashaSdk.services.gql.client.GetReflectionsFromBeam(
      {
        id: beamId,
        first: options?.first ?? DEFAULT_REFLECTIONS_TAKE,
        after: options?.after,
        before: options?.before,
        last: options?.last,
        sorting: options?.sorting ?? { createdAt: SortOrder.Desc },
        // TODO: understand what filters are
        // filters: undefined,
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );
  if (!reflections.node || JSON.stringify(reflections.node) === '{}') {
    return null;
  }

  return (reflections as AkashaGetReflectionsFromBeamResponse).node;
}

export async function getReflectionsOfReflection(
  reflectionId: string,
  options?: {
    first?: number;
    after?: string;
    before?: string;
    last?: number;
    sorting?: AkashaReflectSortingInput;
  },
): Promise<AkashaReflections | null> {
  const res = await akashaSdk.services.gql.client.GetReflectReflections({
    id: reflectionId,
    first: options?.first ?? DEFAULT_REFLECTIONS_TAKE,
    last: options?.last,
    after: options?.after,
    before: options?.before,
    sorting: options?.sorting ?? { createdAt: SortOrder.Desc },
  });
  if (!res.akashaReflectIndex) {
    return null;
  }
  return res.akashaReflectIndex;
}

export async function getReadableReflectionsByBeamId(
  beamId: string,
  options?: {
    first?: number;
    after?: string;
    before?: string;
    last?: number;
    sorting?: AkashaReflectInterfaceSortingInput;
    filters?: AkashaReflectInterfaceFiltersInput;
  },
): Promise<ZulandReadableReflectionResult | null> {
  const reflections = await getReflectionsFromBeamId(beamId, options);

  if (!reflections) {
    return null;
  }

  const unreadableReflections = reflections;

  if (!unreadableReflections.reflections.edges) {
    return null;
  }

  const readableReflections: (
    | {
        node: ZulandReadableReflection;
        cursor: string;
      }
    | undefined
  )[] = await extractReadableReflections(
    unreadableReflections.reflections.edges as AkashaReflectEdge[],
  );

  return {
    ...unreadableReflections,
    reflections: {
      ...unreadableReflections.reflections,
      edges: readableReflections.filter(
        (
          reflection,
        ): reflection is { node: ZulandReadableReflection; cursor: string } =>
          reflection !== undefined,
      ),
    },
  };
}

export async function getTopReadableReflectionsByBeamId(
  beamId: string,
  options?: {
    first?: number;
    after?: string;
    before?: string;
    last?: number;
    sorting?: AkashaReflectInterfaceSortingInput;
    // filters?: AkashaReflectInterfaceFiltersInput;
  },
): Promise<ZulandReadableReflectionResult | null> {
  const reflections =
    await akashaSdk.services.gql.client.GetReflectionsFromBeam(
      {
        id: beamId,
        first: options?.first ?? DEFAULT_REFLECTIONS_TAKE,
        after: options?.after,
        before: options?.before,
        last: options?.last,
        sorting: options?.sorting ?? { createdAt: SortOrder.Desc },
        filters: {
          or: [
            {
              where: {
                isReply: {
                  equalTo: false,
                },
              },
            },
            {
              where: {
                isReply: {
                  isNull: true,
                },
              },
            },
          ],
        },
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );

  if (!reflections.node) {
    return null;
  }

  if (Object.keys(reflections.node).length === 0) {
    return null; // or return an empty array, depending on your preference
  }

  const unreadableReflections = reflections.node as {
    reflectionsCount: number;
    reflections: AkashaReflectConnection;
  };

  if (!unreadableReflections.reflections.edges) {
    return null;
  }

  const parentBeam = await getBeamById(beamId);
  const appRelease = await getAppReleaseById(parentBeam?.appVersionID);
  // const appRelease = parentBeam?.appVersion;
  const ticketRequirements = appRelease?.meta?.find(
    (meta) => meta?.property === 'TEXT#ENCRYPTED',
  );

  const readableReflections: (
    | {
        node: ZulandReadableReflection;
        cursor: string;
      }
    | undefined
  )[] = await extractDecryptedReadableReflections(
    unreadableReflections.reflections.edges as AkashaReflectEdge[],
    ticketRequirements ? [JSON.parse(ticketRequirements.value)] : undefined,
  );

  return {
    ...unreadableReflections,
    reflections: {
      ...unreadableReflections.reflections,
      edges: readableReflections.filter(
        (
          reflection,
        ): reflection is { node: ZulandReadableReflection; cursor: string } =>
          reflection !== undefined,
      ),
    },
  };
}

export async function getReadableReflectionsByReflectionId(
  id: string,
  options?: {
    after?: string;
    before?: string;
    first?: number;
    last?: number;
    sorting?: AkashaReflectSortingInput;
  },
): Promise<ZulandComplexReflectOfReflections> {
  const res = await getReflectionsOfReflection(id, options);

  if (!res) {
    return {
      pageInfo: null,
      edge: [],
    };
  }

  if (!res.edges || res.edges.length === 0) {
    return {
      pageInfo: res.pageInfo,
      edge: [],
    };
  }

  const beamId = res.edges[0]?.node?.beam?.id as string;
  const parentBeam = await getBeamById(beamId);
  const appRelease = await getAppReleaseById(parentBeam?.appVersionID);
  const ticketRequirements = appRelease?.meta?.find(
    (meta) => meta?.property === 'TEXT#ENCRYPTED',
  );

  const readableReflections = await extractDecryptedReadableReflections(
    res.edges as AkashaReflectEdge[],
    ticketRequirements ? [JSON.parse(ticketRequirements.value)] : undefined,
  );

  const readableReflectionsWithChildren: {
    node: ZulandReadableReflectionWithChildren;
    cursor: string;
  }[] = [];
  for (const reflection of readableReflections) {
    const childrenReflections = await getReadableReflectionsByReflectionId(
      reflection.node.id,
      {
        first: options?.first ?? DEFAULT_REFLECTIONS_TAKE,
        last: options?.last,
        after: options?.after,
        before: options?.before,
        sorting: options?.sorting ?? { createdAt: SortOrder.Desc },
      },
    );
    if (childrenReflections.edge.length > 0) {
      readableReflectionsWithChildren.push({
        node: {
          ...reflection.node,
          children: childrenReflections,
        },
        cursor: reflection.cursor,
      });
    } else {
      readableReflectionsWithChildren.push({
        node: {
          ...reflection.node,
          children: null,
        },
        cursor: reflection.cursor,
      });
    }
  }

  return {
    pageInfo: res.pageInfo,
    edge: readableReflectionsWithChildren,
  };
}
