import { Profile } from './profile';

/**
 * Generic connection edge interface
 */
export interface ConnectionEdge<T> {
  node: T;
}

/**
 * Generic connection interface
 */
export interface Connection<T> {
  edges: ConnectionEdge<T>[];
}

/**
 * Filters input type
 */
export interface FiltersInput {
  [key: string]: any;
}

/**
 * Sorting input type
 */
export interface SortingInput {
  [key: string]: 'ASC' | 'DESC';
}

/**
 * Ceramic account interface
 * Corresponds to the CeramicAccount type in GraphQL schema
 */
export interface CeramicAccount {
  /**
   * Globally unique identifier for the account (DID string)
   */
  id: string;

  /**
   * Indicates whether the Ceramic instance is authenticated with this account
   */
  isViewer: boolean;

  /**
   * Associated user profile
   */
  zucityProfile?: Profile;

  /**
   * Announcement list
   */
  zucityAnnouncementList?: Connection<any>;

  /**
   * Total number of announcements
   */
  zucityAnnouncementListCount?: number;

  /**
   * Application form list
   */
  zucityApplicationFormList?: Connection<any>;

  /**
   * Total number of application forms
   */
  zucityApplicationFormListCount?: number;

  /**
   * Dapp information list
   */
  zucityDappInfoList?: Connection<any>;

  /**
   * Total number of Dapp information entries
   */
  zucityDappInfoListCount?: number;

  /**
   * Event list
   */
  zucityEventList?: Connection<any>;

  /**
   * Total number of events
   */
  zucityEventListCount?: number;

  /**
   * Event post list
   */
  zucityEventPostList?: Connection<any>;

  /**
   * Total number of event posts
   */
  zucityEventPostListCount?: number;

  /**
   * Event registration and access list
   */
  zucityEventRegistrationAndAccessList?: Connection<any>;

  /**
   * Total number of event registrations and accesses
   */
  zucityEventRegistrationAndAccessListCount?: number;

  /**
   * Installed app list
   */
  zucityInstalledAppList?: Connection<any>;

  /**
   * Total number of installed apps
   */
  zucityInstalledAppListCount?: number;

  /**
   * Invitation list
   */
  zucityInvitationList?: Connection<any>;

  /**
   * Total number of invitations
   */
  zucityInvitationListCount?: number;

  /**
   * Permission list
   */
  zucityPermissionList?: Connection<any>;

  /**
   * Total number of permissions
   */
  zucityPermissionListCount?: number;

  /**
   * Role list
   */
  zucityRoleList?: Connection<any>;

  /**
   * Total number of roles
   */
  zucityRoleListCount?: number;

  /**
   * Role permission list
   */
  zucityRolePermissionList?: Connection<any>;

  /**
   * Total number of role permissions
   */
  zucityRolePermissionListCount?: number;

  /**
   * Session list
   */
  zucitySessionList?: Connection<any>;

  /**
   * Total number of sessions
   */
  zucitySessionListCount?: number;

  /**
   * Space gating list
   */
  zucitySpaceGatingList?: Connection<any>;

  /**
   * Total number of space gatings
   */
  zucitySpaceGatingListCount?: number;

  /**
   * Space list
   */
  zucitySpaceList?: Connection<any>;

  /**
   * Total number of spaces
   */
  zucitySpaceListCount?: number;

  /**
   * User roles list
   */
  zucityUserRolesList?: Connection<any>;

  /**
   * Total number of user roles
   */
  zucityUserRolesListCount?: number;
}

/**
 * Simplified Ceramic account interface
 * Used for referencing accounts without requiring the full account information
 */
export interface CeramicAccountRef {
  id: string;
}
