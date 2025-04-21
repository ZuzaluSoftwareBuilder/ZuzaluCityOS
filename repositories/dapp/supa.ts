import { CreateDappInput } from '@/models/dapp';
import { supabase } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import { BaseDappRepository } from './type';

export class SupaDappRepository extends BaseDappRepository {
  async create(dappInput: CreateDappInput): Promise<string | null> {
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
      throw new Error(error.message);
    }

    return data?.id || null;
  }

  async update(id: string, dappInput: any): Promise<string | null> {
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
    } = dappInput;

    const { data, error } = await supabase
      .from('dapps')
      .update({
        app_url: !appUrl || appUrl === '' ? null : appUrl,
        app_name: appName,
        app_logo_url: appLogoUrl,
        developer_name: developerName,
        description,
        tagline,
        banner_url: bannerUrl,
        dev_status: devStatus,
        categories: Array.isArray(categories)
          ? categories.join(',')
          : categories,
        open_source: openSource,
        website_url: this.getValue(websiteUrl),
        repository_url: this.getValue(repositoryUrl),
        docs_url: this.getValue(docsUrl),
        is_sc_app: isSCApp,
        sc_addresses:
          isSCApp && scAddresses
            ? JSON.stringify(
                scAddresses.split(',').map((item: string) => ({
                  address: item,
                  chain: '',
                })),
              )
            : null,
        is_installable: isInstallable,
        audit_log_url: this.getValue(auditLogUrl),
      })
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data?.id || null;
  }
}
