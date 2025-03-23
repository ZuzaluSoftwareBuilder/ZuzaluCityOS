import dayjs from 'dayjs';
import { ComposeClient } from '@composedb/client';
import { executeQuery } from '@/utils/ceramic';
import { UPDATE_SPACE_INSTALLED_DAPPS } from '../graphql/space';
import { getSpaceInstalledDapps } from '../space';

export const createDapp = async (
  composeClient: ComposeClient,
  dappInput: any,
) => {
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
  } = dappInput;

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

  return update.data.createZucityDappInfo.document.id;
};

export const updateDapp = async (
  composeClient: ComposeClient,
  dappInput: any,
) => {
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
    id,
  } = dappInput;

  const update: any = await composeClient.executeQuery(
    `
      mutation UpdateZucityDappMutation($input: UpdateZucityDappInfoInput!) {
        updateZucityDappInfo(
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

  return update.data.updateZucityDappInfo.document.id;
};
