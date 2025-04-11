import {
  AkashaApp,
  AkashaAppApplicationType,
  AkashaAppReleaseInterface,
  AkashaContentBlock,
  AkashaContentBlockBlockDef,
  AkashaReflectInterfaceConnection,
  AppProviderValueInput,
  BeamEmbeddedType,
  BeamLabeled,
  BlockLabeledValue,
  BlockLabeledValueInput,
  CeramicAccount,
  ProfileImageSourceInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';
import { Descendant } from 'slate';

export type BeamsByAuthorDid = {
  akashaBeamListCount: number;
  isViewer: boolean;
  akashaBeamList: {
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        reflectionsCount: number;
        active: boolean;
        version: any;
        createdAt: any;
        nsfw: boolean | null;
        appVersionID: any;
        appID: any;
        embeddedStream: {
          label: string;
          embeddedID: any;
        } | null;
        author: {
          id: string;
          isViewer: boolean;
        };
        content: AkashaContentBlock[];
        tags: Array<{
          labelType: string;
          value: string;
        } | null> | null;
        mentions: Array<{
          id: string;
        } | null> | null;
        reflections: {
          edges: Array<{
            cursor: string;
          } | null> | null;
          pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string | null;
            endCursor: string | null;
          };
        };
      } | null;
    } | null> | null;
    pageInfo: {
      startCursor: string | null;
      endCursor: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  } | null;
};

export type ZulandReadableBeam = {
  active: boolean;
  app?: AkashaApp;
  appID: string;
  appVersion?: AkashaAppReleaseInterface;
  appVersionID: string;
  /** Account controlling the document */
  author: {
    akashaProfile: AkashaProfile;
    isViewer: boolean;
  };
  createdAt: string;
  embeddedStream?: BeamEmbeddedType;
  id: string;
  mentions?: Array<CeramicAccount>;
  nsfw?: boolean;
  reflections: AkashaReflectInterfaceConnection;
  reflectionsCount: number;
  tags?: Array<BeamLabeled>;
  /** Current version of the document */
  version: string;
  content: ZulandReadbleBlock[];
};

export type ZulandReadbleBlock = {
  active: boolean;
  appVersion?: AkashaAppReleaseInterface;
  appVersionID: string;
  /** Account controlling the document */
  author: CeramicAccount;
  content: ZulandReadableBlockContent[];
  createdAt: string;
  id: string;
  kind?: AkashaContentBlockBlockDef;
  nsfw?: string;
  /** Current version of the document */
  version: string;
  order: number;
};

export type AkashaProfileStats = {
  akashaFollowListCount: number;
  akashaBeamListCount: number;
  akashaReflectListCount: number;
  isViewer: boolean;
  akashaProfile?: {
    followersCount: number;
    id: string;
    name: string;
    description?: string | null;
    appVersionID: any;
    appID: any;
    createdAt: any;
    nsfw?: boolean | null;
    did: {
      id: string;
      isViewer: boolean;
    };
    links?: Array<{
      href: any;
      label?: string | null;
    } | null> | null;
    background?: {
      alternatives?: Array<{
        src: any;
        width: number;
        height: number;
      } | null> | null;
      default: {
        src: any;
        width: number;
        height: number;
      };
    } | null;
    avatar?: {
      default: {
        src: any;
        width: number;
        height: number;
      };
      alternatives?: Array<{
        src: any;
        width: number;
        height: number;
      } | null> | null;
    } | null;
    followers: {
      pageInfo: {
        startCursor?: string | null;
        endCursor?: string | null;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      };
    };
  };
};

export type ZulandProfileInput = {
  avatar?: {
    default: ProfileImageSourceInput;
    alternatives?: Array<ProfileImageSourceInput>;
  };
  description?: string;
  name: string;
  links?: Array<{ href: string; label: string | null }>;
};

export type ZulandCreateAppInput = {
  eventID: string;
  displayName: string;
  description: string;
  license?: string;
};

export type ZulandCreateAppReleaseInput = {
  applicationID: string;
  version: string;
  source: string;
  meta?: Array<AppProviderValueInput>;
};

export type ZulandCreateAppReleaseInputWithTicketRules = {
  applicationID: string;
  version: string;
  source: string;
  ticketRequirements?: {
    contractAddress: string;
    chain: string;
    method?: string;
    comparator?: string;
    value?: string;
  };
};

