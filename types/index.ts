import { SwipeableDrawerProps } from '@mui/material';
import { EdDSAPublicKey } from '@pcd/eddsa-pcd';
import { EdDSATicketPCDTypeName } from '@pcd/eddsa-ticket-pcd';
import { PipelineEdDSATicketZuAuthConfig } from '@pcd/passport-interface';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { ITimezoneOption } from 'react-timezone-select';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

export type IconProps = {
  size?: number;
  color?: string;
  cursor?: string;
};

export type Link = {
  title: string;
  links: string;
};
export interface Contract {
  type?: string;
  contractAddress?: string;
  description?: string;
  image_url?: string;
  status?: string;
  checkin?: string;
  name?: string;
  price?: number;
  tokenType?: string;
  disclaimer?: string;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  tagline?: string;
  imageUrl?: string;
  externalUrl?: string;
  meetingUrl?: string;
  profileId?: string;
  spaceId?: string;
  participantCount: number;
  minParticipant: number;
  maxParticipant: number;
  createdAt: string;
  source?: string;
  legacyData?: LegacyEvent;
  space?: {
    id?: string;
    name?: string;
    gated?: string;
    avatar?: string;
    banner?: string;
    description?: string;
  };
  profile?: {
    username?: string;
    avatar?: string;
  };
  customLinks?: [Link];
  tracks?: string;
  regAndAccess?: {
    edges: [
      {
        node: RegistrationAndAccess;
      },
    ];
  };
  applicationForms?: {
    edges: [
      {
        node: ApplicationForm;
      },
    ];
  };
  sessionStorage?: string;
  supportChain?: string;
  admins?: {
    id: string;
  }[];
  members?: {
    id: string;
  }[];
  superAdmin?: {
    id: string;
  }[];
  location?: string;
}
export interface LegacyEvent {
  id?: string;
  name?: string;
  event_space_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  format?: string;
  event_type?: string[];
  experience_level?: string[];
  creator_id?: string;
  tagline?: string;
  social_links?: string;
  extra_links?: string;
  image_url?: string;
  main_location_id?: string;
}
export interface RegistrationAndAccess {
  applyRule: string;
  applyOption: string;
  registrationWhitelist: {
    id: string;
  }[];
  registrationAccess: string;
  ticketType: string;
  applicationForm: string;
  id: string;
  registrationOpen: string;
  checkinOpen: string;
  zuPassInfo?: ZuPassInfo[];
  scrollPassTickets?: ScrollPassTickets[];
  zuLottoInfo?: ZuLottoInfo[];
  scrollPassContractFactoryID?: number;
  scannedList: {
    id: string;
  }[];
}

export interface ScrollPassTickets {
  type: string;
  status: string;
  checkin: string;
  image_url: string;
  description: string;
  contractAddress: string;
  name: string;
  price: number;
  tokenType: string;
  disclaimer?: string;
  tbd?: string;
  eventId: string;
}

export interface ZuPassInfo extends PipelineEdDSATicketZuAuthConfig {
  access?: string;
  eventId: string;
  eventName: string;
  registration: string;
}

export interface ZuLottoInfo {
  name: string;
  description: string;
  contractAddress: string;
}

