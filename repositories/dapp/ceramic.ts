import { Result } from '@/models/base';
import {
  CreateDappInput,
  Dapp,
  InstalledApp,
  UpdateDappInput,
} from '@/models/dapp';
import {
  CREATE_DAPP_MUTATION,
  GET_DAPP_LIST_QUERY,
  GET_DAPP_QUERY,
  UPDATE_DAPP_MUTATION,
} from '@/services/graphql/dApp';
import {
  GET_SPACE_INSTALLED_APPS,
  INSTALL_DAPP_TO_SPACE,
  UNINSTALL_DAPP_FROM_SPACE,
} from '@/services/graphql/space';
import { executeQuery } from '@/utils/ceramic';
import { formatProfile } from '@/utils/profile';
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

  async installDapp(
    spaceId: string,
    dappId: string,
    nativeAppName?: string,
  ): Promise<Result<InstalledApp>> {
    try {
      const response = await executeQuery(INSTALL_DAPP_TO_SPACE, {
        input: {
          content: {
            spaceId: spaceId,
            sourceId: spaceId,
            installedAppId: dappId,
            nativeAppName: nativeAppName || '',
            createdAt: dayjs().utc().toISOString(),
            updatedAt: dayjs().utc().toISOString(),
          },
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to install dApp',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const installedAppData =
        response.data?.createZucityInstalledApp?.document;
      if (!installedAppData) {
        return this.createResponse(
          null,
          new Error('Failed to install dApp: No valid data returned'),
        );
      }

      const installedApp: InstalledApp = {
        id: installedAppData.id,
        installedAppId: installedAppData.installedAppId || '',
        nativeAppName: installedAppData.nativeAppName || '',
        installedApp: installedAppData.installedApp
          ? {
              id: installedAppData.installedApp.id,
              appName: installedAppData.installedApp.appName,
              appType: '',
              description: '',
              tagline: '',
              bannerUrl: '',
              appLogoUrl: '',
              developerName: '',
              categories: '',
              devStatus: '',
              openSource: false,
              isInstallable: true,
              isSCApp: false,
              profile: {
                id: '',
                username: '',
                avatar: '',
                address: '',
                did: '',
              },
              auditLogUrl: '',
            }
          : undefined,
      };

      return this.createResponse(installedApp);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getSpaceInstalledApps(
    spaceId: string,
  ): Promise<Result<InstalledApp[]>> {
    try {
      const variables: Record<string, any> = {
        filters: {
          where: {
            spaceId: {
              equalTo: spaceId,
            },
          },
        },
        first: 100,
      };

      const response = await executeQuery(GET_SPACE_INSTALLED_APPS, variables);

      const result = this.handleGraphQLResponse(
        response,
        'Failed to get installed apps',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const edges = response.data?.zucityInstalledAppIndex?.edges || [];
      const installedApps = edges
        .map((edge: any) => {
          const node = edge.node;
          const app: InstalledApp = {
            id: node.id,
            installedAppId: node.installedAppId || '',
            nativeAppName: node.nativeAppName || '',
            installedApp: node.installedApp
              ? {
                  id: node.installedApp.id,
                  appName: node.installedApp.appName,
                  appType: node.installedApp.appType || '',
                  description: node.installedApp.description || '',
                  tagline: node.installedApp.tagline || '',
                  bannerUrl: node.installedApp.bannerUrl || '',
                  appUrl: node.installedApp.appUrl || '',
                  openSource: this.setBooleanValue(
                    node.installedApp.openSource,
                  ),
                  devStatus: node.installedApp.devStatus || '',
                  developerName: node.installedApp.developerName || '',
                  categories: node.installedApp.categories || '',
                  appLogoUrl: node.installedApp.appLogoUrl || '',
                  isInstallable: true,
                  isSCApp: false,
                  profile: {
                    id: '',
                    username: '',
                    avatar: '',
                    address: '',
                    did: '',
                  },
                  auditLogUrl: '',
                }
              : undefined,
          };
          return app;
        })
        .filter(Boolean) as InstalledApp[];

      return this.createResponse(installedApps);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async uninstallDapp(installedAppId: string): Promise<Result<InstalledApp>> {
    try {
      const response = await executeQuery(UNINSTALL_DAPP_FROM_SPACE, {
        input: {
          id: installedAppId,
          shouldIndex: false,
        },
      });

      const result = this.handleGraphQLResponse(
        response,
        'Failed to uninstall dApp',
      );
      if (result.error) {
        return { data: null, error: result.error };
      }

      const uninstalledAppData =
        response.data?.enableIndexingZucityInstalledApp?.document;
      if (!uninstalledAppData) {
        return this.createResponse(
          null,
          new Error('Failed to uninstall dApp: No valid data returned'),
        );
      }

      const uninstalledApp: InstalledApp = {
        id: uninstalledAppData.id,
        installedAppId: uninstalledAppData.installedAppId || '',
        nativeAppName: '',
        installedApp: uninstalledAppData.installedApp
          ? {
              id: uninstalledAppData.installedApp.id,
              appName: uninstalledAppData.installedApp.appName,
              appType: '',
              description: '',
              tagline: '',
              bannerUrl: '',
              appLogoUrl: '',
              developerName: '',
              categories: '',
              devStatus: '',
              openSource: false,
              isInstallable: true,
              isSCApp: false,
              profile: {
                id: '',
                username: '',
                avatar: '',
                did: '',
                address: '',
              },
              auditLogUrl: '',
            }
          : undefined,
      };

      return this.createResponse(uninstalledApp);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getDappById(id: string): Promise<Result<Dapp>> {
    const response = await executeQuery(GET_DAPP_QUERY, {
      id,
    });

    const result = this.handleGraphQLResponse(response, 'Failed to get dapp');
    if (result.error) {
      return this.createResponse(null, result.error);
    }

    const data = result?.data?.node;
    if (!data) {
      return this.createResponse(null, new Error('Dapp not found'));
    }

    const dapp = this.transformToDapp(data);
    if (!dapp) {
      return this.createResponse(
        null,
        new Error('Failed to transform dapp data'),
      );
    }

    return this.createResponse(dapp);
  }

  protected transformToDapp(data: any): Dapp {
    return {
      ...data,
      isInstallable: this.setBooleanValue(data.isInstallable),
      isSCApp: this.setBooleanValue(data.isSCApp),
      openSource: this.setBooleanValue(data.openSource),
      profile: formatProfile(data.author, 'ceramic'),
    };
  }
}
