import { Result } from '@/models/base';
import { CreateDappInput, Dapp, UpdateDappInput } from '@/models/dapp';
import { supabase } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import { BaseDappRepository } from './type';

export class SupaDappRepository extends BaseDappRepository {
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
      .from('dapp_infos')
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
      .from('dapp_infos')
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

    const dapp = this.transformDapp(data);
    if (!dapp) {
      return this.createResponse(null, new Error('Invalid dapp data'));
    }
    return this.createResponse(dapp);
  }

  async getDapps(): Promise<Result<Dapp[]>> {
    const { data, error } = await supabase
      .from('dapp_infos')
      .select(`*, author(*)`);

    if (error) {
      return this.createResponse(null, error);
    }

    const transformedDapps = data.map(this.transformDapp) as Dapp[];
    if (!transformedDapps) {
      return this.createResponse(null, new Error('Dapps not found'));
    }
    return this.createResponse(transformedDapps);
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
      profile: {
        author: {
          id: dapp.author.user_id,
        },
        username: dapp.author.username,
        avatar: dapp.author.avatar,
      },
    };
  }
}
