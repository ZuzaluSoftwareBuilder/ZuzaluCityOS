import { Dapp } from '@/models/dapp';

export interface NativeDApp
  extends Pick<
    Dapp,
    | 'appName'
    | 'categories'
    | 'appLogoUrl'
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
    appLogoUrl: '/dapps/calendar.svg',
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
    tagline: 'A private, token-gated, decentralized social network',
    developerName: 'Urbe.eth',
    description: `A private, token-gated, decentralized social network built by AKASHA core and Builders’ Garden where only users with specific credentials can read and write content, enhances Zuzalu.city with a social feed function. It focuses on a commenting system and feed that can be integrated into other projects using Ceramic's ComposeDB and Web3 storage.`,
    devStatus: 'Live',
    openSource: true,
    repositoryUrl: '#',
    appUrl: '#',
    appLogoUrl: '/dapps/zuland.svg',
    profile: {
      avatar: '/user/official.jpg',
      username: 'Urbe.eth',
    },
  },
  /*{
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
    appLogoUrl: '/dapps/announcements.svg',
    profile: {
      avatar: '/user/official.jpg',
      username: 'Zuzalu City',
    },
  },*/
].map((app) => ({
  ...app,
  isNative: true,
  description: JSON.stringify({
    time: +Date.now(),
    blocks: [
      {
        id: 'description',
        type: 'paragraph',
        data: { text: app.description },
      },
    ],
    version: '2.29.1',
  }),
}));