export type ZulandReadableReflectionResult = {
  reflections: {
    edges: {
      node: ZulandReadableReflection;
      cursor: string;
    }[];
    pageInfo: {
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  reflectionsCount: number;
};

export type ZulandReadableReflection = {
  content: ZulandReadableBlockContent[];
  id: string;
  version: any;
  active: boolean;
  isReply?: boolean | null;
  reflection?: any | null;
  createdAt: any;
  nsfw?: boolean | null;
  author: {
    akashaProfile: AkashaProfile;
    isViewer: boolean;
  };
  // author: {
  //   id: string;
  //   isViewer: boolean;
  // };
  beam?: {
    id: string;
    author: {
      id: string;
      isViewer: boolean;
    };
  };
};

export type ZulandContentBlockInput = {
  active?: boolean;
  content: Array<BlockLabeledValueInput>;
  createdAt?: string;
  nsfw?: boolean;
  kind?: AkashaContentBlockBlockDef;
};

export type AkashaAppDocument = {
  applicationID: any;
  id: string;
  source: any;
  version: string;
  createdAt: any;
  application?: {
    id: string;
    applicationType?: AkashaAppApplicationType | null;
    description: string;
    license: string;
    name: string;
    displayName: string;
    keywords?: Array<string | null> | null;
    releasesCount: number;
    releases: {
      edges?: Array<{
        cursor: string;
        node?: {
          id: string;
          createdAt: any;
          source: any;
          version: string;
        } | null;
      } | null> | null;
    };
    author: {
      id: string;
      isViewer: boolean;
      akashaProfile?: {
        id: string;
        name: string;
        description?: string | null;
        appID: any;
        appVersionID: any;
        createdAt: any;
        nsfw?: boolean | null;
        did: {
          id: string;
          isViewer: boolean;
        };
        links?: Array<{
          href: any;
          label?: string | null;
        } | null> | null;
        background?: {
          alternatives?: Array<{
            src: any;
            width: number;
            height: number;
          } | null> | null;
          default: {
            src: any;
            width: number;
            height: number;
          };
        } | null;
        avatar?: {
          default: {
            src: any;
            width: number;
            height: number;
          };
          alternatives?: Array<{
            src: any;
            width: number;
            height: number;
          } | null> | null;
        } | null;
        followers: {
          pageInfo: {
            startCursor?: string | null;
            endCursor?: string | null;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
          };
        };
      } | null;
    };
    contributors?: Array<{
      id: string;
      isViewer: boolean;
      akashaProfile?: {
        id: string;
        name: string;
        description?: string | null;
        appID: any;
        appVersionID: any;
        createdAt: any;
        nsfw?: boolean | null;
        did: {
          id: string;
          isViewer: boolean;
        };
        links?: Array<{
          href: any;
          label?: string | null;
        } | null> | null;
        background?: {
          alternatives?: Array<{
            src: any;
            width: number;
            height: number;
          } | null> | null;
          default: {
            src: any;
            width: number;
            height: number;
          };
        } | null;
        avatar?: {
          default: {
            src: any;
            width: number;
            height: number;
          };
          alternatives?: Array<{
            src: any;
            width: number;
            height: number;
          } | null> | null;
        } | null;
        followers: {
          pageInfo: {
            startCursor?: string | null;
            endCursor?: string | null;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
          };
        };
      } | null;
    } | null> | null;
  };
};

export type AkashaGetReflectionsFromBeamResponse = {
  node: {
    reflectionsCount: number;
    reflections: {
      edges?: Array<{
        cursor: string;
        node?: {
          id: string;
          version: any;
          active: boolean;
          isReply?: boolean | null;
          reflection?: any | null;
          createdAt: any;
          nsfw?: boolean | null;
          author: {
            id: string;
            isViewer: boolean;
          };
          content: Array<{
            label: string;
            propertyType: string;
            value: string;
          }>;
          beam?: {
            id: string;
            author: {
              id: string;
              isViewer: boolean;
            };
          } | null;
        } | null;
      } | null> | null;
      pageInfo: {
        startCursor?: string | null;
        endCursor?: string | null;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };
  };
};

export type AkashaReflectionsFromBeam = {
  reflectionsCount: number;
  reflections: AkashaReflections;
};

export type AkashaReflections = {
  edges?: Array<{
    cursor: string;
    node?: {
      id: string;
      version: any;
      active: boolean;
      isReply?: boolean | null;
      reflection?: any | null;
      createdAt: any;
      nsfw?: boolean | null;
      author: {
        id: string;
        isViewer: boolean;
      };
      content: Array<{
        label: string;
        propertyType: string;
        value: string;
      }>;
      beam?: {
        id: string;
        author: {
          id: string;
          isViewer: boolean;
        };
      } | null;
    } | null;
  } | null> | null;
  pageInfo: {
    startCursor?: string | null;
    endCursor?: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type AkashaReadableImageBlockContent = {
  images: {
    src: string;
    size: {
      width: number;
      height: number;
    };
    name: string;
  }[];
  caption?: string;
  align?: string;
};

export type ZulandReadableBlockContent =
  | {
      label: string;
      propertyType: 'slate-block';
      value: Descendant[];
    }
  | {
      label: string;
      propertyType: 'image-block';
      value: AkashaReadableImageBlockContent;
    }
  | BlockLabeledValue;

export type ZulandComplexReflectOfReflections = {
  edge: {
    node: ZulandReadableReflectionWithChildren;
    cursor: string;
  }[];
  pageInfo: AkashaPageInfo | null;
};

export type ZulandReadableReflectionWithChildren = ZulandReadableReflection & {
  children?: ZulandComplexReflectOfReflections | null;
};

export type AkashaPageInfo = {
  startCursor?: string | null;
  endCursor?: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
