import { ceramic, composeClient } from '@/constant';
import { base64ToUint8Array } from '@/utils';
import { supabase } from '@/utils/supabase/client';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { NextResponse } from 'next/server';
interface scrollpass {
  hash: string;
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, memberDID, encryptedMemberScrollpass } = body;
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
    const GET_Event_QUERY = `
    query GetZucityEvent($id: ID!) {
      node(id: $id) {
          ... on ZucityEvent {
            id
            admins {
              id
              zucityProfile {
                username
              }
            }
            members {
              id
              zucityProfile {
                username
              }
            }
            author {
              id
            }
            scrollpassHash {
            hash
            }
          }
        }
      }
    `;

    const getEventResponse: any = await composeClient.executeQuery(
      GET_Event_QUERY,
      {
        id: eventId,
      },
    );
    const existedScrollpass =
      getEventResponse.data.node.scrollpassHash?.map(
        (scrollpass: any) => scrollpass.hash,
      ) ?? [];
    const existedMembers =
      getEventResponse.data.node.members?.map((member: any) => member.id) ?? [];
    if (existedMembers.includes(memberDID)) {
      return new NextResponse('You are already whitelisted', { status: 500 });
    }
    if (existedScrollpass.includes(encryptedMemberScrollpass)) {
      return new NextResponse(
        'You have already use this scrollpass ticket to whitelist an account, please login with that address',
        { status: 500 },
      );
    } else {
      const updatedMembers = getEventResponse.data.node.members
        ? [
            ...getEventResponse.data.node.members.map(
              (member: any) => member.id,
            ),
            memberDID,
          ]
        : [memberDID];
      const existingScrollpass: scrollpass[] = Array.isArray(
        getEventResponse.data.node.scrollpassHash,
      )
        ? getEventResponse.data.node.scrollpassHash
        : [];
      const newScrollpass: scrollpass = {
        hash: encryptedMemberScrollpass,
      };
      const updatedScrollpass: scrollpass[] = [
        ...existingScrollpass,
        newScrollpass,
      ];
      const query = `
            mutation UpdateZucityEvent($i: UpdateZucityEventInput!) {
            updateZucityEvent(input: $i) {
            document {
                id
            }
        }
    }
    `;

      const variables = {
        i: {
          id: eventId,
          content: {
            members: updatedMembers,
            scrollpassHash: updatedScrollpass,
          },
        },
      };
      const updateResult: any = await composeClient.executeQuery(
        query,
        variables,
      );
      return NextResponse.json(
        {
          message: 'Successfully added into member list',
        },
        { status: 200 },
      );
    }
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
