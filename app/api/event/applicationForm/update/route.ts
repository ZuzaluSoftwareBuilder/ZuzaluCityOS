import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/utils';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, approveStatus, eventId } = body;
    const { data, error } = await supabase
      .from('events')
      .select('privateKey')
      .eq('eventId', eventId)
      .single();
    if (error) {
      console.error('Error getting private key:', error);
      return new NextResponse('Error getting private key', { status: 500 });
    }
    const seed = base64ToUint8Array(data.privateKey);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    await did.authenticate();
    ceramic.did = did;
    composeClient.setDID(did);

    const result: any = await composeClient.executeQuery(
      `
      mutation UpdateZucityApplicationFormMutation($input: UpdateZucityApplicationFormInput!) {
        updateZucityApplicationForm(
          input: $input
        ) {
          document {
            id
          }
        }
      }
      `,
      {
        input: {
          id,
          content: {
            approveStatus,
          },
        },
      },
    );

    if (result?.errors) {
      console.error('Error updating application form:', result.errors);
      return new NextResponse('Error updating application form', {
        status: 500,
      });
    }

    return NextResponse.json(
      {
        message: 'Submitted!',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
