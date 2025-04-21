import { IDappRepository } from '@/repositories/dapp/type';
import { executeQuery } from '@/utils/ceramic';
import { UPDATE_DAPP_MUTATION } from '../graphql/dApp';

const getValue = (value: any) => {
  return !value || value === '' ? null : value;
};

const getBooleanValue = (value: any) => {
  return value ? '1' : '0';
};

export const createDapp = async (
  dappInput: any,
  dappRepository: IDappRepository,
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
    appLogoUrl,
    isInstallable,
    isSCApp,
    scAddresses,
    auditLogUrl,
  } = dappInput;

  return dappRepository.create({
    profileId,
    appType: 'space',
    appName,
    developerName,
    description,
    tagline,
    categories: categories.join(','),
    appLogoUrl,
    bannerUrl,
    devStatus: developmentStatus,
    openSource,
    repositoryUrl,
    isSCApp,
    scAddresses:
      isSCApp && scAddresses
        ? scAddresses.split(',').map((item: string) => ({
            address: item,
          }))
        : null,
    isInstallable,
    websiteUrl,
    docsUrl,
    auditLogUrl,
    appUrl,
  });
};

export const updateDapp = async (
  dappInput: any,
  dappRepository: IDappRepository,
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
    appLogoUrl,
    isInstallable,
    isSCApp,
    scAddresses,
    auditLogUrl,
  } = dappInput;

  const update: any = await executeQuery(UPDATE_DAPP_MUTATION, {
    input: {
      id,
      content: {
        appUrl: !appUrl || appUrl === '' ? null : appUrl,
        appName,
        appLogoUrl,
        developerName,
        description,
        tagline,
        bannerUrl,
        devStatus: developmentStatus,
        categories: categories.join(','),
        openSource: getBooleanValue(openSource),
        websiteUrl: getValue(websiteUrl),
        repositoryUrl: getValue(repositoryUrl),
        docsUrl: getValue(docsUrl),
        isSCApp: getBooleanValue(isSCApp),
        scAddresses:
          isSCApp && scAddresses
            ? scAddresses.split(',').map((item: string) => ({
                address: item,
              }))
            : null,
        isInstallable: getBooleanValue(isInstallable),
        auditLogUrl: getValue(auditLogUrl),
      },
    },
  });

  return update.data.updateZucityDappInfo.document.id;
};
