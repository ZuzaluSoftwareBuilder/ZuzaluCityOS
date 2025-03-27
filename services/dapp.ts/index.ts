import dayjs from 'dayjs';
import { ComposeClient } from '@composedb/client';
import { executeQuery } from '@/utils/ceramic';
import { CREATE_DAPP_MUTATION } from '../graphql/dApp';

const getValue = (value: any) => {
  return !value || value === '' ? null : value;
};

const getBooleanValue = (value: any) => {
  return value ? '1' : '0';
};

export const createDapp = async (dappInput: any) => {
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
    appLogoUrl,
    isInstallable,
    isSCApp,
    scAddresses,
    auditLogUrl,
  } = dappInput;

  console.log(dappInput);

  const result = await executeQuery(CREATE_DAPP_MUTATION, {
    input: {
      content: {
        profileId,
        createdAtTime: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        appType: 'space',
        appName,
        developerName,
        description,
        tagline,
        categories: categories.join(','),
        appLogoUrl,
        bannerUrl,
        devStatus: developmentStatus,
        openSource: getBooleanValue(openSource),
        repositoryUrl: getValue(repositoryUrl),
        isSCApp: getBooleanValue(isSCApp),
        scAddresses:
          isSCApp && scAddresses
            ? scAddresses.split(',').map((item: string) => ({
                address: item,
              }))
            : null,
        isInstallable: getBooleanValue(isInstallable),
        websiteUrl: getValue(websiteUrl),
        docsUrl: getValue(docsUrl),
        auditLogUrl: getValue(auditLogUrl),
        appUrl: getValue(appUrl),
      },
    },
  });

  console.log(result);

  return result?.data?.createZucityDappInfo?.document?.id;
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
