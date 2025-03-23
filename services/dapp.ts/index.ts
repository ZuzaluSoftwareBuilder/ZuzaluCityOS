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

export const installDappToSpace = async (spaceId: string, appId: string) => {
  const dapp = await getSpaceInstalledDapps(appId);
  const currentInstalledSpaces = dapp.installedSpaces || [];

  // 检查是否已经安装在该空间
  if (currentInstalledSpaces.includes(spaceId)) {
    return dapp.id; // 已安装，直接返回
  }

  // 添加新的 spaceId 到 installedSpaces 数组
  const updatedInstalledSpaces = [...currentInstalledSpaces, spaceId];

  // 更新 DApp 信息
  const update: any = await executeQuery(UPDATE_SPACE_INSTALLED_DAPPS, {
    input: {
      id: appId,
      content: {
        installedSpaces: updatedInstalledSpaces,
      },
    },
  });

  return update.data.updateZucityDappInfo.document.id;
};

export const uninstallDappFromSpace = async (
  spaceId: string,
  appId: string,
) => {
  const dapp = await getSpaceInstalledDapps(appId);
  const currentInstalledSpaces = dapp.installedSpaces || [];

  // 如果该空间不在已安装列表中，直接返回
  if (!currentInstalledSpaces.includes(spaceId)) {
    return dapp.id;
  }

  // 从 installedSpaces 数组中移除 spaceId
  const updatedInstalledSpaces = currentInstalledSpaces.filter(
    (id: string) => id !== spaceId,
  );

  // 更新 DApp 信息
  const update: any = await executeQuery(UPDATE_SPACE_INSTALLED_DAPPS, {
    input: {
      id: appId,
      content: {
        installedSpaces: updatedInstalledSpaces,
      },
    },
  });

  return update.data.updateZucityDappInfo.document.id;
};
