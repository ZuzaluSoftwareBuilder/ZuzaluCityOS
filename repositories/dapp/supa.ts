import { supabase } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import { BaseDappRepository } from './type';

export class SupaDappRepository extends BaseDappRepository {
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

    const { data, error } = await supabase
      .from('dapps')
      .insert({
        profile_id: profileId,
        created_at: dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        app_type: 'space',
        app_name: appName,
        developer_name: developerName,
        description,
        tagline,
        categories: Array.isArray(categories)
          ? categories.join(',')
          : categories,
        app_logo_url: appLogoUrl,
        banner_url: bannerUrl,
        dev_status: developmentStatus,
        open_source: openSource,
        repository_url: repositoryUrl,
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
        dev_status: developmentStatus,
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
