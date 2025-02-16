import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { ceramic, composeClient } from '@/constant';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

export async function POST(req: Request) {
  try {
    let seed = crypto.getRandomValues(new Uint8Array(32));
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    await did.authenticate();
    ceramic.did = did;
    composeClient.setDID(did);
    const body = await req.json();

    const {
      appName,
      developerName,
      description,
      tagline,
      bannerUrl,
      developmentStatus,
      categories,
      openSource,
      websiteUrl,
      repositoryUrl,
      appUrl,
      docsUrl,
      profileId,
    } = body;

    const update: any = await composeClient.executeQuery(
      `
      mutation CreateZucityDappMutation($input: CreateZucityDappInfoInput!) {
        createZucityDappInfo(
          input: $input
        ) {
          document {
            id
            appUrl
            appName
            appType
            docsUrl
            tagline
            bannerUrl
            devStatus
            profileId
            categories
            openSource
            websiteUrl
            description
            createdAtTime
            developerName
            repositoryUrl
          }
        }
      }
      `,
      {
        input: {
          content: {
            profileId,
            createdAtTime: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            appType: 'beta',
            appUrl: !appUrl || appUrl === '' ? null : appUrl,
            appName,
            developerName,
            description,
            tagline,
            bannerUrl,
            devStatus: developmentStatus,
            categories: categories.join(','),
            openSource: openSource ? '1' : '0',
            websiteUrl: !websiteUrl || websiteUrl === '' ? null : websiteUrl,
            repositoryUrl:
              !repositoryUrl || repositoryUrl === '' ? null : repositoryUrl,
            docsUrl: !docsUrl || docsUrl === '' ? null : docsUrl,
          },
        },
      },
    );

    console.log(update);

    const dappId = update.data.createZucityDappInfo.document.id;

    return NextResponse.json(
      {
        data: {
          dappId,
        },
        message:
          'Submitted! Create process probably complete after few minutes.',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
}
