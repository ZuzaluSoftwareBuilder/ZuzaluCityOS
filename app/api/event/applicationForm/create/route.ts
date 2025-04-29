import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array } from '@/utils';
import { supabase } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { NextResponse } from 'next/server';
dayjs.extend(timezone);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, profileId, answers } = body;
    const { data, error } = await supabase
      .from('events')
      .select('privateKey')
      .eq('eventId', eventId)
      .single();
    if (error) {
      console.error('Error getting private key:', error);
      return new NextResponse('Error getting private key', { status: 500 });
    }
    const seed = base64ToUint8Array(data.privateKey!);
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    await did.authenticate();
    ceramic.did = did;
    composeClient.setDID(did);

    const update: any = await composeClient.executeQuery(
      `
      mutation CreateZucityApplicationFormMutation($input: CreateZucityApplicationFormInput!) {
        createZucityApplicationForm(
          input: $input
        ) {
          document {
            id
            eventId
            profileId
            answers
            approveStatus
          }
        }
      }
      `,
      {
        input: {
          content: {
            eventId: eventId,
            profileId: profileId,
            answers: answers,
            approveStatus: null,
          },
        },
      },
    );

    const applicationFormId =
      update.data.createZucityApplicationForm.document.id;

    return NextResponse.json(
      {
        data: {
          applicationFormId,
        },
        message: 'Your application form has been submitted!',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