export interface ApplicationForm {
  id: string;
  answers: string;
  approveStatus: string;
  eventId: string;
  profile: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface EventEdge {
  node: Event;
}

export interface EventData {
  zucityEventIndex: {
    edges: EventEdge[];
  };
}
export interface SpaceEventEdge {
  node: Event;
}

export interface CeramicResponseType<T> {
  data?: T;
}

export interface SpaceEventData {
  edges: SpaceEventEdge[];
}
export interface Space {
  id: string;
  avatar?: string;
  banner?: string;
  description: string;
  name: string;
  profileId?: string;
  tagline: string;
  category?: string;
  tags?: {
    tag: string;
  }[];
  owner: {
    id: string;
    zucityProfile: Profile;
  };
  customLinks?: Link[];
  socialLinks?: Link[];
  announcements?: {
    edges: {
      node: {
        id: string;
        createdAt: string;
      };
    }[];
  };
  events?: {
    edges: {
      node: {
        startTime: string;
        endTime: string;
      };
    }[];
  };
  userRoles?: {
    edges: {
      node: UserRole;
    }[];
  };
  customAttributes: TBD[];
  createdAt: string;
  updatedAt: string;
  installedApps?: {
    edges: {
      node: InstalledApp;
    }[];
  };
  gated: string;
  isLegacy?: boolean;
  spaceGating?: {
    edges: {
      node: SpaceGating;
    }[];
  };
}

export interface CalendarConfig {
  name: string;
  category: string;
  accessRule: string;
}

type TBD = {
  tbd: string;
};

export interface SpaceEdge {
  node: Space;
}

export interface SpaceData {
  zucitySpaceIndex: {
    edges: SpaceEdge[];
  };
}

type People = {
  id: string;
  mvpProfile: {
    avatar?: string;
    id: string;
    username: string;
  };
};

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  profileId: string;
  startTime: string;
  endTime: string;
  eventId: string;
  tags?: string;
  type?: string;
  track?: string;
  format?: string;
  status?: string;
  timezone?: string;
  video_url?: string;
  description: string;
  meeting_url?: string;
  experience_level?: string;
  location?: string;
  speakers: string;
  organizers: string;
  rsvpNb?: number;
  creatorDID?: string;
  liveStreamLink?: string;
  recording_link?: string;
  uuid: string;
  isPublic?: boolean;
}
export type ZucityCeramicSession = {
  title: string;
  description: string;
  timezone?: string;
  meetingUrl?: string;
  status: string;
  videoUrl?: string;
  createdAt: string;
  startTime: string;
  endTime: string;
  eventId: string;
  profileId: string;
  track: string;
  speakers: string[];
  organizers?: string[];
  format: string;
  type?: string;
  experienceLevel?: string;
  tags: string;
  gated?: string;
  rsvpNb?: number;
  liveStreamLink?: string;
  recordingLink?: string;
  location?: string;
  customAttributes?: Array<{
    tbd?: string;
  }>;
};
export type SessionSupabaseData = {
  title: string;
  description?: string;
  experience_level?: string;
  createdAt: string;
  startTime: string | null;
  endTime: string | null;
  profileId: string;
  eventId: string;
  tags?: string;
  type?: string;
  format?: string;
  track?: string;
  timezone?: string;
  video_url?: string;
  location?: string;
  organizers?: string;
  speakers?: string;
  creatorDID: string;
  uuid: string;
  liveStreamLink?: string;
  recording_link?: string;
};
export interface SessionEdge {
  node: Session;
}

export interface SessionData {
  sessionIndex: {
    edges: SessionEdge[];
  };
}

export interface Venue {
  id: string;
  name: string;
  eventId: string;
  tags: string;
  avatar: string;
  bookings: string;
  capacity: number;
}

export type Profile = {
  id: any;
  username: string;
  avatar?: string;
  /**
   * Set by SupabaseContext, not ceramic
   * Still need to read address from did when use ceramic
   */
  address: string;
  /**
   * Set by CeramicContext
   */
  did: string;
  author?: {
    id: string;
  };
};
export interface ProfileData {
  node: Profile;
}

export interface ProfileEdge {
  zucityProfileIndex: {
    edges: ProfileData[];
  };
}

export interface CreateProfileResult {
  profile?: Profile;
  error?: string;
}

export interface Coordinates {
  lat: number | undefined;
  lng: number | undefined;
}

export interface Tag {
  name: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Tag[];
}
export interface IProps {
  setIsVerify?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsAgree?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsMint?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsTransaction?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsComplete?: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleClose?: () => void;
  eventContractID?: number;
  setFilteredResults?: React.Dispatch<React.SetStateAction<any[]>>;
  filteredResults?: any[];
  event?: Event;
  tokenId?: string;
  setTokenId?: React.Dispatch<React.SetStateAction<string>> | any;
  ticketMinted?: any[];
  setTicketMinted?: React.Dispatch<React.SetStateAction<any[]>> | any;
}

export interface SocialLinks {
  title: string;
  links: string;
}

export interface CreateEventRequest {
  name: string;
  tagline: string;
  strDesc: string;
  spaceId: string;
  profileId: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  socialLinks: SocialLinks[];
  adminId: string;
  tracks: string[];
  person: boolean;
  locations: string[];
  timezone: string;
  externalUrl: string;
}

export interface UpdateEventRequest extends CreateEventRequest {
  id: string;
}

export interface ZuAutoCompleteProps {
  optionVals: Array<{
    value: string;
    label: string;
  }>;
  val: Array<{
    value: string;
    label: string;
  }>;
  setVal: Dispatch<SetStateAction<{ value: string; label: string }[]>>;
}

export interface AddZupassMemberRequest {
  eventId: string;
  memberDID: string;
  memberZupass: string;
}
export interface AddScrollpassMemberRequest {
  eventId: string;
  memberDID: string;
  encryptedMemberScrollpass: string;
}
export interface AddMemberRequest {
  eventId: string;
  memberAddress: string;
}
export interface AddAdminRequest {
  eventId: string;
  adminAddress: string;
}

export type AvailableType = {
  startTime: string;
  endTime: string;
  error?: string;
};

export interface FilterSessionsPopComponentProps extends SwipeableDrawerProps {
  isRSVPFiltered: boolean;
  handleRSVPSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isManagedFiltered: boolean;
  handleManagedSwitchChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  location: Venue[];
  track: string;
  handleClear: () => void;
  setSelectedLocations: Dispatch<SetStateAction<string[]>>;
  selectedLocations: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
  selectedTracks: string[];
}

