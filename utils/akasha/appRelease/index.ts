import {
  ZulandCreateAppReleaseInput,
  ZulandCreateAppReleaseInputWithTicketRules,
} from '@/types/akasha';
import {
  AkashaAppRelease,
  AppProviderValueInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import akashaSdk from '../akasha';

/**
 * Creates an app release in the AKASHA system.
 *
 * @param {ZulandCreateAppReleaseInput} params - The input parameters for creating an app release.
 * @param {string} params.applicationID - The ID of the application.
 * @param {string} params.source - The source of the application.
 * @param {string} params.version - The version of the application release.
 * @param {AppProviderValueInput[]} params.meta - Metadata for the application release.
 * A promise that resolves to the created app release data.
 */
export async function createAppRelease(params: ZulandCreateAppReleaseInput) {
  const createAppReleaseResult =
    await akashaSdk.services.gql.client.SetAppRelease(
      {
        i: {
          content: {
            applicationID: params.applicationID,
            source: params.source,
            version: params.version,
            meta: params.meta,
            createdAt: new Date().toISOString(),
          },
        },
      },
      {
        context: { source: akashaSdk.services.gql.contextSources.composeDB },
      },
    );
  return {
    clientMutationId:
      createAppReleaseResult?.setAkashaAppRelease?.clientMutationId || null,
    document: createAppReleaseResult?.setAkashaAppRelease?.document || null,
  };
}

/**
 * Creates a Zuland app release with optional ticket requirements.
 *
 * @param {ZulandCreateAppReleaseInputWithTicketRules} params - The input parameters for creating a Zuland app release.
 * @param {string} params.applicationID - The ID of the application.
 * @param {string} params.version - The version of the application release.
 * @param {string} params.source - The source of the application.
 * @param {Object} [params.ticketRequirements] - Optional ticket requirements for the app.
 * @param {string} [params.ticketRequirements.contractAddress] - The contract address for the ticket.
 * @param {string} [params.ticketRequirements.chain] - The blockchain chain for the ticket.
 * @param {string} [params.ticketRequirements.method] - The method to call on the contract (default: 'balanceOf').
 * @param {string} [params.ticketRequirements.comparator] - The comparator for the return value test (default: '>').
 * @param {string} [params.ticketRequirements.value] - The value to compare against in the return value test (default: '0').
 * A promise that resolves to the created Zuland app release data.
 */
export async function createZulandAppRelease(
  params: ZulandCreateAppReleaseInputWithTicketRules,
) {
  // convert params.ticketsRequirements to AppProviderValueInput
  const appMeta: AppProviderValueInput = {
    property: params.ticketRequirements ? 'TEXT#ENCRYPTED' : 'TEXT',
    value: params.ticketRequirements
      ? JSON.stringify({
          contractAddress: params.ticketRequirements.contractAddress,
          standardContractType: 'ERC721',
          chain: params.ticketRequirements.chain,
          method: params.ticketRequirements.method || 'balanceOf',
          parameters: [':userAddress'],
          returnValueTest: {
            comparator: params.ticketRequirements.comparator || '>',
            value: params.ticketRequirements.value || '0',
          },
        })
      : 'content-not-encrypted',
    provider: '@bg/zuland',
  };

  const createAppReleaseResult = await createAppRelease({
    applicationID: params.applicationID,
    version: params.version,
    source: params.source,
    meta: [appMeta],
  });
  return createAppReleaseResult;
}

export async function getAppReleaseById(id: string) {
  const appReleaseResult =
    await akashaSdk.services.gql.client.GetAppReleaseByID({
      id,
    });
  return (appReleaseResult?.node as AkashaAppRelease) ?? null;
}
