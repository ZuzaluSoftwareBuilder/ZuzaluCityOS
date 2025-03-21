import { getResolver } from 'key-did-resolver';

import { Ed25519Provider } from 'key-did-provider-ed25519';

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
  const seed = base64ToUint8Array(data.agentKey);
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;
  composeClient.setDID(did);
};

export { authenticateWithSpaceId };
