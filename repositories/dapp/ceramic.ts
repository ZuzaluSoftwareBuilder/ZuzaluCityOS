import { Result } from '@/models/base';
import { CreateDappInput, Dapp, UpdateDappInput } from '@/models/dapp';
import {
  CREATE_DAPP_MUTATION,
  GET_DAPP_LIST_QUERY,
  UPDATE_DAPP_MUTATION,
} from '@/services/graphql/dApp';
import { executeQuery } from '@/utils/ceramic';
import dayjs from 'dayjs';
import { BaseDappRepository } from './type';

export class CeramicDappRepository extends BaseDappRepository {
  async create(dappInput: CreateDappInput): Promise<Result<Dapp>> {
    const {
      appName,
      developerName,
      description,
      tagline,
      bannerUrl,
      devStatus,
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
      appType,
    } = dappInput;

    const response = await executeQuery(CREATE_DAPP_MUTATION, {
      input: {
        content: {
          profileId,
          createdAtTime: dayjs().toISOString(),
          appType,
          appName,
          developerName,
          description,
          tagline,
          categories,
          appLogoUrl,
          bannerUrl,
          devStatus,
          openSource: this.getBooleanValue(openSource),
          repositoryUrl: this.getValue(repositoryUrl),
          isSCApp: this.getBooleanValue(isSCApp),
          scAddresses: this.getValue(scAddresses),
          isInstallable: this.getBooleanValue(isInstallable),
          websiteUrl: this.getValue(websiteUrl),
          docsUrl: this.getValue(docsUrl),
          auditLogUrl: this.getValue(auditLogUrl),
          appUrl: this.getValue(appUrl),
        },
      },
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to create dapp',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const data = result?.data?.createZucityDappInfo?.document;
    if (!data) {
      return this.createResponse(
        null,
        new Error('Failed to create dapp: No valid data returned'),
      );
    }

    const dapp = this.transformToDapp(data);
    if (!dapp) {
      return this.createResponse(
        null,
        new Error('Failed to create dapp: Data transformation error'),
      );
    }

    return this.createResponse(dapp);
  }

  async update(id: string, dappInput: UpdateDappInput): Promise<Result<Dapp>> {
    const {
      appName,
      developerName,
      description,
      tagline,
      bannerUrl,
      devStatus,
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
      appType,
    } = dappInput;

    const response = await executeQuery(UPDATE_DAPP_MUTATION, {
      input: {
        id,
        content: {
          appType,
          appName,
          developerName,
          description,
          tagline,
          categories,
          appLogoUrl,
          bannerUrl,
          devStatus,
          openSource: this.getBooleanValue(openSource),
          repositoryUrl: this.getValue(repositoryUrl),
          isSCApp: this.getBooleanValue(isSCApp),
          scAddresses: this.getValue(scAddresses),
          isInstallable: this.getBooleanValue(isInstallable),
          websiteUrl: this.getValue(websiteUrl),
          docsUrl: this.getValue(docsUrl),
          auditLogUrl: this.getValue(auditLogUrl),
          appUrl: this.getValue(appUrl),
        },
      },
    });

    const result = this.handleGraphQLResponse(
      response,
      'Failed to update dapp',
    );
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const data = result?.data?.updateZucityDappInfo?.document;
    if (!data) {
      return this.createResponse(
        null,
        new Error('Failed to update dapp: No valid data returned'),
      );
    }

    const dapp = this.transformToDapp(data);
    if (!dapp) {
      return this.createResponse(
        null,
        new Error('Failed to update dapp: Data transformation error'),
      );
    }

    return this.createResponse(dapp);
  }

  async getDapps(): Promise<Result<Dapp[]>> {
    const response = await executeQuery(GET_DAPP_LIST_QUERY, {
      first: 100,
    });

    const result = this.handleGraphQLResponse(response, 'Failed to get dapps');
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    if (!result?.data?.zucityDappInfoIndex?.edges) {
      return this.createResponse(null, new Error('No dapps found'));
    }

    return this.createResponse(
      result.data.zucityDappInfoIndex.edges.map((edge) => edge?.node),
    );
  }

  protected transformToDapp(data: any): Dapp {
    return {
      ...data,
      isInstallable: this.setBooleanValue(data.isInstallable),
      isSCApp: this.setBooleanValue(data.isSCApp),
      openSource: this.setBooleanValue(data.openSource),
    };
  }
}
