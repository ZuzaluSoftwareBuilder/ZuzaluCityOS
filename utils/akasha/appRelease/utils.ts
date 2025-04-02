import { AccessControlCondition } from '@/utils/lit/types';
import { AppProviderValueInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export async function appReleaseMetaToACC(
  appMeta: AppProviderValueInput,
): Promise<AccessControlCondition> {
  const { value } = appMeta;
  const {
    contractAddress,
    standardContractType,
    chain,
    method,
    parameters,
    returnValueTest,
  } = JSON.parse(value);
  return {
    contractAddress,
    standardContractType,
    chain,
    method,
    parameters,
    returnValueTest,
  };
}
