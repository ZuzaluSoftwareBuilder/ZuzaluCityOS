import { IDappRepository } from '@/repositories/dapp/type';

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

  return dappRepository.update(id, {
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
    repositoryUrl: openSource ? repositoryUrl : null,
    isSCApp,
    scAddresses:
      isSCApp && scAddresses
        ? scAddresses.split(',').map((item: string) => ({
            address: item,
          }))
        : null,
    isInstallable,
    appUrl: isInstallable ? appUrl : null,
    websiteUrl,
    docsUrl,
    auditLogUrl,
  });
};
