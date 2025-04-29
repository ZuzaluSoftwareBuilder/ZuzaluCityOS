import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';

import { composeClient } from '@/constant';
import { DID } from 'dids';

import { ceramic } from '@/constant';
import { base64ToUint8Array } from '.';
import { supabase } from './supabase/client';

const authenticateWithSpaceId = async (spaceId: string) => {
  const { data, error } = await supabase
    .from('spaceAgent')
    .select('agentKey')
    .eq('spaceId', spaceId)
    .single();
  if (error) {
    return error;
  }
  const seed = base64ToUint8Array(data.agentKey!);
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;
  composeClient.setDID(did);
};

function executeQuery<TResult, TVariables extends Record<string, any>>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<{ data: TResult; errors: any }> {
  return composeClient.executeQuery(document.toString(), variables);
}

export { authenticateWithSpaceId, executeQuery };
