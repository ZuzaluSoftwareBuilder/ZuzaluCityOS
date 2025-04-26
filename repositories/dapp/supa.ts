import { Result } from '@/models/base';
import {
  CreateDappInput,
  Dapp,
  InstalledApp,
  UpdateDappInput,
} from '@/models/dapp';
import { formatProfile } from '@/utils/profile';
import { supabase } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import { BaseDappRepository } from './type';

export class SupaDappRepository extends BaseDappRepository {
  private readonly tableName = 'dapp_infos';
  private readonly installationTableName = 'installed_apps';

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

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        author: profileId,
        created_at: dayjs().toISOString(),
        app_type: appType,
        app_name: appName,
        developer_name: developerName,
        description,
        tagline,
        categories,
        app_logo_url: appLogoUrl,
        banner_url: bannerUrl,
        dev_status: devStatus,
        open_source: this.getBooleanValue(openSource),
        repository_url: this.getValue(repositoryUrl),
        is_sc_app: this.getBooleanValue(isSCApp),
        sc_addresses: this.getValue(scAddresses),
        is_installable: this.getBooleanValue(isInstallable),
        website_url: this.getValue(websiteUrl),
        docs_url: this.getValue(docsUrl),
        audit_log_url: this.getValue(auditLogUrl),
        app_url: this.getValue(appUrl),
      })
      .select('id')
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    const dapp = this.transformDapp(data);
    if (!dapp) {
      return this.createResponse(null, new Error('Invalid dapp data'));
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

    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        app_type: appType,
        app_name: appName,
        developer_name: developerName,
        description,
        tagline,
        categories,
        app_logo_url: appLogoUrl,
        banner_url: bannerUrl,
        dev_status: devStatus,
        open_source: this.getBooleanValue(openSource),
        repository_url: this.getValue(repositoryUrl),
        is_sc_app: this.getBooleanValue(isSCApp),
        sc_addresses: this.getValue(scAddresses),
        is_installable: this.getBooleanValue(isInstallable),
        website_url: this.getValue(websiteUrl),
        docs_url: this.getValue(docsUrl),
        audit_log_url: this.getValue(auditLogUrl),
        app_url: this.getValue(appUrl),
      })
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    if (!data) {
      return this.createResponse(null, new Error('Invalid dapp data'));
    }
    return this.createResponse(data);
  }

  async getDapps(): Promise<Result<Dapp[]>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`*, author(*)`);

    if (error) {
      return this.createResponse(null, error);
    }

    const transformedDapps = data.map((item) =>
      this.transformDapp(item),
    ) as Dapp[];
    if (!transformedDapps) {
      return this.createResponse(null, new Error('Dapps not found'));
    }
    return this.createResponse(transformedDapps);
  }

  async installDapp(
    spaceId: string,
    dappId: string,
    nativeAppName?: string,
  ): Promise<Result<InstalledApp>> {
    try {
      const { data: installedApp, error } = await (
        supabase
          .from(this.installationTableName)
          .insert({
            space_id: this.getValue(spaceId),
            installed_app_id: this.getValue(dappId),
            native_app_name: this.getValue(nativeAppName),
          })
          .select('*, dapp:installed_app_id(*)') as any
      ).single();
      if (error) {
        return this.createResponse(null, error);
      }

      if (!installedApp || !installedApp.dapp) {
        return this.createResponse(null, new Error('Failed to install dApp'));
      }

      const result = this.transformInstalledApp(installedApp);
      return this.createResponse(result);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getSpaceInstalledApps(
    spaceId: string,
  ): Promise<Result<InstalledApp[]>> {
    try {
      const { data: installedApps, error } = await (
        supabase
          .from(this.installationTableName as any)
          .select('*, dapp:installed_app_id(*)') as any
      ).eq('space_id', spaceId);

      if (error) {
        console.log('installedApps', error);
        return this.createResponse(null, error);
      }

      const transformedInstalledApps = (installedApps || [])
        .map((app: any) => {
          if (!app || !app.dapp) return null;
          return this.transformInstalledApp(app);
        })
        .filter(Boolean) as InstalledApp[];

      return this.createResponse(transformedInstalledApps);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async uninstallDapp(installedAppId: string): Promise<Result<InstalledApp>> {
    try {
      const { data: installedApp, error: fetchError } = await (
        supabase
          .from(this.installationTableName as any)
          .select('*, dapp:installed_app_id(*)') as any
      )
        .eq('id', installedAppId)
        .single();

      if (fetchError) {
        return this.createResponse(null, fetchError);
      }

      const { error: deleteError } = await (
        supabase.from(this.installationTableName as any).delete() as any
      ).eq('id', installedAppId);

      if (deleteError) {
        return this.createResponse(null, deleteError);
      }

      if (!installedApp || !installedApp.dapp) {
        return this.createResponse(null, new Error('Failed to uninstall dApp'));
      }

      const result = this.transformInstalledApp(installedApp);
      return this.createResponse(result);
    } catch (error) {
      return this.createResponse(null, error);
    }
  }

  async getDappById(id: string): Promise<Result<Dapp>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(`*, author(*)`)
      .eq('id', id)
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    if (!data) {
      return this.createResponse(null, new Error('Dapp not found'));
    }

    const transformedDapp = this.transformDapp(data);
    if (!transformedDapp) {
      return this.createResponse(
        null,
        new Error('Failed to transform dapp data'),
      );
    }

    return this.createResponse(transformedDapp);
  }

  public transformInstalledApp(data: any): InstalledApp {
    const dapp = data.dapp_info
      ? this.transformDapp(data.dapp_info)
      : undefined;
    return {
      id: data.id,
      installedAppId: data.installed_app_id,
      nativeAppName: data.native_app_name,
      installedApp: dapp,
    };
  }

  private transformDapp(dapp: any): Dapp {
    return {
      id: dapp.id,
      tagline: dapp.tagline,
      description: dapp.description,
      categories: dapp.categories,
      appName: dapp.app_name,
      developerName: dapp.developer_name,
      bannerUrl: dapp.banner_url,
      appLogoUrl: dapp.app_logo_url,
      devStatus: dapp.dev_status,
      openSource: this.setBooleanValue(dapp.open_source),
      websiteUrl: dapp.website_url,
      repositoryUrl: dapp.repository_url,
      appUrl: dapp.app_url,
      docsUrl: dapp.docs_url,
      isInstallable: this.setBooleanValue(dapp.is_installable),
      isSCApp: this.setBooleanValue(dapp.is_sc_app),
      scAddresses: dapp.sc_addresses,
      auditLogUrl: dapp.audit_log_url,
      appType: dapp.app_type,
      profile: formatProfile(dapp.author, 'supabase'),
    };
  }
}
