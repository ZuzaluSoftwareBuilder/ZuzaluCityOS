import {
  CREATE_DAPP_MUTATION,
  UPDATE_DAPP_MUTATION,
} from '@/services/graphql/dApp';
import { executeQuery } from '@/utils/ceramic';
import dayjs from 'dayjs';
import { BaseDappRepository } from './type';

export class CeramicDappRepository extends BaseDappRepository {
  async create(dappInput: any): Promise<string | null> {
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
          categories: Array.isArray(categories)
            ? categories.join(',')
            : categories,
          appLogoUrl,
          bannerUrl,
          devStatus: developmentStatus,
          openSource,
          repositoryUrl: this.getValue(repositoryUrl),
          isSCApp,
          scAddresses:
            isSCApp && scAddresses
              ? scAddresses.split(',').map((item: string) => ({
                  address: item,
                }))
              : null,
          isInstallable,
          websiteUrl: this.getValue(websiteUrl),
          docsUrl: this.getValue(docsUrl),
          auditLogUrl: this.getValue(auditLogUrl),
          appUrl: this.getValue(appUrl),
        },
      },
    });

    if (result.errors) {
      throw new Error(result.errors.message);
    }

    return result?.data?.createZucityDappInfo?.document?.id || null;
  }

  async update(id: string, dappInput: any): Promise<string | null> {
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
      appLogoUrl,
      isInstallable,
      isSCApp,
      scAddresses,
      auditLogUrl,
    } = dappInput;

    const result = await executeQuery(UPDATE_DAPP_MUTATION, {
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
          categories: Array.isArray(categories)
            ? categories.join(',')
            : categories,
          openSource,
          websiteUrl: this.getValue(websiteUrl),
          repositoryUrl: this.getValue(repositoryUrl),
          docsUrl: this.getValue(docsUrl),
          isSCApp,
          scAddresses:
            isSCApp && scAddresses
              ? scAddresses.split(',').map((item: string) => ({
                  address: item,
                }))
              : null,
          isInstallable,
          auditLogUrl: this.getValue(auditLogUrl),
        },
      },
    });

    if (result.errors) {
      throw new Error(result.errors.message);
    }

    return result?.data?.updateZucityDappInfo?.document?.id || null;
  }
}