export interface TimezoneSelectorProps {
  value?: ITimezoneOption;
  sx: CSSProperties;
  setSelectedTimezone: Dispatch<SetStateAction<ITimezoneOption>>;
}

export interface FilmOptionType {
  value: string;
  label: string;
  isAdd?: boolean;
}

export interface Post {
  id: number;
  title: string;
  tags: string;
  description: string;
  creator: string;
  eventId: string;
  created_at: string;
}

export interface CreateRegAndAccessRequest {
  applyRule: string;
  eventId: string;
  applyOption: string;
  registrationWhitelist?: string[];
  registrationAccess: string;
  ticketType: string;
  profileId: string;
  scrollPassContractFactoryID?: number;
}

export interface UpdateRegAndAccessRequest
  extends Partial<CreateRegAndAccessRequest> {
  type:
    | 'question'
    | 'method'
    | 'switch'
    | 'whitelist'
    | 'zuPass'
    | 'scrollpass'
    | 'zuLotto'
    | 'scannedList';
  id: string;
  applicationForm?: string;
  checkinOpen?: string;
  registrationOpen?: string;
  zuPassInfo?: ZuPassInfo;
  scrollPassTickets?: ScrollPassTickets[];
  zuLottoInfo?: ZuLottoInfo;
  scannedList?: {
    id: string;
  }[];
}

export type ZupassConfig = PipelineEdDSATicketZuAuthConfig[];

export interface ZupassConfigItem {
  pcdType: typeof EdDSATicketPCDTypeName;
  publicKey: EdDSAPublicKey;
  eventId: string;
  eventName: string;
}

export interface CalEvent {
  id: number;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  is_all_day: boolean;
  start_date: string;
  end_date: string;
  creator: string;
  timezone: string;
  format: string;
  location_name?: string;
  location_url?: string;
  recurring: string;
  uuid: string;
  weekdays?: string;
  monthdays?: string;
  rrule?: string;
}

export interface Dapp {
  id: string;
  appName: string;
  developerName: string;
  description: string;
  bannerUrl: string;
  appLogoUrl: string;
  categories: string;
  devStatus: string;
  openSource: boolean;
  repositoryUrl: string;
  appUrl: string;
  websiteUrl: string;
  docsUrl: string;
  tagline: string;
  isInstallable: string;
  isSCApp: boolean;
  scAddresses: {
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

export interface Permission {
  id: string;
  name: string;
  resource: string;
}

export enum PermissionName {
  MANAGE_ADMIN_ROLE = 'manage_admin_role',
  MANAGE_MEMBER_ROLE = 'manage_member_role',
  CREATE_EVENTS = 'create_events',
  MANAGE_PROFILE = 'manage_profile',
  VIEW_EVENTS = 'view_events',
  INVITE_USERS = 'invite_users',
  VIEW_LOGS = 'view_logs',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_APPS = 'manage_apps',
  VIEW_APPS = 'view_apps',
  MANAGE_ANNOUNCEMENTS = 'manage_announcements',
  VIEW_ANNOUNCEMENTS = 'view_announcements',
  MANAGE_ACCESS = 'manage_access',
}

export interface Role {
  id: string;
  name: string;
  level: string;
  is_vanity: boolean;
  resource_id: string;
}

export interface RolePermission {
  id: string;
  role: Role;
  permission_ids: string[];
}

export interface UserRole {
  id: string;
  roleId: string;
  userId: {
    zucityProfile: Profile;
  };
  customAttributes: TBD[];
}

export interface UserRoleData {
  zucityUserRolesIndex: {
    edges: { node: UserRole }[];
  };
}

export interface IProfile {
  zucityProfileIndex: {
    edges: { node: Profile }[];
  };
}

export interface IUserProfileWithSpaceAndEvent {
  zucityProfile: {
    id: string;
    username: string;
    spaces: {
      edges: { node: Space }[];
    };
    events: {
      edges: { node: Event }[];
    };
  };
}

export interface InstalledApp {
  id: string;
  installedAppId?: string;
  nativeAppName?: string;
  installedApp?: Dapp;
}

export interface Announcement {
  id: string;
  title: string;
  tags: { tag: string }[];
  description: string;
  createdAt: string;
  updatedAt: string;
  sourceId: string;
  author: {
    id: string;
    zucityProfile: {
      // FIXME: can not fetch avatar and username from zucityProfile
      avatar: string;
      username: string;
    };
  };
}

export interface SpaceGating {
  id: string;
  spaceId: string;
  gatingStatus: string;
  poapsId?: { poapId: number }[];
  zuPassInfo?: ZuPassInfo;
}
