export interface InstalledApp {
  id: string;
  installedAppId?: string;
  nativeAppName?: string;
  installedApp?: Dapp;
}

export interface Dapp {
  id: string;
  appName: string;
  appType: string;
  developerName: string;
  description: string;
  bannerUrl: string;
  appLogoUrl: string;
  categories: string;
  devStatus: string;
  openSource: boolean;
  repositoryUrl?: string;
  appUrl?: string;
  websiteUrl?: string;
  docsUrl?: string;
  tagline: string;
  isInstallable: string;
  isSCApp: boolean;
  scAddresses?: {
    address: string;
    chain: string;
  }[];
  auditLogUrl: string;
  profile: {
    author: {
      id: string;
    };
    username: string;
    avatar: string;
  };
  isLegacy?: boolean;
}

export type CreateDappInput = Omit<Dapp, 'id' | 'profile' | 'isLegacy'> & {
  profileId: string;
};

export type UpdateDappInput = Omit<Dapp, 'id' | 'profile' | 'isLegacy'>;
