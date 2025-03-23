import { Dapp } from '@/types';

export interface NativeDApp
  extends Pick<
    Dapp,
    | 'appName'
    | 'categories'
    | 'bannerUrl'
    | 'tagline'
    | 'developerName'
    | 'description'
    | 'devStatus'
    | 'openSource'
    | 'repositoryUrl'
    | 'appUrl' // should change
  > {
  profile: Pick<Dapp['profile'], 'avatar' | 'username'>;

  // Custom fields
  isNative: true;
  isComingSoon?: boolean;
  appIdentifier: string;
}

export const isNativeDApp = (dapp: Dapp | NativeDApp): dapp is NativeDApp => {
  return 'isNative' in dapp && dapp.isNative;
};

export const NATIVE_APPS: NativeDApp[] = [
  {
    appIdentifier: 'calendar',

    appName: 'Calendar',
    categories: 'Events,community calls,Privacy',
    tagline: 'Keep track of your schedule',
    developerName: 'Zuzalu City',
    description: 'A calendar app to keep track of your schedule.',
    devStatus: 'Live',
    openSource: true,
    repositoryUrl: '#',
    appUrl: '#',
    bannerUrl: '/dapps/calendar.svg',
    profile: {
      avatar: '/user/official.jpg',
      username: 'Zuzalu City',
    },
  },
  {
    isComingSoon: true,
    appIdentifier: 'zuland',

    appName: 'Zuland',
    categories: 'Forums,Discussions,social',
    tagline: 'A community forum',
    developerName: 'Urbe.eth',
    description: 'A community forum for discussions and socializing.',
    devStatus: 'Live',
    openSource: true,
    repositoryUrl: '#',
    appUrl: '#',
    bannerUrl: '/dapps/zuland.svg',
    profile: {
      avatar: '/user/official.jpg',
      username: 'Urbe.eth',
    },
  },
  {
    isComingSoon: true,
    appIdentifier: 'announcements',

    appName: 'Announcements',
    categories: 'Forums,Discussions,social',
    tagline: 'A community forum',
    developerName: 'Zuzalu City',
    description: 'A community forum for discussions and socializing.',
    devStatus: 'Live',
    openSource: true,
    repositoryUrl: '#',
    appUrl: '#',
    bannerUrl: '/dapps/announcements.svg',
    profile: {
      avatar: '/user/official.jpg',
      username: 'Zuzalu City',
    },
  },
].map((app) => ({ ...app, isNative: true }));
