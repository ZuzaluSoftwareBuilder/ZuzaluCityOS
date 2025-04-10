/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A Ceramic Commit ID */
  CeramicCommitID: { input: any; output: any; }
  /** A Ceramic Stream ID */
  CeramicStreamID: { input: any; output: any; }
  /** A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/. */
  DID: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type CeramicAccount = Node & {
  __typename?: 'CeramicAccount';
  /** Globally unique identifier of the account (DID string) */
  id: Scalars['ID']['output'];
  /** Whether the Ceramic instance is currently authenticated with this account or not */
  isViewer: Scalars['Boolean']['output'];
  zucityAnnouncementList?: Maybe<ZucityAnnouncementConnection>;
  zucityAnnouncementListCount: Scalars['Int']['output'];
  zucityApplicationFormList?: Maybe<ZucityApplicationFormConnection>;
  zucityApplicationFormListCount: Scalars['Int']['output'];
  zucityDappInfoList?: Maybe<ZucityDappInfoConnection>;
  zucityDappInfoListCount: Scalars['Int']['output'];
  zucityEventList?: Maybe<ZucityEventConnection>;
  zucityEventListCount: Scalars['Int']['output'];
  zucityEventPostList?: Maybe<ZucityEventPostConnection>;
  zucityEventPostListCount: Scalars['Int']['output'];
  zucityEventRegistrationAndAccessList?: Maybe<ZucityEventRegistrationAndAccessConnection>;
  zucityEventRegistrationAndAccessListCount: Scalars['Int']['output'];
  zucityInstalledAppList?: Maybe<ZucityInstalledAppConnection>;
  zucityInstalledAppListCount: Scalars['Int']['output'];
  zucityInvitationList?: Maybe<ZucityInvitationConnection>;
  zucityInvitationListCount: Scalars['Int']['output'];
  zucityPermissionList?: Maybe<ZucityPermissionConnection>;
  zucityPermissionListCount: Scalars['Int']['output'];
  zucityProfile?: Maybe<ZucityProfile>;
  zucityRoleList?: Maybe<ZucityRoleConnection>;
  zucityRoleListCount: Scalars['Int']['output'];
  zucityRolePermissionList?: Maybe<ZucityRolePermissionConnection>;
  zucityRolePermissionListCount: Scalars['Int']['output'];
  zucitySessionList?: Maybe<ZucitySessionConnection>;
  zucitySessionListCount: Scalars['Int']['output'];
  zucitySpaceGatingList?: Maybe<ZucitySpaceGatingConnection>;
  zucitySpaceGatingListCount: Scalars['Int']['output'];
  zucitySpaceList?: Maybe<ZucitySpaceConnection>;
  zucitySpaceListCount: Scalars['Int']['output'];
  zucityUserRolesList?: Maybe<ZucityUserRolesConnection>;
  zucityUserRolesListCount: Scalars['Int']['output'];
};


export type CeramicAccountZucityAnnouncementListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CeramicAccountZucityApplicationFormListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CeramicAccountZucityDappInfoListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityDappInfoFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityDappInfoSortingInput>;
};


export type CeramicAccountZucityDappInfoListCountArgs = {
  filters?: InputMaybe<ZucityDappInfoFiltersInput>;
};


export type CeramicAccountZucityEventListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventSortingInput>;
};


export type CeramicAccountZucityEventListCountArgs = {
  filters?: InputMaybe<ZucityEventFiltersInput>;
};


export type CeramicAccountZucityEventPostListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventPostFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventPostSortingInput>;
};


export type CeramicAccountZucityEventPostListCountArgs = {
  filters?: InputMaybe<ZucityEventPostFiltersInput>;
};


export type CeramicAccountZucityEventRegistrationAndAccessListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CeramicAccountZucityInstalledAppListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInstalledAppSortingInput>;
};


export type CeramicAccountZucityInstalledAppListCountArgs = {
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
};


export type CeramicAccountZucityInvitationListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInvitationFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInvitationSortingInput>;
};


export type CeramicAccountZucityInvitationListCountArgs = {
  filters?: InputMaybe<ZucityInvitationFiltersInput>;
};


export type CeramicAccountZucityPermissionListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityPermissionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityPermissionSortingInput>;
};


export type CeramicAccountZucityPermissionListCountArgs = {
  filters?: InputMaybe<ZucityPermissionFiltersInput>;
};


export type CeramicAccountZucityRoleListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityRoleFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityRoleSortingInput>;
};


export type CeramicAccountZucityRoleListCountArgs = {
  filters?: InputMaybe<ZucityRoleFiltersInput>;
};


export type CeramicAccountZucityRolePermissionListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityRolePermissionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityRolePermissionSortingInput>;
};


export type CeramicAccountZucityRolePermissionListCountArgs = {
  filters?: InputMaybe<ZucityRolePermissionFiltersInput>;
};


export type CeramicAccountZucitySessionListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucitySessionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucitySessionSortingInput>;
};


export type CeramicAccountZucitySessionListCountArgs = {
  filters?: InputMaybe<ZucitySessionFiltersInput>;
};


export type CeramicAccountZucitySpaceGatingListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CeramicAccountZucitySpaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucitySpaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucitySpaceSortingInput>;
};


export type CeramicAccountZucitySpaceListCountArgs = {
  filters?: InputMaybe<ZucitySpaceFiltersInput>;
};


export type CeramicAccountZucityUserRolesListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityUserRolesFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityUserRolesSortingInput>;
};


export type CeramicAccountZucityUserRolesListCountArgs = {
  filters?: InputMaybe<ZucityUserRolesFiltersInput>;
};

export type CreateOptionsInput = {
  /** Inform indexers if they should index this document or not */
  shouldIndex?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateZucityAnnouncementInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityAnnouncementInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityAnnouncementPayload = {
  __typename?: 'CreateZucityAnnouncementPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityAnnouncement;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityAnnouncementPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityApplicationFormInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityApplicationFormInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityApplicationFormPayload = {
  __typename?: 'CreateZucityApplicationFormPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityApplicationForm;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityApplicationFormPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityDappInfoInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityDappInfoInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityDappInfoPayload = {
  __typename?: 'CreateZucityDappInfoPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityDappInfo;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityDappInfoPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityEventInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityEventInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityEventPayload = {
  __typename?: 'CreateZucityEventPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityEvent;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityEventPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityEventPostInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityEventPostInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityEventPostPayload = {
  __typename?: 'CreateZucityEventPostPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityEventPost;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityEventPostPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityEventRegistrationAndAccessInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityEventRegistrationAndAccessInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityEventRegistrationAndAccessPayload = {
  __typename?: 'CreateZucityEventRegistrationAndAccessPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityEventRegistrationAndAccess;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityEventRegistrationAndAccessPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityInstalledAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityInstalledAppInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityInstalledAppPayload = {
  __typename?: 'CreateZucityInstalledAppPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityInstalledApp;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityInstalledAppPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityInvitationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityInvitationInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityInvitationPayload = {
  __typename?: 'CreateZucityInvitationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityInvitation;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityInvitationPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityPermissionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityPermissionInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityPermissionPayload = {
  __typename?: 'CreateZucityPermissionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityPermission;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityPermissionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityProfileInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type CreateZucityProfilePayload = {
  __typename?: 'CreateZucityProfilePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityRoleInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityRoleInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityRolePayload = {
  __typename?: 'CreateZucityRolePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityRole;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityRolePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityRolePermissionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityRolePermissionInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityRolePermissionPayload = {
  __typename?: 'CreateZucityRolePermissionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityRolePermission;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityRolePermissionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucitySessionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucitySessionInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucitySessionPayload = {
  __typename?: 'CreateZucitySessionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucitySession;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucitySessionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucitySpaceGatingInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucitySpaceGatingInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucitySpaceGatingPayload = {
  __typename?: 'CreateZucitySpaceGatingPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucitySpaceGating;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucitySpaceGatingPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucitySpaceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucitySpaceInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucitySpacePayload = {
  __typename?: 'CreateZucitySpacePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucitySpace;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucitySpacePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateZucityUserRolesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityUserRolesInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateZucityUserRolesPayload = {
  __typename?: 'CreateZucityUserRolesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityUserRoles;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateZucityUserRolesPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityAnnouncementInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityAnnouncementPayload = {
  __typename?: 'EnableIndexingZucityAnnouncementPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityAnnouncement>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityAnnouncementPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityApplicationFormInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityApplicationFormPayload = {
  __typename?: 'EnableIndexingZucityApplicationFormPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityApplicationForm>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityApplicationFormPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityDappInfoInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityDappInfoPayload = {
  __typename?: 'EnableIndexingZucityDappInfoPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityDappInfo>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityDappInfoPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityEventInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityEventPayload = {
  __typename?: 'EnableIndexingZucityEventPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityEvent>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityEventPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityEventPostInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityEventPostPayload = {
  __typename?: 'EnableIndexingZucityEventPostPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityEventPost>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityEventPostPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityEventRegistrationAndAccessInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityEventRegistrationAndAccessPayload = {
  __typename?: 'EnableIndexingZucityEventRegistrationAndAccessPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityEventRegistrationAndAccess>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityEventRegistrationAndAccessPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityInstalledAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityInstalledAppPayload = {
  __typename?: 'EnableIndexingZucityInstalledAppPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityInstalledApp>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityInstalledAppPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityInvitationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityInvitationPayload = {
  __typename?: 'EnableIndexingZucityInvitationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityInvitation>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityInvitationPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityPermissionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityPermissionPayload = {
  __typename?: 'EnableIndexingZucityPermissionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityPermission>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityPermissionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityProfilePayload = {
  __typename?: 'EnableIndexingZucityProfilePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityProfile>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityRoleInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityRolePayload = {
  __typename?: 'EnableIndexingZucityRolePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityRole>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityRolePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityRolePermissionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityRolePermissionPayload = {
  __typename?: 'EnableIndexingZucityRolePermissionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityRolePermission>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityRolePermissionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucitySessionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucitySessionPayload = {
  __typename?: 'EnableIndexingZucitySessionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucitySession>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucitySessionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucitySpaceGatingInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucitySpaceGatingPayload = {
  __typename?: 'EnableIndexingZucitySpaceGatingPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucitySpaceGating>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucitySpaceGatingPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucitySpaceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucitySpacePayload = {
  __typename?: 'EnableIndexingZucitySpacePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucitySpace>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucitySpacePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingZucityUserRolesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingZucityUserRolesPayload = {
  __typename?: 'EnableIndexingZucityUserRolesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<ZucityUserRoles>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingZucityUserRolesPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createZucityAnnouncement?: Maybe<CreateZucityAnnouncementPayload>;
  createZucityApplicationForm?: Maybe<CreateZucityApplicationFormPayload>;
  createZucityDappInfo?: Maybe<CreateZucityDappInfoPayload>;
  createZucityEvent?: Maybe<CreateZucityEventPayload>;
  createZucityEventPost?: Maybe<CreateZucityEventPostPayload>;
  createZucityEventRegistrationAndAccess?: Maybe<CreateZucityEventRegistrationAndAccessPayload>;
  createZucityInstalledApp?: Maybe<CreateZucityInstalledAppPayload>;
  createZucityInvitation?: Maybe<CreateZucityInvitationPayload>;
  createZucityPermission?: Maybe<CreateZucityPermissionPayload>;
  /** @deprecated Replaced by the setZucityProfile mutation, createZucityProfile will be removed in a future version of ComposeDB. */
  createZucityProfile?: Maybe<CreateZucityProfilePayload>;
  createZucityRole?: Maybe<CreateZucityRolePayload>;
  createZucityRolePermission?: Maybe<CreateZucityRolePermissionPayload>;
  createZucitySession?: Maybe<CreateZucitySessionPayload>;
  createZucitySpace?: Maybe<CreateZucitySpacePayload>;
  createZucitySpaceGating?: Maybe<CreateZucitySpaceGatingPayload>;
  createZucityUserRoles?: Maybe<CreateZucityUserRolesPayload>;
  enableIndexingZucityAnnouncement?: Maybe<EnableIndexingZucityAnnouncementPayload>;
  enableIndexingZucityApplicationForm?: Maybe<EnableIndexingZucityApplicationFormPayload>;
  enableIndexingZucityDappInfo?: Maybe<EnableIndexingZucityDappInfoPayload>;
  enableIndexingZucityEvent?: Maybe<EnableIndexingZucityEventPayload>;
  enableIndexingZucityEventPost?: Maybe<EnableIndexingZucityEventPostPayload>;
  enableIndexingZucityEventRegistrationAndAccess?: Maybe<EnableIndexingZucityEventRegistrationAndAccessPayload>;
  enableIndexingZucityInstalledApp?: Maybe<EnableIndexingZucityInstalledAppPayload>;
  enableIndexingZucityInvitation?: Maybe<EnableIndexingZucityInvitationPayload>;
  enableIndexingZucityPermission?: Maybe<EnableIndexingZucityPermissionPayload>;
  enableIndexingZucityProfile?: Maybe<EnableIndexingZucityProfilePayload>;
  enableIndexingZucityRole?: Maybe<EnableIndexingZucityRolePayload>;
  enableIndexingZucityRolePermission?: Maybe<EnableIndexingZucityRolePermissionPayload>;
  enableIndexingZucitySession?: Maybe<EnableIndexingZucitySessionPayload>;
  enableIndexingZucitySpace?: Maybe<EnableIndexingZucitySpacePayload>;
  enableIndexingZucitySpaceGating?: Maybe<EnableIndexingZucitySpaceGatingPayload>;
  enableIndexingZucityUserRoles?: Maybe<EnableIndexingZucityUserRolesPayload>;
  setZucityProfile?: Maybe<SetZucityProfilePayload>;
  updateZucityAnnouncement?: Maybe<UpdateZucityAnnouncementPayload>;
  updateZucityApplicationForm?: Maybe<UpdateZucityApplicationFormPayload>;
  updateZucityDappInfo?: Maybe<UpdateZucityDappInfoPayload>;
  updateZucityEvent?: Maybe<UpdateZucityEventPayload>;
  updateZucityEventPost?: Maybe<UpdateZucityEventPostPayload>;
  updateZucityEventRegistrationAndAccess?: Maybe<UpdateZucityEventRegistrationAndAccessPayload>;
  updateZucityInstalledApp?: Maybe<UpdateZucityInstalledAppPayload>;
  updateZucityInvitation?: Maybe<UpdateZucityInvitationPayload>;
  updateZucityPermission?: Maybe<UpdateZucityPermissionPayload>;
  updateZucityProfile?: Maybe<UpdateZucityProfilePayload>;
  updateZucityRole?: Maybe<UpdateZucityRolePayload>;
  updateZucityRolePermission?: Maybe<UpdateZucityRolePermissionPayload>;
  updateZucitySession?: Maybe<UpdateZucitySessionPayload>;
  updateZucitySpace?: Maybe<UpdateZucitySpacePayload>;
  updateZucitySpaceGating?: Maybe<UpdateZucitySpaceGatingPayload>;
  updateZucityUserRoles?: Maybe<UpdateZucityUserRolesPayload>;
};


export type MutationCreateZucityAnnouncementArgs = {
  input: CreateZucityAnnouncementInput;
};


export type MutationCreateZucityApplicationFormArgs = {
  input: CreateZucityApplicationFormInput;
};


export type MutationCreateZucityDappInfoArgs = {
  input: CreateZucityDappInfoInput;
};


export type MutationCreateZucityEventArgs = {
  input: CreateZucityEventInput;
};


export type MutationCreateZucityEventPostArgs = {
  input: CreateZucityEventPostInput;
};


export type MutationCreateZucityEventRegistrationAndAccessArgs = {
  input: CreateZucityEventRegistrationAndAccessInput;
};


export type MutationCreateZucityInstalledAppArgs = {
  input: CreateZucityInstalledAppInput;
};


export type MutationCreateZucityInvitationArgs = {
  input: CreateZucityInvitationInput;
};


export type MutationCreateZucityPermissionArgs = {
  input: CreateZucityPermissionInput;
};


export type MutationCreateZucityProfileArgs = {
  input: CreateZucityProfileInput;
};


export type MutationCreateZucityRoleArgs = {
  input: CreateZucityRoleInput;
};


export type MutationCreateZucityRolePermissionArgs = {
  input: CreateZucityRolePermissionInput;
};


export type MutationCreateZucitySessionArgs = {
  input: CreateZucitySessionInput;
};


export type MutationCreateZucitySpaceArgs = {
  input: CreateZucitySpaceInput;
};


export type MutationCreateZucitySpaceGatingArgs = {
  input: CreateZucitySpaceGatingInput;
};


export type MutationCreateZucityUserRolesArgs = {
  input: CreateZucityUserRolesInput;
};


export type MutationEnableIndexingZucityAnnouncementArgs = {
  input: EnableIndexingZucityAnnouncementInput;
};


export type MutationEnableIndexingZucityApplicationFormArgs = {
  input: EnableIndexingZucityApplicationFormInput;
};


export type MutationEnableIndexingZucityDappInfoArgs = {
  input: EnableIndexingZucityDappInfoInput;
};


export type MutationEnableIndexingZucityEventArgs = {
  input: EnableIndexingZucityEventInput;
};


export type MutationEnableIndexingZucityEventPostArgs = {
  input: EnableIndexingZucityEventPostInput;
};


export type MutationEnableIndexingZucityEventRegistrationAndAccessArgs = {
  input: EnableIndexingZucityEventRegistrationAndAccessInput;
};


export type MutationEnableIndexingZucityInstalledAppArgs = {
  input: EnableIndexingZucityInstalledAppInput;
};


export type MutationEnableIndexingZucityInvitationArgs = {
  input: EnableIndexingZucityInvitationInput;
};


export type MutationEnableIndexingZucityPermissionArgs = {
  input: EnableIndexingZucityPermissionInput;
};


export type MutationEnableIndexingZucityProfileArgs = {
  input: EnableIndexingZucityProfileInput;
};


export type MutationEnableIndexingZucityRoleArgs = {
  input: EnableIndexingZucityRoleInput;
};


export type MutationEnableIndexingZucityRolePermissionArgs = {
  input: EnableIndexingZucityRolePermissionInput;
};


export type MutationEnableIndexingZucitySessionArgs = {
  input: EnableIndexingZucitySessionInput;
};


export type MutationEnableIndexingZucitySpaceArgs = {
  input: EnableIndexingZucitySpaceInput;
};


export type MutationEnableIndexingZucitySpaceGatingArgs = {
  input: EnableIndexingZucitySpaceGatingInput;
};


export type MutationEnableIndexingZucityUserRolesArgs = {
  input: EnableIndexingZucityUserRolesInput;
};


export type MutationSetZucityProfileArgs = {
  input: SetZucityProfileInput;
};


export type MutationUpdateZucityAnnouncementArgs = {
  input: UpdateZucityAnnouncementInput;
};


export type MutationUpdateZucityApplicationFormArgs = {
  input: UpdateZucityApplicationFormInput;
};


export type MutationUpdateZucityDappInfoArgs = {
  input: UpdateZucityDappInfoInput;
};


export type MutationUpdateZucityEventArgs = {
  input: UpdateZucityEventInput;
};


export type MutationUpdateZucityEventPostArgs = {
  input: UpdateZucityEventPostInput;
};


export type MutationUpdateZucityEventRegistrationAndAccessArgs = {
  input: UpdateZucityEventRegistrationAndAccessInput;
};


export type MutationUpdateZucityInstalledAppArgs = {
  input: UpdateZucityInstalledAppInput;
};


export type MutationUpdateZucityInvitationArgs = {
  input: UpdateZucityInvitationInput;
};


export type MutationUpdateZucityPermissionArgs = {
  input: UpdateZucityPermissionInput;
};


export type MutationUpdateZucityProfileArgs = {
  input: UpdateZucityProfileInput;
};


export type MutationUpdateZucityRoleArgs = {
  input: UpdateZucityRoleInput;
};


export type MutationUpdateZucityRolePermissionArgs = {
  input: UpdateZucityRolePermissionInput;
};


export type MutationUpdateZucitySessionArgs = {
  input: UpdateZucitySessionInput;
};


export type MutationUpdateZucitySpaceArgs = {
  input: UpdateZucitySpaceInput;
};


export type MutationUpdateZucitySpaceGatingArgs = {
  input: UpdateZucitySpaceGatingInput;
};


export type MutationUpdateZucityUserRolesArgs = {
  input: UpdateZucityUserRolesInput;
};

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PartialZucityAnnouncementInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  sourceId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  tags?: InputMaybe<Array<InputMaybe<ZucityAnnouncementTagInput>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucityApplicationFormInput = {
  answers?: InputMaybe<Scalars['String']['input']>;
  approveStatus?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
};

export type PartialZucityDappInfoInput = {
  appLogoUrl?: InputMaybe<Scalars['String']['input']>;
  appName?: InputMaybe<Scalars['String']['input']>;
  appType?: InputMaybe<Scalars['String']['input']>;
  appUrl?: InputMaybe<Scalars['String']['input']>;
  auditLogUrl?: InputMaybe<Scalars['String']['input']>;
  auditStatus?: InputMaybe<Scalars['String']['input']>;
  audited?: InputMaybe<Scalars['String']['input']>;
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Scalars['String']['input']>;
  createdAtTime?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  devStatus?: InputMaybe<Scalars['String']['input']>;
  developerName?: InputMaybe<Scalars['String']['input']>;
  docsUrl?: InputMaybe<Scalars['String']['input']>;
  installEnv?: InputMaybe<Scalars['String']['input']>;
  installedEvents?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  installedSpaces?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  integrateType?: InputMaybe<Scalars['String']['input']>;
  isInstallable?: InputMaybe<Scalars['String']['input']>;
  isSCApp?: InputMaybe<Scalars['String']['input']>;
  openSource?: InputMaybe<Scalars['String']['input']>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  repositoryUrl?: InputMaybe<Scalars['String']['input']>;
  scAddresses?: InputMaybe<Array<InputMaybe<ZucityDappInfoScAddressInput>>>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type PartialZucityEventInput = {
  admins?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  customLinks?: InputMaybe<Array<InputMaybe<ZucityEventLinkInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  externalUrl?: InputMaybe<Scalars['String']['input']>;
  gated?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  maxParticipant?: InputMaybe<Scalars['Int']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  members?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  minParticipant?: InputMaybe<Scalars['Int']['input']>;
  participantCount?: InputMaybe<Scalars['Int']['input']>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  scrollpassHash?: InputMaybe<Array<InputMaybe<ZucityEventMemberScrollpassInput>>>;
  sessionStorage?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  superAdmin?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  supportChain?: InputMaybe<Scalars['String']['input']>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  tracks?: InputMaybe<Scalars['String']['input']>;
  update?: InputMaybe<Array<InputMaybe<ZucityEventOrganizerUpdateInput>>>;
  zulottoHash?: InputMaybe<Array<InputMaybe<ZucityEventMemberZulottoInput>>>;
  zupassHash?: InputMaybe<Array<InputMaybe<ZucityEventMemberZupassInput>>>;
};

export type PartialZucityEventPostInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  tags?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PartialZucityEventRegistrationAndAccessInput = {
  applicationForm?: InputMaybe<Scalars['String']['input']>;
  applyOption?: InputMaybe<Scalars['String']['input']>;
  applyRule?: InputMaybe<Scalars['String']['input']>;
  checkinOpen?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  registrationAccess?: InputMaybe<Scalars['String']['input']>;
  registrationOpen?: InputMaybe<Scalars['String']['input']>;
  registrationWhitelist?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  scannedList?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  scrollPassContractFactoryID?: InputMaybe<Scalars['Int']['input']>;
  scrollPassTickets?: InputMaybe<Array<InputMaybe<ZucityEventRegistrationAndAccessScrollPassTicketInput>>>;
  ticketType?: InputMaybe<Scalars['String']['input']>;
  zuLottoInfo?: InputMaybe<Array<InputMaybe<ZucityEventRegistrationAndAccessZuLottoInput>>>;
  zuPassInfo?: InputMaybe<Array<InputMaybe<ZucityEventRegistrationAndAccessZuPassInput>>>;
};

export type PartialZucityInstalledAppInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  installedAppId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  nativeAppName?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucityInvitationInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<ZucityInvitationCustomAttributeInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  inviteeId?: InputMaybe<Scalars['DID']['input']>;
  inviteeProfileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  inviterId?: InputMaybe<Scalars['DID']['input']>;
  inviterProfileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  isRead?: InputMaybe<Scalars['String']['input']>;
  lastSentAt?: InputMaybe<Scalars['DateTime']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucityPermissionInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucityProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  email?: InputMaybe<Scalars['String']['input']>;
  myScrollPassTickets?: InputMaybe<Array<InputMaybe<ScrollTicketInput>>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type PartialZucityRoleInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucityRolePermissionInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  level?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucitySessionInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  experienceLevel?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  gated?: InputMaybe<Scalars['String']['input']>;
  liveStreamLink?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  organizers?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  recordingLink?: InputMaybe<Scalars['String']['input']>;
  speakers?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  track?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type PartialZucitySpaceGatingInput = {
  ERC20ContractAddress?: InputMaybe<Scalars['String']['input']>;
  ERC721ContractAddress?: InputMaybe<Scalars['String']['input']>;
  ERC1155ContractAddress?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  gatingCondition?: InputMaybe<Scalars['String']['input']>;
  gatingStatus?: InputMaybe<Scalars['String']['input']>;
  poapsId?: InputMaybe<Array<InputMaybe<ZucitySpaceGatingPoapidInput>>>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  zuPassInfo?: InputMaybe<ZucitySpaceGatingZuPassInput>;
};

export type PartialZucitySpaceInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  banner?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  customLinks?: InputMaybe<Array<InputMaybe<ZucitySpaceLinkInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  gated?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['DID']['input']>;
  profileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  socialLinks?: InputMaybe<Array<InputMaybe<ZucitySpaceLinkInput>>>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<ZucitySpaceTagInput>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PartialZucityUserRolesInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  updated_at?: InputMaybe<Scalars['DateTime']['input']>;
  userId?: InputMaybe<Scalars['DID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Fetches objects given their IDs */
  nodes: Array<Maybe<Node>>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
  zucityAnnouncementCount: Scalars['Int']['output'];
  zucityAnnouncementIndex?: Maybe<ZucityAnnouncementConnection>;
  zucityApplicationFormCount: Scalars['Int']['output'];
  zucityApplicationFormIndex?: Maybe<ZucityApplicationFormConnection>;
  zucityDappInfoCount: Scalars['Int']['output'];
  zucityDappInfoIndex?: Maybe<ZucityDappInfoConnection>;
  zucityEventCount: Scalars['Int']['output'];
  zucityEventIndex?: Maybe<ZucityEventConnection>;
  zucityEventPostCount: Scalars['Int']['output'];
  zucityEventPostIndex?: Maybe<ZucityEventPostConnection>;
  zucityEventRegistrationAndAccessCount: Scalars['Int']['output'];
  zucityEventRegistrationAndAccessIndex?: Maybe<ZucityEventRegistrationAndAccessConnection>;
  zucityInstalledAppCount: Scalars['Int']['output'];
  zucityInstalledAppIndex?: Maybe<ZucityInstalledAppConnection>;
  zucityInvitationCount: Scalars['Int']['output'];
  zucityInvitationIndex?: Maybe<ZucityInvitationConnection>;
  zucityPermissionCount: Scalars['Int']['output'];
  zucityPermissionIndex?: Maybe<ZucityPermissionConnection>;
  zucityProfileCount: Scalars['Int']['output'];
  zucityProfileIndex?: Maybe<ZucityProfileConnection>;
  zucityRoleCount: Scalars['Int']['output'];
  zucityRoleIndex?: Maybe<ZucityRoleConnection>;
  zucityRolePermissionCount: Scalars['Int']['output'];
  zucityRolePermissionIndex?: Maybe<ZucityRolePermissionConnection>;
  zucitySessionCount: Scalars['Int']['output'];
  zucitySessionIndex?: Maybe<ZucitySessionConnection>;
  zucitySpaceCount: Scalars['Int']['output'];
  zucitySpaceGatingCount: Scalars['Int']['output'];
  zucitySpaceGatingIndex?: Maybe<ZucitySpaceGatingConnection>;
  zucitySpaceIndex?: Maybe<ZucitySpaceConnection>;
  zucityUserRolesCount: Scalars['Int']['output'];
  zucityUserRolesIndex?: Maybe<ZucityUserRolesConnection>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryZucityAnnouncementIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryZucityApplicationFormIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryZucityDappInfoCountArgs = {
  filters?: InputMaybe<ZucityDappInfoFiltersInput>;
};


export type QueryZucityDappInfoIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityDappInfoFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityDappInfoSortingInput>;
};


export type QueryZucityEventCountArgs = {
  filters?: InputMaybe<ZucityEventFiltersInput>;
};


export type QueryZucityEventIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventSortingInput>;
};


export type QueryZucityEventPostCountArgs = {
  filters?: InputMaybe<ZucityEventPostFiltersInput>;
};


export type QueryZucityEventPostIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventPostFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventPostSortingInput>;
};


export type QueryZucityEventRegistrationAndAccessIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryZucityInstalledAppCountArgs = {
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
};


export type QueryZucityInstalledAppIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInstalledAppSortingInput>;
};


export type QueryZucityInvitationCountArgs = {
  filters?: InputMaybe<ZucityInvitationFiltersInput>;
};


export type QueryZucityInvitationIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInvitationFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInvitationSortingInput>;
};


export type QueryZucityPermissionCountArgs = {
  filters?: InputMaybe<ZucityPermissionFiltersInput>;
};


export type QueryZucityPermissionIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityPermissionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityPermissionSortingInput>;
};


export type QueryZucityProfileCountArgs = {
  filters?: InputMaybe<ZucityProfileFiltersInput>;
};


export type QueryZucityProfileIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityProfileFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityProfileSortingInput>;
};


export type QueryZucityRoleCountArgs = {
  filters?: InputMaybe<ZucityRoleFiltersInput>;
};


export type QueryZucityRoleIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityRoleFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityRoleSortingInput>;
};


export type QueryZucityRolePermissionCountArgs = {
  filters?: InputMaybe<ZucityRolePermissionFiltersInput>;
};


export type QueryZucityRolePermissionIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityRolePermissionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityRolePermissionSortingInput>;
};


export type QueryZucitySessionCountArgs = {
  filters?: InputMaybe<ZucitySessionFiltersInput>;
};


export type QueryZucitySessionIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucitySessionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucitySessionSortingInput>;
};


export type QueryZucitySpaceCountArgs = {
  filters?: InputMaybe<ZucitySpaceFiltersInput>;
};


export type QueryZucitySpaceGatingIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryZucitySpaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucitySpaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucitySpaceSortingInput>;
};


export type QueryZucityUserRolesCountArgs = {
  filters?: InputMaybe<ZucityUserRolesFiltersInput>;
};


export type QueryZucityUserRolesIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityUserRolesFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityUserRolesSortingInput>;
};

export type ScrollTicket = {
  __typename?: 'ScrollTicket';
  checkin: Scalars['String']['output'];
  contractAddress: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eventId: Scalars['String']['output'];
  image_url: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  tbd?: Maybe<Scalars['String']['output']>;
  tokenType: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ScrollTicketInput = {
  checkin: Scalars['String']['input'];
  contractAddress: Scalars['String']['input'];
  description: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
  image_url: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Int']['input']>;
  status: Scalars['String']['input'];
  tbd?: InputMaybe<Scalars['String']['input']>;
  tokenType: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type SetOptionsInput = {
  /** Inform indexers if they should index this document or not */
  shouldIndex?: InputMaybe<Scalars['Boolean']['input']>;
  /** Maximum amount of time to lookup the stream over the network, in seconds - see https://developers.ceramic.network/reference/typescript/interfaces/_ceramicnetwork_common.CreateOpts.html#syncTimeoutSeconds */
  syncTimeout?: InputMaybe<Scalars['Int']['input']>;
};

export type SetZucityProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: ZucityProfileInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetZucityProfilePayload = {
  __typename?: 'SetZucityProfilePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetZucityProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringValueFilterInput = {
  equalTo?: InputMaybe<Scalars['String']['input']>;
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['String']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Tbd = {
  __typename?: 'TBD';
  tbd?: Maybe<Scalars['String']['output']>;
};

export type TbdInput = {
  tbd?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOptionsInput = {
  /** Fully replace the document contents instead of performing a shallow merge */
  replace?: InputMaybe<Scalars['Boolean']['input']>;
  /** Inform indexers if they should index this document or not */
  shouldIndex?: InputMaybe<Scalars['Boolean']['input']>;
  /** Only perform mutation if the document matches the provided version */
  version?: InputMaybe<Scalars['CeramicCommitID']['input']>;
};

export type UpdateZucityAnnouncementInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityAnnouncementInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityAnnouncementPayload = {
  __typename?: 'UpdateZucityAnnouncementPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityAnnouncement;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityAnnouncementPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityApplicationFormInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityApplicationFormInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityApplicationFormPayload = {
  __typename?: 'UpdateZucityApplicationFormPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityApplicationForm;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityApplicationFormPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityDappInfoInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityDappInfoInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityDappInfoPayload = {
  __typename?: 'UpdateZucityDappInfoPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityDappInfo;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityDappInfoPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityEventInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityEventInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityEventPayload = {
  __typename?: 'UpdateZucityEventPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityEvent;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityEventPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityEventPostInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityEventPostInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityEventPostPayload = {
  __typename?: 'UpdateZucityEventPostPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityEventPost;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityEventPostPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityEventRegistrationAndAccessInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityEventRegistrationAndAccessInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityEventRegistrationAndAccessPayload = {
  __typename?: 'UpdateZucityEventRegistrationAndAccessPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityEventRegistrationAndAccess;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityEventRegistrationAndAccessPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityInstalledAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityInstalledAppInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityInstalledAppPayload = {
  __typename?: 'UpdateZucityInstalledAppPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityInstalledApp;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityInstalledAppPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityInvitationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityInvitationInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityInvitationPayload = {
  __typename?: 'UpdateZucityInvitationPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityInvitation;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityInvitationPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityPermissionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityPermissionInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityPermissionPayload = {
  __typename?: 'UpdateZucityPermissionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityPermission;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityPermissionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityProfileInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityProfilePayload = {
  __typename?: 'UpdateZucityProfilePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityRoleInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityRoleInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityRolePayload = {
  __typename?: 'UpdateZucityRolePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityRole;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityRolePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityRolePermissionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityRolePermissionInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityRolePermissionPayload = {
  __typename?: 'UpdateZucityRolePermissionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityRolePermission;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityRolePermissionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucitySessionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucitySessionInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucitySessionPayload = {
  __typename?: 'UpdateZucitySessionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucitySession;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucitySessionPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucitySpaceGatingInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucitySpaceGatingInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucitySpaceGatingPayload = {
  __typename?: 'UpdateZucitySpaceGatingPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucitySpaceGating;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucitySpaceGatingPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucitySpaceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucitySpaceInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucitySpacePayload = {
  __typename?: 'UpdateZucitySpacePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucitySpace;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucitySpacePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateZucityUserRolesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialZucityUserRolesInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateZucityUserRolesPayload = {
  __typename?: 'UpdateZucityUserRolesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: ZucityUserRoles;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateZucityUserRolesPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type ZucityAnnouncement = Node & {
  __typename?: 'ZucityAnnouncement';
  /** Account controlling the document */
  author: CeramicAccount;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  description?: Maybe<Scalars['String']['output']>;
  event?: Maybe<ZucityEvent>;
  eventId?: Maybe<Scalars['CeramicStreamID']['output']>;
  id: Scalars['ID']['output'];
  sourceId: Scalars['String']['output'];
  space?: Maybe<ZucitySpace>;
  spaceId?: Maybe<Scalars['CeramicStreamID']['output']>;
  tags?: Maybe<Array<Maybe<ZucityAnnouncementTag>>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** A connection to a list of items. */
export type ZucityAnnouncementConnection = {
  __typename?: 'ZucityAnnouncementConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityAnnouncementEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityAnnouncementEdge = {
  __typename?: 'ZucityAnnouncementEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityAnnouncement>;
};

export type ZucityAnnouncementInput = {
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  sourceId: Scalars['String']['input'];
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  tags?: InputMaybe<Array<InputMaybe<ZucityAnnouncementTagInput>>>;
  title: Scalars['String']['input'];
  updatedAt: Scalars['DateTime']['input'];
};

export type ZucityAnnouncementTag = {
  __typename?: 'ZucityAnnouncementTag';
  tag: Scalars['String']['output'];
};

export type ZucityAnnouncementTagInput = {
  tag: Scalars['String']['input'];
};

export type ZucityApplicationForm = Node & {
  __typename?: 'ZucityApplicationForm';
  answers?: Maybe<Scalars['String']['output']>;
  approveStatus?: Maybe<Scalars['String']['output']>;
  /** Account controlling the document */
  author: CeramicAccount;
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  event?: Maybe<ZucityEvent>;
  eventId: Scalars['CeramicStreamID']['output'];
  id: Scalars['ID']['output'];
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
};

/** A connection to a list of items. */
export type ZucityApplicationFormConnection = {
  __typename?: 'ZucityApplicationFormConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityApplicationFormEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityApplicationFormEdge = {
  __typename?: 'ZucityApplicationFormEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityApplicationForm>;
};

export type ZucityApplicationFormInput = {
  answers?: InputMaybe<Scalars['String']['input']>;
  approveStatus?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId: Scalars['CeramicStreamID']['input'];
  profileId: Scalars['CeramicStreamID']['input'];
};

export type ZucityDappInfo = Node & {
  __typename?: 'ZucityDappInfo';
  appLogoUrl: Scalars['String']['output'];
  appName: Scalars['String']['output'];
  appType: Scalars['String']['output'];
  appUrl?: Maybe<Scalars['String']['output']>;
  auditLogUrl?: Maybe<Scalars['String']['output']>;
  auditStatus?: Maybe<Scalars['String']['output']>;
  audited?: Maybe<Scalars['String']['output']>;
  /** Account controlling the document */
  author: CeramicAccount;
  bannerUrl: Scalars['String']['output'];
  categories: Scalars['String']['output'];
  createdAtTime: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  description: Scalars['String']['output'];
  devStatus: Scalars['String']['output'];
  developerName: Scalars['String']['output'];
  docsUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  installEnv?: Maybe<Scalars['String']['output']>;
  installedEvents?: Maybe<Array<Maybe<Scalars['CeramicStreamID']['output']>>>;
  installedSpaces?: Maybe<Array<Maybe<Scalars['CeramicStreamID']['output']>>>;
  integrateType?: Maybe<Scalars['String']['output']>;
  isInstallable: Scalars['String']['output'];
  isSCApp?: Maybe<Scalars['String']['output']>;
  openSource: Scalars['String']['output'];
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
  repositoryUrl?: Maybe<Scalars['String']['output']>;
  scAddresses?: Maybe<Array<Maybe<ZucityDappInfoScAddress>>>;
  tagline: Scalars['String']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type ZucityDappInfoConnection = {
  __typename?: 'ZucityDappInfoConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityDappInfoEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityDappInfoEdge = {
  __typename?: 'ZucityDappInfoEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityDappInfo>;
};

export type ZucityDappInfoFiltersInput = {
  and?: InputMaybe<Array<ZucityDappInfoFiltersInput>>;
  not?: InputMaybe<ZucityDappInfoFiltersInput>;
  or?: InputMaybe<Array<ZucityDappInfoFiltersInput>>;
  where?: InputMaybe<ZucityDappInfoObjectFilterInput>;
};

export type ZucityDappInfoInput = {
  appLogoUrl: Scalars['String']['input'];
  appName: Scalars['String']['input'];
  appType: Scalars['String']['input'];
  appUrl?: InputMaybe<Scalars['String']['input']>;
  auditLogUrl?: InputMaybe<Scalars['String']['input']>;
  auditStatus?: InputMaybe<Scalars['String']['input']>;
  audited?: InputMaybe<Scalars['String']['input']>;
  bannerUrl: Scalars['String']['input'];
  categories: Scalars['String']['input'];
  createdAtTime: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description: Scalars['String']['input'];
  devStatus: Scalars['String']['input'];
  developerName: Scalars['String']['input'];
  docsUrl?: InputMaybe<Scalars['String']['input']>;
  installEnv?: InputMaybe<Scalars['String']['input']>;
  installedEvents?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  installedSpaces?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  integrateType?: InputMaybe<Scalars['String']['input']>;
  isInstallable: Scalars['String']['input'];
  isSCApp?: InputMaybe<Scalars['String']['input']>;
  openSource: Scalars['String']['input'];
  profileId: Scalars['CeramicStreamID']['input'];
  repositoryUrl?: InputMaybe<Scalars['String']['input']>;
  scAddresses?: InputMaybe<Array<InputMaybe<ZucityDappInfoScAddressInput>>>;
  tagline: Scalars['String']['input'];
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ZucityDappInfoObjectFilterInput = {
  appName?: InputMaybe<StringValueFilterInput>;
  appType?: InputMaybe<StringValueFilterInput>;
  audited?: InputMaybe<StringValueFilterInput>;
  createdAtTime?: InputMaybe<StringValueFilterInput>;
  devStatus?: InputMaybe<StringValueFilterInput>;
  developerName?: InputMaybe<StringValueFilterInput>;
  installEnv?: InputMaybe<StringValueFilterInput>;
  isInstallable?: InputMaybe<StringValueFilterInput>;
  isSCApp?: InputMaybe<StringValueFilterInput>;
  openSource?: InputMaybe<StringValueFilterInput>;
};

export type ZucityDappInfoScAddress = {
  __typename?: 'ZucityDappInfoScAddress';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
};

export type ZucityDappInfoScAddressInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
};

export type ZucityDappInfoSortingInput = {
  appName?: InputMaybe<SortOrder>;
  appType?: InputMaybe<SortOrder>;
  audited?: InputMaybe<SortOrder>;
  createdAtTime?: InputMaybe<SortOrder>;
  devStatus?: InputMaybe<SortOrder>;
  developerName?: InputMaybe<SortOrder>;
  installEnv?: InputMaybe<SortOrder>;
  isInstallable?: InputMaybe<SortOrder>;
  isSCApp?: InputMaybe<SortOrder>;
  openSource?: InputMaybe<SortOrder>;
};

export type ZucityEvent = Node & {
  __typename?: 'ZucityEvent';
  admins?: Maybe<Array<Maybe<CeramicAccount>>>;
  announcements: ZucityAnnouncementConnection;
  applicationForms: ZucityApplicationFormConnection;
  /** Account controlling the document */
  author: CeramicAccount;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  customLinks?: Maybe<Array<Maybe<ZucityEventLink>>>;
  description?: Maybe<Scalars['String']['output']>;
  endTime: Scalars['DateTime']['output'];
  externalUrl?: Maybe<Scalars['String']['output']>;
  gated?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  installedApps: ZucityInstalledAppConnection;
  maxParticipant?: Maybe<Scalars['Int']['output']>;
  meetingUrl?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<Maybe<CeramicAccount>>>;
  minParticipant?: Maybe<Scalars['Int']['output']>;
  participantCount?: Maybe<Scalars['Int']['output']>;
  posts: ZucityEventPostConnection;
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
  regAndAccess: ZucityEventRegistrationAndAccessConnection;
  scrollpassHash?: Maybe<Array<Maybe<ZucityEventMemberScrollpass>>>;
  sessionStorage?: Maybe<Scalars['String']['output']>;
  sessions: ZucitySessionConnection;
  space?: Maybe<ZucitySpace>;
  spaceId: Scalars['CeramicStreamID']['output'];
  startTime: Scalars['DateTime']['output'];
  status?: Maybe<Scalars['String']['output']>;
  superAdmin: Array<CeramicAccount>;
  supportChain?: Maybe<Scalars['String']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  tracks?: Maybe<Scalars['String']['output']>;
  update?: Maybe<Array<Maybe<ZucityEventOrganizerUpdate>>>;
  userRoles: ZucityUserRolesConnection;
  zulottoHash?: Maybe<Array<Maybe<ZucityEventMemberZulotto>>>;
  zupassHash?: Maybe<Array<Maybe<ZucityEventMemberZupass>>>;
};


export type ZucityEventAnnouncementsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ZucityEventApplicationFormsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ZucityEventInstalledAppsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInstalledAppSortingInput>;
};


export type ZucityEventPostsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventPostFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventPostSortingInput>;
};


export type ZucityEventRegAndAccessArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ZucityEventSessionsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucitySessionFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucitySessionSortingInput>;
};


export type ZucityEventUserRolesArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityUserRolesFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityUserRolesSortingInput>;
};

/** A connection to a list of items. */
export type ZucityEventConnection = {
  __typename?: 'ZucityEventConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityEventEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityEventEdge = {
  __typename?: 'ZucityEventEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityEvent>;
};

export type ZucityEventFiltersInput = {
  and?: InputMaybe<Array<ZucityEventFiltersInput>>;
  not?: InputMaybe<ZucityEventFiltersInput>;
  or?: InputMaybe<Array<ZucityEventFiltersInput>>;
  where?: InputMaybe<ZucityEventObjectFilterInput>;
};

export type ZucityEventInput = {
  admins?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  customLinks?: InputMaybe<Array<InputMaybe<ZucityEventLinkInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTime: Scalars['DateTime']['input'];
  externalUrl?: InputMaybe<Scalars['String']['input']>;
  gated?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  maxParticipant?: InputMaybe<Scalars['Int']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  members?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  minParticipant?: InputMaybe<Scalars['Int']['input']>;
  participantCount?: InputMaybe<Scalars['Int']['input']>;
  profileId: Scalars['CeramicStreamID']['input'];
  scrollpassHash?: InputMaybe<Array<InputMaybe<ZucityEventMemberScrollpassInput>>>;
  sessionStorage?: InputMaybe<Scalars['String']['input']>;
  spaceId: Scalars['CeramicStreamID']['input'];
  startTime: Scalars['DateTime']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  superAdmin: Array<InputMaybe<Scalars['DID']['input']>>;
  supportChain?: InputMaybe<Scalars['String']['input']>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  tracks?: InputMaybe<Scalars['String']['input']>;
  update?: InputMaybe<Array<InputMaybe<ZucityEventOrganizerUpdateInput>>>;
  zulottoHash?: InputMaybe<Array<InputMaybe<ZucityEventMemberZulottoInput>>>;
  zupassHash?: InputMaybe<Array<InputMaybe<ZucityEventMemberZupassInput>>>;
};

export type ZucityEventLink = {
  __typename?: 'ZucityEventLink';
  links: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ZucityEventLinkInput = {
  links: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ZucityEventMemberScrollpass = {
  __typename?: 'ZucityEventMemberScrollpass';
  hash: Scalars['String']['output'];
};

export type ZucityEventMemberScrollpassInput = {
  hash: Scalars['String']['input'];
};

export type ZucityEventMemberZulotto = {
  __typename?: 'ZucityEventMemberZulotto';
  hash: Scalars['String']['output'];
};

export type ZucityEventMemberZulottoInput = {
  hash: Scalars['String']['input'];
};

export type ZucityEventMemberZupass = {
  __typename?: 'ZucityEventMemberZupass';
  hash: Scalars['String']['output'];
};

export type ZucityEventMemberZupassInput = {
  hash: Scalars['String']['input'];
};

export type ZucityEventObjectFilterInput = {
  createdAt?: InputMaybe<StringValueFilterInput>;
  endTime?: InputMaybe<StringValueFilterInput>;
  gated?: InputMaybe<StringValueFilterInput>;
  startTime?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<StringValueFilterInput>;
  title?: InputMaybe<StringValueFilterInput>;
};

export type ZucityEventOrganizerUpdate = {
  __typename?: 'ZucityEventOrganizerUpdate';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  organizer: CeramicAccount;
  title: Scalars['String']['output'];
};

export type ZucityEventOrganizerUpdateInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  organizer: Scalars['DID']['input'];
  title: Scalars['String']['input'];
};

export type ZucityEventPost = Node & {
  __typename?: 'ZucityEventPost';
  /** Account controlling the document */
  author: CeramicAccount;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  description: Scalars['String']['output'];
  endTime: Scalars['DateTime']['output'];
  event?: Maybe<ZucityEvent>;
  eventId: Scalars['CeramicStreamID']['output'];
  id: Scalars['ID']['output'];
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
  startTime: Scalars['DateTime']['output'];
  tags: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type ZucityEventPostConnection = {
  __typename?: 'ZucityEventPostConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityEventPostEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityEventPostEdge = {
  __typename?: 'ZucityEventPostEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityEventPost>;
};

export type ZucityEventPostFiltersInput = {
  and?: InputMaybe<Array<ZucityEventPostFiltersInput>>;
  not?: InputMaybe<ZucityEventPostFiltersInput>;
  or?: InputMaybe<Array<ZucityEventPostFiltersInput>>;
  where?: InputMaybe<ZucityEventPostObjectFilterInput>;
};

export type ZucityEventPostInput = {
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description: Scalars['String']['input'];
  endTime: Scalars['DateTime']['input'];
  eventId: Scalars['CeramicStreamID']['input'];
  profileId: Scalars['CeramicStreamID']['input'];
  startTime: Scalars['DateTime']['input'];
  tags: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ZucityEventPostObjectFilterInput = {
  createdAt?: InputMaybe<StringValueFilterInput>;
  endTime?: InputMaybe<StringValueFilterInput>;
  startTime?: InputMaybe<StringValueFilterInput>;
  tags?: InputMaybe<StringValueFilterInput>;
  title?: InputMaybe<StringValueFilterInput>;
};

export type ZucityEventPostSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  endTime?: InputMaybe<SortOrder>;
  startTime?: InputMaybe<SortOrder>;
  tags?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type ZucityEventRegistrationAndAccess = Node & {
  __typename?: 'ZucityEventRegistrationAndAccess';
  applicationForm?: Maybe<Scalars['String']['output']>;
  applyOption?: Maybe<Scalars['String']['output']>;
  applyRule?: Maybe<Scalars['String']['output']>;
  /** Account controlling the document */
  author: CeramicAccount;
  checkinOpen?: Maybe<Scalars['String']['output']>;
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  event?: Maybe<ZucityEvent>;
  eventId: Scalars['CeramicStreamID']['output'];
  id: Scalars['ID']['output'];
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
  registrationAccess?: Maybe<Scalars['String']['output']>;
  registrationOpen?: Maybe<Scalars['String']['output']>;
  registrationWhitelist?: Maybe<Array<Maybe<CeramicAccount>>>;
  scannedList?: Maybe<Array<Maybe<CeramicAccount>>>;
  scrollPassContractFactoryID?: Maybe<Scalars['Int']['output']>;
  scrollPassTickets?: Maybe<Array<Maybe<ZucityEventRegistrationAndAccessScrollPassTicket>>>;
  ticketType?: Maybe<Scalars['String']['output']>;
  zuLottoInfo?: Maybe<Array<Maybe<ZucityEventRegistrationAndAccessZuLotto>>>;
  zuPassInfo?: Maybe<Array<Maybe<ZucityEventRegistrationAndAccessZuPass>>>;
};

/** A connection to a list of items. */
export type ZucityEventRegistrationAndAccessConnection = {
  __typename?: 'ZucityEventRegistrationAndAccessConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityEventRegistrationAndAccessEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityEventRegistrationAndAccessEdge = {
  __typename?: 'ZucityEventRegistrationAndAccessEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityEventRegistrationAndAccess>;
};

export type ZucityEventRegistrationAndAccessInput = {
  applicationForm?: InputMaybe<Scalars['String']['input']>;
  applyOption?: InputMaybe<Scalars['String']['input']>;
  applyRule?: InputMaybe<Scalars['String']['input']>;
  checkinOpen?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId: Scalars['CeramicStreamID']['input'];
  profileId: Scalars['CeramicStreamID']['input'];
  registrationAccess?: InputMaybe<Scalars['String']['input']>;
  registrationOpen?: InputMaybe<Scalars['String']['input']>;
  registrationWhitelist?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  scannedList?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  scrollPassContractFactoryID?: InputMaybe<Scalars['Int']['input']>;
  scrollPassTickets?: InputMaybe<Array<InputMaybe<ZucityEventRegistrationAndAccessScrollPassTicketInput>>>;
  ticketType?: InputMaybe<Scalars['String']['input']>;
  zuLottoInfo?: InputMaybe<Array<InputMaybe<ZucityEventRegistrationAndAccessZuLottoInput>>>;
  zuPassInfo?: InputMaybe<Array<InputMaybe<ZucityEventRegistrationAndAccessZuPassInput>>>;
};

export type ZucityEventRegistrationAndAccessScrollPassTicket = {
  __typename?: 'ZucityEventRegistrationAndAccessScrollPassTicket';
  checkin: Scalars['String']['output'];
  contractAddress: Scalars['String']['output'];
  description: Scalars['String']['output'];
  disclaimer?: Maybe<Scalars['String']['output']>;
  image_url: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  tbd?: Maybe<Scalars['String']['output']>;
  tokenType: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ZucityEventRegistrationAndAccessScrollPassTicketInput = {
  checkin: Scalars['String']['input'];
  contractAddress: Scalars['String']['input'];
  description: Scalars['String']['input'];
  disclaimer?: InputMaybe<Scalars['String']['input']>;
  image_url: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Int']['input']>;
  status: Scalars['String']['input'];
  tbd?: InputMaybe<Scalars['String']['input']>;
  tokenType: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type ZucityEventRegistrationAndAccessZuLotto = {
  __typename?: 'ZucityEventRegistrationAndAccessZuLotto';
  contractAddress: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ZucityEventRegistrationAndAccessZuLottoInput = {
  contractAddress: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ZucityEventRegistrationAndAccessZuPass = {
  __typename?: 'ZucityEventRegistrationAndAccessZuPass';
  access?: Maybe<Scalars['String']['output']>;
  eventId?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<Scalars['String']['output']>;
};

export type ZucityEventRegistrationAndAccessZuPassInput = {
  access?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['String']['input']>;
  eventName?: InputMaybe<Scalars['String']['input']>;
  registration?: InputMaybe<Scalars['String']['input']>;
};

export type ZucityEventSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  endTime?: InputMaybe<SortOrder>;
  gated?: InputMaybe<SortOrder>;
  startTime?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type ZucityInstalledApp = Node & {
  __typename?: 'ZucityInstalledApp';
  /** Account controlling the document */
  author: CeramicAccount;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  event?: Maybe<ZucityEvent>;
  eventId?: Maybe<Scalars['CeramicStreamID']['output']>;
  id: Scalars['ID']['output'];
  installedApp?: Maybe<ZucityDappInfo>;
  installedAppId?: Maybe<Scalars['CeramicStreamID']['output']>;
  nativeAppName?: Maybe<Scalars['String']['output']>;
  sourceId: Scalars['String']['output'];
  space?: Maybe<ZucitySpace>;
  spaceId?: Maybe<Scalars['CeramicStreamID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** A connection to a list of items. */
export type ZucityInstalledAppConnection = {
  __typename?: 'ZucityInstalledAppConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityInstalledAppEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityInstalledAppEdge = {
  __typename?: 'ZucityInstalledAppEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityInstalledApp>;
};

export type ZucityInstalledAppFiltersInput = {
  and?: InputMaybe<Array<ZucityInstalledAppFiltersInput>>;
  not?: InputMaybe<ZucityInstalledAppFiltersInput>;
  or?: InputMaybe<Array<ZucityInstalledAppFiltersInput>>;
  where?: InputMaybe<ZucityInstalledAppObjectFilterInput>;
};

export type ZucityInstalledAppInput = {
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  installedAppId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  nativeAppName?: InputMaybe<Scalars['String']['input']>;
  sourceId: Scalars['String']['input'];
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  updatedAt: Scalars['DateTime']['input'];
};

export type ZucityInstalledAppObjectFilterInput = {
  installedAppId?: InputMaybe<StringValueFilterInput>;
  nativeAppName?: InputMaybe<StringValueFilterInput>;
  sourceId?: InputMaybe<StringValueFilterInput>;
};

export type ZucityInstalledAppSortingInput = {
  installedAppId?: InputMaybe<SortOrder>;
  nativeAppName?: InputMaybe<SortOrder>;
  sourceId?: InputMaybe<SortOrder>;
};

export type ZucityInvitation = Node & {
  __typename?: 'ZucityInvitation';
  /** Account controlling the document */
  author: CeramicAccount;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<ZucityInvitationCustomAttribute>>>;
  event?: Maybe<ZucityEvent>;
  eventId?: Maybe<Scalars['CeramicStreamID']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  inviteeId: CeramicAccount;
  inviteeProfile?: Maybe<ZucityProfile>;
  inviteeProfileId?: Maybe<Scalars['CeramicStreamID']['output']>;
  inviterId: CeramicAccount;
  inviterProfile?: Maybe<ZucityProfile>;
  inviterProfileId?: Maybe<Scalars['CeramicStreamID']['output']>;
  isRead: Scalars['String']['output'];
  lastSentAt?: Maybe<Scalars['DateTime']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  resource: Scalars['String']['output'];
  resourceId: Scalars['String']['output'];
  roleId: Scalars['String']['output'];
  space?: Maybe<ZucitySpace>;
  spaceId?: Maybe<Scalars['CeramicStreamID']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** A connection to a list of items. */
export type ZucityInvitationConnection = {
  __typename?: 'ZucityInvitationConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityInvitationEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

export type ZucityInvitationCustomAttribute = {
  __typename?: 'ZucityInvitationCustomAttribute';
  tbd?: Maybe<Scalars['String']['output']>;
};

export type ZucityInvitationCustomAttributeInput = {
  tbd?: InputMaybe<Scalars['String']['input']>;
};

/** An edge in a connection. */
export type ZucityInvitationEdge = {
  __typename?: 'ZucityInvitationEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityInvitation>;
};

export type ZucityInvitationFiltersInput = {
  and?: InputMaybe<Array<ZucityInvitationFiltersInput>>;
  not?: InputMaybe<ZucityInvitationFiltersInput>;
  or?: InputMaybe<Array<ZucityInvitationFiltersInput>>;
  where?: InputMaybe<ZucityInvitationObjectFilterInput>;
};

export type ZucityInvitationInput = {
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<ZucityInvitationCustomAttributeInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  expiresAt: Scalars['DateTime']['input'];
  inviteeId: Scalars['DID']['input'];
  inviteeProfileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  inviterId: Scalars['DID']['input'];
  inviterProfileId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  isRead: Scalars['String']['input'];
  lastSentAt?: InputMaybe<Scalars['DateTime']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  resource: Scalars['String']['input'];
  resourceId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ZucityInvitationObjectFilterInput = {
  inviteeId?: InputMaybe<StringValueFilterInput>;
  isRead?: InputMaybe<StringValueFilterInput>;
  resourceId?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<StringValueFilterInput>;
};

export type ZucityInvitationSortingInput = {
  inviteeId?: InputMaybe<SortOrder>;
  isRead?: InputMaybe<SortOrder>;
  resourceId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type ZucityPermission = Node & {
  __typename?: 'ZucityPermission';
  action: Scalars['String']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  created_at: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  source: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

/** A connection to a list of items. */
export type ZucityPermissionConnection = {
  __typename?: 'ZucityPermissionConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityPermissionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityPermissionEdge = {
  __typename?: 'ZucityPermissionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityPermission>;
};

export type ZucityPermissionFiltersInput = {
  and?: InputMaybe<Array<ZucityPermissionFiltersInput>>;
  not?: InputMaybe<ZucityPermissionFiltersInput>;
  or?: InputMaybe<Array<ZucityPermissionFiltersInput>>;
  where?: InputMaybe<ZucityPermissionObjectFilterInput>;
};

export type ZucityPermissionInput = {
  action: Scalars['String']['input'];
  created_at: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  name: Scalars['String']['input'];
  source: Scalars['String']['input'];
  updated_at: Scalars['DateTime']['input'];
};

export type ZucityPermissionObjectFilterInput = {
  source?: InputMaybe<StringValueFilterInput>;
};

export type ZucityPermissionSortingInput = {
  source?: InputMaybe<SortOrder>;
};

export type ZucityProfile = Node & {
  __typename?: 'ZucityProfile';
  address: Scalars['String']['output'];
  applicationForms: ZucityApplicationFormConnection;
  /** Account controlling the document */
  author: CeramicAccount;
  avatar?: Maybe<Scalars['String']['output']>;
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  dappInfos: ZucityDappInfoConnection;
  email?: Maybe<Scalars['String']['output']>;
  events: ZucityEventConnection;
  id: Scalars['ID']['output'];
  invitatee: ZucityInvitationConnection;
  inviter: ZucityInvitationConnection;
  myScrollPassTickets?: Maybe<Array<Maybe<ScrollTicket>>>;
  spaces: ZucitySpaceConnection;
  username: Scalars['String']['output'];
};


export type ZucityProfileApplicationFormsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ZucityProfileDappInfosArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityDappInfoFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityDappInfoSortingInput>;
};


export type ZucityProfileEventsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventSortingInput>;
};


export type ZucityProfileInvitateeArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInvitationFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInvitationSortingInput>;
};


export type ZucityProfileInviterArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInvitationFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInvitationSortingInput>;
};


export type ZucityProfileSpacesArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucitySpaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucitySpaceSortingInput>;
};

/** A connection to a list of items. */
export type ZucityProfileConnection = {
  __typename?: 'ZucityProfileConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityProfileEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityProfileEdge = {
  __typename?: 'ZucityProfileEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityProfile>;
};

export type ZucityProfileFiltersInput = {
  and?: InputMaybe<Array<ZucityProfileFiltersInput>>;
  not?: InputMaybe<ZucityProfileFiltersInput>;
  or?: InputMaybe<Array<ZucityProfileFiltersInput>>;
  where?: InputMaybe<ZucityProfileObjectFilterInput>;
};

export type ZucityProfileInput = {
  address: Scalars['String']['input'];
  avatar?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  email?: InputMaybe<Scalars['String']['input']>;
  myScrollPassTickets?: InputMaybe<Array<InputMaybe<ScrollTicketInput>>>;
  username: Scalars['String']['input'];
};

export type ZucityProfileObjectFilterInput = {
  address?: InputMaybe<StringValueFilterInput>;
  email?: InputMaybe<StringValueFilterInput>;
  username?: InputMaybe<StringValueFilterInput>;
};

export type ZucityProfileSortingInput = {
  address?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  username?: InputMaybe<SortOrder>;
};

export type ZucityRole = Node & {
  __typename?: 'ZucityRole';
  /** Account controlling the document */
  author: CeramicAccount;
  color: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

/** A connection to a list of items. */
export type ZucityRoleConnection = {
  __typename?: 'ZucityRoleConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityRoleEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityRoleEdge = {
  __typename?: 'ZucityRoleEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityRole>;
};

export type ZucityRoleFiltersInput = {
  and?: InputMaybe<Array<ZucityRoleFiltersInput>>;
  not?: InputMaybe<ZucityRoleFiltersInput>;
  or?: InputMaybe<Array<ZucityRoleFiltersInput>>;
  where?: InputMaybe<ZucityRoleObjectFilterInput>;
};

export type ZucityRoleInput = {
  color: Scalars['String']['input'];
  created_at: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  name: Scalars['String']['input'];
  resourceId?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  updated_at: Scalars['DateTime']['input'];
};

export type ZucityRoleObjectFilterInput = {
  resourceId?: InputMaybe<StringValueFilterInput>;
  source?: InputMaybe<StringValueFilterInput>;
};

export type ZucityRolePermission = Node & {
  __typename?: 'ZucityRolePermission';
  /** Account controlling the document */
  author: CeramicAccount;
  created_at: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  id: Scalars['ID']['output'];
  level: Scalars['String']['output'];
  permissionIds?: Maybe<Array<Maybe<Scalars['CeramicStreamID']['output']>>>;
  resourceId?: Maybe<Scalars['String']['output']>;
  roleId: Scalars['CeramicStreamID']['output'];
  source?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

/** A connection to a list of items. */
export type ZucityRolePermissionConnection = {
  __typename?: 'ZucityRolePermissionConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityRolePermissionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityRolePermissionEdge = {
  __typename?: 'ZucityRolePermissionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityRolePermission>;
};

export type ZucityRolePermissionFiltersInput = {
  and?: InputMaybe<Array<ZucityRolePermissionFiltersInput>>;
  not?: InputMaybe<ZucityRolePermissionFiltersInput>;
  or?: InputMaybe<Array<ZucityRolePermissionFiltersInput>>;
  where?: InputMaybe<ZucityRolePermissionObjectFilterInput>;
};

export type ZucityRolePermissionInput = {
  created_at: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  level: Scalars['String']['input'];
  permissionIds?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['CeramicStreamID']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
  updated_at: Scalars['DateTime']['input'];
};

export type ZucityRolePermissionObjectFilterInput = {
  resourceId?: InputMaybe<StringValueFilterInput>;
  source?: InputMaybe<StringValueFilterInput>;
};

export type ZucityRolePermissionSortingInput = {
  resourceId?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
};

export type ZucityRoleSortingInput = {
  resourceId?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
};

export type ZucitySession = Node & {
  __typename?: 'ZucitySession';
  /** Account controlling the document */
  author: CeramicAccount;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  description: Scalars['String']['output'];
  endTime: Scalars['DateTime']['output'];
  event?: Maybe<ZucityEvent>;
  eventId: Scalars['CeramicStreamID']['output'];
  experienceLevel?: Maybe<Scalars['String']['output']>;
  format: Scalars['String']['output'];
  gated?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  liveStreamLink?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  meetingUrl?: Maybe<Scalars['String']['output']>;
  organizers?: Maybe<Array<Maybe<CeramicAccount>>>;
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
  recordingLink?: Maybe<Scalars['String']['output']>;
  speakers: Array<CeramicAccount>;
  startTime: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  tags: Scalars['String']['output'];
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  track: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type ZucitySessionConnection = {
  __typename?: 'ZucitySessionConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucitySessionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucitySessionEdge = {
  __typename?: 'ZucitySessionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucitySession>;
};

export type ZucitySessionFiltersInput = {
  and?: InputMaybe<Array<ZucitySessionFiltersInput>>;
  not?: InputMaybe<ZucitySessionFiltersInput>;
  or?: InputMaybe<Array<ZucitySessionFiltersInput>>;
  where?: InputMaybe<ZucitySessionObjectFilterInput>;
};

export type ZucitySessionInput = {
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  description: Scalars['String']['input'];
  endTime: Scalars['DateTime']['input'];
  eventId: Scalars['CeramicStreamID']['input'];
  experienceLevel?: InputMaybe<Scalars['String']['input']>;
  format: Scalars['String']['input'];
  gated?: InputMaybe<Scalars['String']['input']>;
  liveStreamLink?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  organizers?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  profileId: Scalars['CeramicStreamID']['input'];
  recordingLink?: InputMaybe<Scalars['String']['input']>;
  speakers: Array<InputMaybe<Scalars['DID']['input']>>;
  startTime: Scalars['DateTime']['input'];
  status: Scalars['String']['input'];
  tags: Scalars['String']['input'];
  timezone?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  track: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ZucitySessionObjectFilterInput = {
  createdAt?: InputMaybe<StringValueFilterInput>;
  endTime?: InputMaybe<StringValueFilterInput>;
  format?: InputMaybe<StringValueFilterInput>;
  gated?: InputMaybe<StringValueFilterInput>;
  startTime?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<StringValueFilterInput>;
  tags?: InputMaybe<StringValueFilterInput>;
  title?: InputMaybe<StringValueFilterInput>;
  track?: InputMaybe<StringValueFilterInput>;
};

export type ZucitySessionSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  endTime?: InputMaybe<SortOrder>;
  format?: InputMaybe<SortOrder>;
  gated?: InputMaybe<SortOrder>;
  startTime?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  tags?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  track?: InputMaybe<SortOrder>;
};

export type ZucitySpace = Node & {
  __typename?: 'ZucitySpace';
  announcements: ZucityAnnouncementConnection;
  /** Account controlling the document */
  author: CeramicAccount;
  avatar?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  customLinks?: Maybe<Array<Maybe<ZucitySpaceLink>>>;
  description: Scalars['String']['output'];
  events: ZucityEventConnection;
  gated?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  installedApps: ZucityInstalledAppConnection;
  name: Scalars['String']['output'];
  owner: CeramicAccount;
  profile?: Maybe<ZucityProfile>;
  profileId: Scalars['CeramicStreamID']['output'];
  socialLinks?: Maybe<Array<Maybe<ZucitySpaceLink>>>;
  spaceGating: ZucitySpaceGatingConnection;
  tagline?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<ZucitySpaceTag>>>;
  updatedAt: Scalars['DateTime']['output'];
  userRoles: ZucityUserRolesConnection;
};


export type ZucitySpaceAnnouncementsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ZucitySpaceEventsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityEventFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityEventSortingInput>;
};


export type ZucitySpaceInstalledAppsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityInstalledAppSortingInput>;
};


export type ZucitySpaceSpaceGatingArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ZucitySpaceUserRolesArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ZucityUserRolesFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<ZucityUserRolesSortingInput>;
};

/** A connection to a list of items. */
export type ZucitySpaceConnection = {
  __typename?: 'ZucitySpaceConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucitySpaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucitySpaceEdge = {
  __typename?: 'ZucitySpaceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucitySpace>;
};

export type ZucitySpaceFiltersInput = {
  and?: InputMaybe<Array<ZucitySpaceFiltersInput>>;
  not?: InputMaybe<ZucitySpaceFiltersInput>;
  or?: InputMaybe<Array<ZucitySpaceFiltersInput>>;
  where?: InputMaybe<ZucitySpaceObjectFilterInput>;
};

export type ZucitySpaceGating = Node & {
  __typename?: 'ZucitySpaceGating';
  ERC20ContractAddress?: Maybe<Scalars['String']['output']>;
  ERC721ContractAddress?: Maybe<Scalars['String']['output']>;
  ERC1155ContractAddress?: Maybe<Scalars['String']['output']>;
  /** Account controlling the document */
  author: CeramicAccount;
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  gatingCondition?: Maybe<Scalars['String']['output']>;
  gatingStatus?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  poapsId?: Maybe<Array<Maybe<ZucitySpaceGatingPoapid>>>;
  roleId?: Maybe<Scalars['String']['output']>;
  space?: Maybe<ZucitySpace>;
  spaceId: Scalars['CeramicStreamID']['output'];
  zuPassInfo?: Maybe<ZucitySpaceGatingZuPass>;
};

/** A connection to a list of items. */
export type ZucitySpaceGatingConnection = {
  __typename?: 'ZucitySpaceGatingConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucitySpaceGatingEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucitySpaceGatingEdge = {
  __typename?: 'ZucitySpaceGatingEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucitySpaceGating>;
};

export type ZucitySpaceGatingInput = {
  ERC20ContractAddress?: InputMaybe<Scalars['String']['input']>;
  ERC721ContractAddress?: InputMaybe<Scalars['String']['input']>;
  ERC1155ContractAddress?: InputMaybe<Scalars['String']['input']>;
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  gatingCondition?: InputMaybe<Scalars['String']['input']>;
  gatingStatus?: InputMaybe<Scalars['String']['input']>;
  poapsId?: InputMaybe<Array<InputMaybe<ZucitySpaceGatingPoapidInput>>>;
  roleId?: InputMaybe<Scalars['String']['input']>;
  spaceId: Scalars['CeramicStreamID']['input'];
  zuPassInfo?: InputMaybe<ZucitySpaceGatingZuPassInput>;
};

export type ZucitySpaceGatingPoapid = {
  __typename?: 'ZucitySpaceGatingPoapid';
  poapId: Scalars['Int']['output'];
};

export type ZucitySpaceGatingPoapidInput = {
  poapId: Scalars['Int']['input'];
};

export type ZucitySpaceGatingZuPass = {
  __typename?: 'ZucitySpaceGatingZuPass';
  access?: Maybe<Scalars['String']['output']>;
  eventId?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  registration?: Maybe<Scalars['String']['output']>;
};

export type ZucitySpaceGatingZuPassInput = {
  access?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['String']['input']>;
  eventName?: InputMaybe<Scalars['String']['input']>;
  registration?: InputMaybe<Scalars['String']['input']>;
};

export type ZucitySpaceInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  banner?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  customLinks?: InputMaybe<Array<InputMaybe<ZucitySpaceLinkInput>>>;
  description: Scalars['String']['input'];
  gated?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  owner: Scalars['DID']['input'];
  profileId: Scalars['CeramicStreamID']['input'];
  socialLinks?: InputMaybe<Array<InputMaybe<ZucitySpaceLinkInput>>>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<ZucitySpaceTagInput>>>;
  updatedAt: Scalars['DateTime']['input'];
};

export type ZucitySpaceLink = {
  __typename?: 'ZucitySpaceLink';
  links: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ZucitySpaceLinkInput = {
  links: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ZucitySpaceObjectFilterInput = {
  category?: InputMaybe<StringValueFilterInput>;
  gated?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
  owner?: InputMaybe<StringValueFilterInput>;
};

export type ZucitySpaceSortingInput = {
  category?: InputMaybe<SortOrder>;
  gated?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  owner?: InputMaybe<SortOrder>;
};

export type ZucitySpaceTag = {
  __typename?: 'ZucitySpaceTag';
  tag: Scalars['String']['output'];
};

export type ZucitySpaceTagInput = {
  tag: Scalars['String']['input'];
};

export type ZucityUserRoles = Node & {
  __typename?: 'ZucityUserRoles';
  /** Account controlling the document */
  author: CeramicAccount;
  created_at: Scalars['DateTime']['output'];
  customAttributes?: Maybe<Array<Maybe<Tbd>>>;
  event?: Maybe<ZucityEvent>;
  eventId?: Maybe<Scalars['CeramicStreamID']['output']>;
  id: Scalars['ID']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  roleId: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
  space?: Maybe<ZucitySpace>;
  spaceId?: Maybe<Scalars['CeramicStreamID']['output']>;
  updated_at: Scalars['DateTime']['output'];
  userId: CeramicAccount;
};

/** A connection to a list of items. */
export type ZucityUserRolesConnection = {
  __typename?: 'ZucityUserRolesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ZucityUserRolesEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ZucityUserRolesEdge = {
  __typename?: 'ZucityUserRolesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ZucityUserRoles>;
};

export type ZucityUserRolesFiltersInput = {
  and?: InputMaybe<Array<ZucityUserRolesFiltersInput>>;
  not?: InputMaybe<ZucityUserRolesFiltersInput>;
  or?: InputMaybe<Array<ZucityUserRolesFiltersInput>>;
  where?: InputMaybe<ZucityUserRolesObjectFilterInput>;
};

export type ZucityUserRolesInput = {
  created_at: Scalars['DateTime']['input'];
  customAttributes?: InputMaybe<Array<InputMaybe<TbdInput>>>;
  eventId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['String']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  updated_at: Scalars['DateTime']['input'];
  userId: Scalars['DID']['input'];
};

export type ZucityUserRolesObjectFilterInput = {
  resourceId?: InputMaybe<StringValueFilterInput>;
  roleId?: InputMaybe<StringValueFilterInput>;
  source?: InputMaybe<StringValueFilterInput>;
  userId?: InputMaybe<StringValueFilterInput>;
};

export type ZucityUserRolesSortingInput = {
  resourceId?: InputMaybe<SortOrder>;
  roleId?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type CreateZucityAnnouncementMutationMutationVariables = Exact<{
  input: CreateZucityAnnouncementInput;
}>;


export type CreateZucityAnnouncementMutationMutation = { __typename?: 'Mutation', createZucityAnnouncement?: { __typename?: 'CreateZucityAnnouncementPayload', document: { __typename?: 'ZucityAnnouncement', id: string, title: string, description?: string | null, createdAt: any, updatedAt: any, sourceId: string, spaceId?: any | null, eventId?: any | null, space?: { __typename?: 'ZucitySpace', id: string, name: string } | null, event?: { __typename?: 'ZucityEvent', id: string, title: string } | null } } | null };

export type UpdateZucityAnnouncementMutationMutationVariables = Exact<{
  input: UpdateZucityAnnouncementInput;
}>;


export type UpdateZucityAnnouncementMutationMutation = { __typename?: 'Mutation', updateZucityAnnouncement?: { __typename?: 'UpdateZucityAnnouncementPayload', document: { __typename?: 'ZucityAnnouncement', id: string, title: string, description?: string | null, updatedAt: any } } | null };

export type EnableIndexingZucityAnnouncementMutationVariables = Exact<{
  input: EnableIndexingZucityAnnouncementInput;
}>;


export type EnableIndexingZucityAnnouncementMutation = { __typename?: 'Mutation', enableIndexingZucityAnnouncement?: { __typename?: 'EnableIndexingZucityAnnouncementPayload', document?: { __typename?: 'ZucityAnnouncement', id: string } | null } | null };

export type GetSpaceAnnouncementsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSpaceAnnouncementsQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace', announcements: { __typename?: 'ZucityAnnouncementConnection', edges?: Array<{ __typename?: 'ZucityAnnouncementEdge', node?: { __typename?: 'ZucityAnnouncement', id: string, title: string, description?: string | null, createdAt: any, updatedAt: any, sourceId: string, tags?: Array<{ __typename?: 'ZucityAnnouncementTag', tag: string } | null> | null, author: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', avatar?: string | null, username: string } | null } } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetEventAnnouncementsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEventAnnouncementsQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent', announcements: { __typename?: 'ZucityAnnouncementConnection', edges?: Array<{ __typename?: 'ZucityAnnouncementEdge', node?: { __typename?: 'ZucityAnnouncement', id: string, title: string, description?: string | null, createdAt: any, updatedAt: any, sourceId: string, tags?: Array<{ __typename?: 'ZucityAnnouncementTag', tag: string } | null> | null, author: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', avatar?: string | null, username: string } | null } } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace' } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetDappListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<ZucityDappInfoFiltersInput>;
}>;


export type GetDappListQuery = { __typename?: 'Query', zucityDappInfoIndex?: { __typename?: 'ZucityDappInfoConnection', edges?: Array<{ __typename?: 'ZucityDappInfoEdge', node?: { __typename?: 'ZucityDappInfo', id: string, appName: string, tagline: string, developerName: string, description: string, bannerUrl: string, categories: string, devStatus: string, openSource: string, repositoryUrl?: string | null, appUrl?: string | null, websiteUrl?: string | null, docsUrl?: string | null, isInstallable: string, appLogoUrl: string, auditLogUrl?: string | null, isSCApp?: string | null, scAddresses?: Array<{ __typename?: 'ZucityDappInfoScAddress', address?: string | null, chain?: string | null } | null> | null, profile?: { __typename?: 'ZucityProfile', avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null } | null } | null> | null } | null };

export type CreateZucityDappMutationMutationVariables = Exact<{
  input: CreateZucityDappInfoInput;
}>;


export type CreateZucityDappMutationMutation = { __typename?: 'Mutation', createZucityDappInfo?: { __typename?: 'CreateZucityDappInfoPayload', document: { __typename?: 'ZucityDappInfo', id: string } } | null };

export type UpdateZucityDappMutationMutationVariables = Exact<{
  input: UpdateZucityDappInfoInput;
}>;


export type UpdateZucityDappMutationMutation = { __typename?: 'Mutation', updateZucityDappInfo?: { __typename?: 'UpdateZucityDappInfoPayload', document: { __typename?: 'ZucityDappInfo', id: string } } | null };

export type GetDappByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDappByIdQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo', id: string, appName: string, tagline: string, developerName: string, description: string, bannerUrl: string, categories: string, devStatus: string, openSource: string, repositoryUrl?: string | null, appUrl?: string | null, websiteUrl?: string | null, docsUrl?: string | null, isInstallable: string, appLogoUrl: string, auditLogUrl?: string | null, isSCApp?: string | null, scAddresses?: Array<{ __typename?: 'ZucityDappInfoScAddress', address?: string | null, chain?: string | null } | null> | null, profile?: { __typename?: 'ZucityProfile', avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace' } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetAllEventsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllEventsQuery = { __typename?: 'Query', zucityEventIndex?: { __typename?: 'ZucityEventConnection', edges?: Array<{ __typename?: 'ZucityEventEdge', node?: { __typename?: 'ZucityEvent', id: string, description?: string | null, profileId: any, tagline?: string | null, gated?: string | null, createdAt: any, endTime: any, externalUrl?: string | null, imageUrl?: string | null, participantCount?: number | null, spaceId: any, startTime: any, status?: string | null, supportChain?: string | null, timezone?: string | null, title: string, tracks?: string | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, superAdmin: Array<{ __typename?: 'CeramicAccount', id: string }>, admins?: Array<{ __typename?: 'CeramicAccount', id: string } | null> | null, author: { __typename?: 'CeramicAccount', id: string }, customLinks?: Array<{ __typename?: 'ZucityEventLink', links: string, title: string } | null> | null, members?: Array<{ __typename?: 'CeramicAccount', id: string } | null> | null } | null } | null> | null } | null };

export type GetEventByIdsQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetEventByIdsQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent', id: string, description?: string | null, profileId: any, tagline?: string | null, gated?: string | null, createdAt: any, endTime: any, externalUrl?: string | null, imageUrl?: string | null, participantCount?: number | null, spaceId: any, startTime: any, status?: string | null, supportChain?: string | null, timezone?: string | null, title: string, tracks?: string | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, superAdmin: Array<{ __typename?: 'CeramicAccount', id: string }>, admins?: Array<{ __typename?: 'CeramicAccount', id: string } | null> | null, author: { __typename?: 'CeramicAccount', id: string }, customLinks?: Array<{ __typename?: 'ZucityEventLink', links: string, title: string } | null> | null, members?: Array<{ __typename?: 'CeramicAccount', id: string } | null> | null } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace' } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null> };

export type SearchProfileByExactUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type SearchProfileByExactUsernameQuery = { __typename?: 'Query', zucityProfileIndex?: { __typename?: 'ZucityProfileConnection', edges?: Array<{ __typename?: 'ZucityProfileEdge', node?: { __typename?: 'ZucityProfile', id: string, username: string, avatar?: string | null, author: { __typename?: 'CeramicAccount', id: string } } | null } | null> | null } | null };

export type GetProfileByDidQueryVariables = Exact<{
  did: Scalars['ID']['input'];
}>;


export type GetProfileByDidQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount', zucityProfile?: { __typename?: 'ZucityProfile', id: string, username: string, avatar?: string | null, author: { __typename?: 'CeramicAccount', id: string } } | null } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace' } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type CreateProfileMutationVariables = Exact<{
  input: SetZucityProfileInput;
}>;


export type CreateProfileMutation = { __typename?: 'Mutation', setZucityProfile?: { __typename?: 'SetZucityProfilePayload', document: { __typename?: 'ZucityProfile', id: string, username: string } } | null };

export type GetOwnProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOwnProfileQuery = { __typename?: 'Query', viewer?: { __typename?: 'CeramicAccount', zucityProfile?: { __typename?: 'ZucityProfile', avatar?: string | null, id: string, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null } | null };

export type GetUserOwnSpaceQueryVariables = Exact<{
  did: Scalars['ID']['input'];
}>;


export type GetUserOwnSpaceQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount', zucityProfile?: { __typename?: 'ZucityProfile', id: string, username: string, avatar?: string | null, author: { __typename?: 'CeramicAccount', id: string }, spaces: { __typename?: 'ZucitySpaceConnection', edges?: Array<{ __typename?: 'ZucitySpaceEdge', node?: { __typename?: 'ZucitySpace', id: string, avatar?: string | null, banner?: string | null, name: string, description: string, category?: string | null, color?: string | null, profileId: any, tagline?: string | null, createdAt: any, updatedAt: any, author: { __typename?: 'CeramicAccount', id: string }, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, customLinks?: Array<{ __typename?: 'ZucitySpaceLink', links: string, title: string } | null> | null, owner: { __typename?: 'CeramicAccount', id: string }, socialLinks?: Array<{ __typename?: 'ZucitySpaceLink', links: string, title: string } | null> | null, tags?: Array<{ __typename?: 'ZucitySpaceTag', tag: string } | null> | null } | null } | null> | null } } | null } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace' } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetUserOwnEventQueryVariables = Exact<{
  did: Scalars['ID']['input'];
}>;


export type GetUserOwnEventQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount', zucityProfile?: { __typename?: 'ZucityProfile', id: string, username: string, avatar?: string | null, events: { __typename?: 'ZucityEventConnection', edges?: Array<{ __typename?: 'ZucityEventEdge', node?: { __typename?: 'ZucityEvent', id: string, createdAt: any, description?: string | null, endTime: any, externalUrl?: string | null, gated?: string | null, imageUrl?: string | null, participantCount?: number | null, minParticipant?: number | null, profileId: any, spaceId: any, startTime: any, status?: string | null, supportChain?: string | null, tagline?: string | null, timezone?: string | null, title: string, tracks?: string | null, admins?: Array<{ __typename?: 'CeramicAccount', id: string } | null> | null, author: { __typename?: 'CeramicAccount', id: string }, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, customLinks?: Array<{ __typename?: 'ZucityEventLink', links: string, title: string } | null> | null, members?: Array<{ __typename?: 'CeramicAccount', id: string } | null> | null, superAdmin: Array<{ __typename?: 'CeramicAccount', id: string }> } | null } | null> | null }, author: { __typename?: 'CeramicAccount', id: string } } | null } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace' } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetMembersQueryVariables = Exact<{
  source?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMembersQuery = { __typename?: 'Query', zucityUserRolesIndex?: { __typename?: 'ZucityUserRolesConnection', edges?: Array<{ __typename?: 'ZucityUserRolesEdge', node?: { __typename?: 'ZucityUserRoles', roleId: string, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, userId: { __typename?: 'CeramicAccount', zucityProfile?: { __typename?: 'ZucityProfile', avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null } } | null } | null> | null } | null };

export type GetUserRoleQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserRoleQuery = { __typename?: 'Query', zucityUserRolesIndex?: { __typename?: 'ZucityUserRolesConnection', edges?: Array<{ __typename?: 'ZucityUserRolesEdge', node?: { __typename?: 'ZucityUserRoles', id: string, roleId: string, userId: { __typename?: 'CeramicAccount', zucityProfile?: { __typename?: 'ZucityProfile', avatar?: string | null, author: { __typename?: 'CeramicAccount', id: string } } | null } } | null } | null> | null } | null };

export type CreateZucityUserRolesMutationVariables = Exact<{
  input: CreateZucityUserRolesInput;
}>;


export type CreateZucityUserRolesMutation = { __typename?: 'Mutation', createZucityUserRoles?: { __typename?: 'CreateZucityUserRolesPayload', document: { __typename?: 'ZucityUserRoles', created_at: any, updated_at: any, resourceId?: string | null, source?: string | null, roleId: string, userId: { __typename?: 'CeramicAccount', id: string } } } | null };

export type EnableIndexingZucityUserRolesMutationVariables = Exact<{
  input: EnableIndexingZucityUserRolesInput;
}>;


export type EnableIndexingZucityUserRolesMutation = { __typename?: 'Mutation', enableIndexingZucityUserRoles?: { __typename?: 'EnableIndexingZucityUserRolesPayload', document?: { __typename?: 'ZucityUserRoles', id: string } | null } | null };

export type UpdateZucityUserRolesMutationVariables = Exact<{
  input: UpdateZucityUserRolesInput;
}>;


export type UpdateZucityUserRolesMutation = { __typename?: 'Mutation', updateZucityUserRoles?: { __typename?: 'UpdateZucityUserRolesPayload', document: { __typename?: 'ZucityUserRoles', id: string } } | null };

export type GetUserRolesQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserRolesQuery = { __typename?: 'Query', zucityUserRolesIndex?: { __typename?: 'ZucityUserRolesConnection', edges?: Array<{ __typename?: 'ZucityUserRolesEdge', node?: { __typename?: 'ZucityUserRoles', id: string, roleId: string, resourceId?: string | null, source?: string | null, userId: { __typename?: 'CeramicAccount', id: string } } | null } | null> | null } | null };

export type GetSpaceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSpaceQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace', id: string, avatar?: string | null, banner?: string | null, description: string, name: string, profileId: any, tagline?: string | null, category?: string | null, color?: string | null, createdAt: any, updatedAt: any, gated?: string | null, tags?: Array<{ __typename?: 'ZucitySpaceTag', tag: string } | null> | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, socialLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, customLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, owner: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', id: string, avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null }, announcements: { __typename?: 'ZucityAnnouncementConnection', edges?: Array<{ __typename?: 'ZucityAnnouncementEdge', node?: { __typename?: 'ZucityAnnouncement', id: string, createdAt: any } | null } | null> | null }, installedApps: { __typename?: 'ZucityInstalledAppConnection', edges?: Array<{ __typename?: 'ZucityInstalledAppEdge', node?: { __typename?: 'ZucityInstalledApp', id: string, sourceId: string, spaceId?: any | null, nativeAppName?: string | null, installedAppId?: any | null, createdAt: any, updatedAt: any, installedApp?: { __typename?: 'ZucityDappInfo', id: string, appName: string, appType: string, description: string, tagline: string, bannerUrl: string, appUrl?: string | null, openSource: string, devStatus: string, developerName: string, categories: string, appLogoUrl: string } | null } | null } | null> | null }, spaceGating: { __typename?: 'ZucitySpaceGatingConnection', edges?: Array<{ __typename?: 'ZucitySpaceGatingEdge', node?: { __typename?: 'ZucitySpaceGating', id: string, gatingStatus?: string | null, spaceId: any, poapsId?: Array<{ __typename?: 'ZucitySpaceGatingPoapid', poapId: number } | null> | null, zuPassInfo?: { __typename?: 'ZucitySpaceGatingZuPass', registration?: string | null, eventId?: string | null, eventName?: string | null } | null } | null } | null> | null } } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetSpaceByIdsQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetSpaceByIdsQuery = { __typename?: 'Query', nodes: Array<{ __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace', id: string, avatar?: string | null, banner?: string | null, description: string, name: string, profileId: any, tagline?: string | null, category?: string | null, color?: string | null, createdAt: any, updatedAt: any, tags?: Array<{ __typename?: 'ZucitySpaceTag', tag: string } | null> | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, socialLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, customLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, owner: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', id: string, avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null } } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null> };

export type InstallDappToSpaceMutationVariables = Exact<{
  input: CreateZucityInstalledAppInput;
}>;


export type InstallDappToSpaceMutation = { __typename?: 'Mutation', createZucityInstalledApp?: { __typename?: 'CreateZucityInstalledAppPayload', document: { __typename?: 'ZucityInstalledApp', id: string, sourceId: string, spaceId?: any | null, nativeAppName?: string | null, installedAppId?: any | null, createdAt: any, updatedAt: any, installedApp?: { __typename?: 'ZucityDappInfo', id: string, appName: string } | null } } | null };

export type GetSpaceInstalledAppsQueryVariables = Exact<{
  filters?: InputMaybe<ZucityInstalledAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSpaceInstalledAppsQuery = { __typename?: 'Query', zucityInstalledAppIndex?: { __typename?: 'ZucityInstalledAppConnection', edges?: Array<{ __typename?: 'ZucityInstalledAppEdge', node?: { __typename?: 'ZucityInstalledApp', id: string, sourceId: string, spaceId?: any | null, nativeAppName?: string | null, installedAppId?: any | null, createdAt: any, updatedAt: any, installedApp?: { __typename?: 'ZucityDappInfo', id: string, appName: string, appType: string, description: string, tagline: string, bannerUrl: string, appUrl?: string | null, openSource: string, devStatus: string, developerName: string, categories: string, appLogoUrl: string } | null, space?: { __typename?: 'ZucitySpace', id: string, name: string } | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } | null };

export type UninstallDappFromSpaceMutationVariables = Exact<{
  input: EnableIndexingZucityInstalledAppInput;
}>;


export type UninstallDappFromSpaceMutation = { __typename?: 'Mutation', enableIndexingZucityInstalledApp?: { __typename?: 'EnableIndexingZucityInstalledAppPayload', document?: { __typename?: 'ZucityInstalledApp', id: string, sourceId: string, spaceId?: any | null, installedAppId?: any | null, createdAt: any, updatedAt: any, installedApp?: { __typename?: 'ZucityDappInfo', id: string, appName: string } | null } | null } | null };

export type CreateZucitySpaceMutationMutationVariables = Exact<{
  input: CreateZucitySpaceInput;
}>;


export type CreateZucitySpaceMutationMutation = { __typename?: 'Mutation', createZucitySpace?: { __typename?: 'CreateZucitySpacePayload', document: { __typename?: 'ZucitySpace', id: string, name: string, description: string, profileId: any, avatar?: string | null, banner?: string | null, category?: string | null } } | null };

export type GetSpacesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSpacesQuery = { __typename?: 'Query', zucitySpaceIndex?: { __typename?: 'ZucitySpaceConnection', edges?: Array<{ __typename?: 'ZucitySpaceEdge', node?: { __typename?: 'ZucitySpace', id: string, avatar?: string | null, banner?: string | null, description: string, name: string, profileId: any, tagline?: string | null, category?: string | null, color?: string | null, createdAt: any, updatedAt: any, tags?: Array<{ __typename?: 'ZucitySpaceTag', tag: string } | null> | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, socialLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, customLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, owner: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', id: string, avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null } } | null } | null> | null } | null };

export type GetSpaceAndEventsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  userRolesFirst?: InputMaybe<Scalars['Int']['input']>;
  userRolesFilters?: InputMaybe<ZucityUserRolesFiltersInput>;
}>;


export type GetSpaceAndEventsQuery = { __typename?: 'Query', node?: { __typename?: 'CeramicAccount' } | { __typename?: 'ZucityAnnouncement' } | { __typename?: 'ZucityApplicationForm' } | { __typename?: 'ZucityDappInfo' } | { __typename?: 'ZucityEvent' } | { __typename?: 'ZucityEventPost' } | { __typename?: 'ZucityEventRegistrationAndAccess' } | { __typename?: 'ZucityInstalledApp' } | { __typename?: 'ZucityInvitation' } | { __typename?: 'ZucityPermission' } | { __typename?: 'ZucityProfile' } | { __typename?: 'ZucityRole' } | { __typename?: 'ZucityRolePermission' } | { __typename?: 'ZucitySession' } | { __typename?: 'ZucitySpace', id: string, avatar?: string | null, banner?: string | null, description: string, name: string, profileId: any, tagline?: string | null, category?: string | null, color?: string | null, createdAt: any, updatedAt: any, gated?: string | null, tags?: Array<{ __typename?: 'ZucitySpaceTag', tag: string } | null> | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, socialLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, customLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, owner: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', id: string, avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null }, events: { __typename?: 'ZucityEventConnection', edges?: Array<{ __typename?: 'ZucityEventEdge', node?: { __typename?: 'ZucityEvent', createdAt: any, description?: string | null, endTime: any, externalUrl?: string | null, gated?: string | null, id: string, imageUrl?: string | null, maxParticipant?: number | null, meetingUrl?: string | null, minParticipant?: number | null, participantCount?: number | null, profileId: any, spaceId: any, startTime: any, status?: string | null, tagline?: string | null, timezone?: string | null, title: string, space?: { __typename?: 'ZucitySpace', name: string, avatar?: string | null } | null } | null } | null> | null }, userRoles: { __typename?: 'ZucityUserRolesConnection', edges?: Array<{ __typename?: 'ZucityUserRolesEdge', node?: { __typename?: 'ZucityUserRoles', roleId: string } | null } | null> | null } } | { __typename?: 'ZucitySpaceGating' } | { __typename?: 'ZucityUserRoles' } | null };

export type GetSpacesAndMembersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  userRolesFirst?: InputMaybe<Scalars['Int']['input']>;
  userRolesFilters?: InputMaybe<ZucityUserRolesFiltersInput>;
}>;


export type GetSpacesAndMembersQuery = { __typename?: 'Query', zucitySpaceIndex?: { __typename?: 'ZucitySpaceConnection', edges?: Array<{ __typename?: 'ZucitySpaceEdge', node?: { __typename?: 'ZucitySpace', id: string, avatar?: string | null, banner?: string | null, description: string, name: string, profileId: any, tagline?: string | null, category?: string | null, color?: string | null, createdAt: any, updatedAt: any, tags?: Array<{ __typename?: 'ZucitySpaceTag', tag: string } | null> | null, customAttributes?: Array<{ __typename?: 'TBD', tbd?: string | null } | null> | null, socialLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, customLinks?: Array<{ __typename?: 'ZucitySpaceLink', title: string, links: string } | null> | null, owner: { __typename?: 'CeramicAccount', id: string, zucityProfile?: { __typename?: 'ZucityProfile', id: string, avatar?: string | null, username: string, author: { __typename?: 'CeramicAccount', id: string } } | null }, userRoles: { __typename?: 'ZucityUserRolesConnection', edges?: Array<{ __typename?: 'ZucityUserRolesEdge', node?: { __typename?: 'ZucityUserRoles', roleId: string } | null } | null> | null } } | null } | null> | null } | null };

export type UpdateZucitySpaceMutationVariables = Exact<{
  input: UpdateZucitySpaceInput;
}>;


export type UpdateZucitySpaceMutation = { __typename?: 'Mutation', updateZucitySpace?: { __typename?: 'UpdateZucitySpacePayload', document: { __typename?: 'ZucitySpace', id: string, name: string, description: string, avatar?: string | null, banner?: string | null, category?: string | null } } | null };

export type CreateSpaceGatingRuleMutationVariables = Exact<{
  input: CreateZucitySpaceGatingInput;
}>;


export type CreateSpaceGatingRuleMutation = { __typename?: 'Mutation', createZucitySpaceGating?: { __typename?: 'CreateZucitySpaceGatingPayload', document: { __typename?: 'ZucitySpaceGating', id: string, spaceId: any, poapsId?: Array<{ __typename?: 'ZucitySpaceGatingPoapid', poapId: number } | null> | null, zuPassInfo?: { __typename?: 'ZucitySpaceGatingZuPass', registration?: string | null, eventId?: string | null, eventName?: string | null } | null } } | null };

export type UpdateSpaceGatingRuleMutationVariables = Exact<{
  input: UpdateZucitySpaceGatingInput;
}>;


export type UpdateSpaceGatingRuleMutation = { __typename?: 'Mutation', updateZucitySpaceGating?: { __typename?: 'UpdateZucitySpaceGatingPayload', document: { __typename?: 'ZucitySpaceGating', id: string } } | null };

export type DeleteSpaceGatingRuleMutationVariables = Exact<{
  input: EnableIndexingZucitySpaceGatingInput;
}>;


export type DeleteSpaceGatingRuleMutation = { __typename?: 'Mutation', enableIndexingZucitySpaceGating?: { __typename?: 'EnableIndexingZucitySpaceGatingPayload', document?: { __typename?: 'ZucitySpaceGating', id: string } | null } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const CreateZucityAnnouncementMutationDocument = new TypedDocumentString(`
    mutation CreateZucityAnnouncementMutation($input: CreateZucityAnnouncementInput!) {
  createZucityAnnouncement(input: $input) {
    document {
      id
      title
      description
      createdAt
      updatedAt
      sourceId
      spaceId
      eventId
      space {
        id
        name
      }
      event {
        id
        title
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CreateZucityAnnouncementMutationMutation, CreateZucityAnnouncementMutationMutationVariables>;
export const UpdateZucityAnnouncementMutationDocument = new TypedDocumentString(`
    mutation UpdateZucityAnnouncementMutation($input: UpdateZucityAnnouncementInput!) {
  updateZucityAnnouncement(input: $input) {
    document {
      id
      title
      description
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateZucityAnnouncementMutationMutation, UpdateZucityAnnouncementMutationMutationVariables>;
export const EnableIndexingZucityAnnouncementDocument = new TypedDocumentString(`
    mutation EnableIndexingZucityAnnouncement($input: EnableIndexingZucityAnnouncementInput!) {
  enableIndexingZucityAnnouncement(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<EnableIndexingZucityAnnouncementMutation, EnableIndexingZucityAnnouncementMutationVariables>;
export const GetSpaceAnnouncementsDocument = new TypedDocumentString(`
    query GetSpaceAnnouncements($id: ID!, $first: Int = 100) {
  node(id: $id) {
    ... on ZucitySpace {
      announcements(first: $first) {
        edges {
          node {
            id
            title
            tags {
              tag
            }
            description
            createdAt
            updatedAt
            sourceId
            author {
              id
              zucityProfile {
                avatar
                username
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpaceAnnouncementsQuery, GetSpaceAnnouncementsQueryVariables>;
export const GetEventAnnouncementsDocument = new TypedDocumentString(`
    query GetEventAnnouncements($id: ID!, $first: Int = 100) {
  node(id: $id) {
    ... on ZucityEvent {
      announcements(first: $first) {
        edges {
          node {
            id
            title
            tags {
              tag
            }
            description
            createdAt
            updatedAt
            sourceId
            author {
              id
              zucityProfile {
                avatar
                username
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetEventAnnouncementsQuery, GetEventAnnouncementsQueryVariables>;
export const GetDappListDocument = new TypedDocumentString(`
    query GetDappList($first: Int = 100, $filters: ZucityDappInfoFiltersInput) {
  zucityDappInfoIndex(first: $first, filters: $filters) {
    edges {
      node {
        id
        appName
        tagline
        developerName
        description
        bannerUrl
        categories
        devStatus
        openSource
        repositoryUrl
        appUrl
        websiteUrl
        docsUrl
        isInstallable
        appLogoUrl
        auditLogUrl
        isSCApp
        scAddresses {
          address
          chain
        }
        profile {
          author {
            id
          }
          avatar
          username
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetDappListQuery, GetDappListQueryVariables>;
export const CreateZucityDappMutationDocument = new TypedDocumentString(`
    mutation CreateZucityDappMutation($input: CreateZucityDappInfoInput!) {
  createZucityDappInfo(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<CreateZucityDappMutationMutation, CreateZucityDappMutationMutationVariables>;
export const UpdateZucityDappMutationDocument = new TypedDocumentString(`
    mutation UpdateZucityDappMutation($input: UpdateZucityDappInfoInput!) {
  updateZucityDappInfo(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateZucityDappMutationMutation, UpdateZucityDappMutationMutationVariables>;
export const GetDappByIdDocument = new TypedDocumentString(`
    query GetDappById($id: ID!) {
  node(id: $id) {
    ... on ZucityDappInfo {
      id
      appName
      tagline
      developerName
      description
      bannerUrl
      categories
      devStatus
      openSource
      repositoryUrl
      appUrl
      websiteUrl
      docsUrl
      isInstallable
      appLogoUrl
      auditLogUrl
      isSCApp
      scAddresses {
        address
        chain
      }
      profile {
        author {
          id
        }
        avatar
        username
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetDappByIdQuery, GetDappByIdQueryVariables>;
export const GetAllEventsDocument = new TypedDocumentString(`
    query GetAllEvents($first: Int) {
  zucityEventIndex(first: $first) {
    edges {
      node {
        id
        description
        profileId
        tagline
        customAttributes {
          tbd
        }
        gated
        superAdmin {
          id
        }
        admins {
          id
        }
        author {
          id
        }
        customLinks {
          links
          title
        }
        createdAt
        endTime
        externalUrl
        imageUrl
        members {
          id
        }
        participantCount
        spaceId
        startTime
        status
        supportChain
        timezone
        title
        tracks
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetAllEventsQuery, GetAllEventsQueryVariables>;
export const GetEventByIdsDocument = new TypedDocumentString(`
    query GetEventByIds($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ZucityEvent {
      id
      description
      profileId
      tagline
      customAttributes {
        tbd
      }
      gated
      superAdmin {
        id
      }
      admins {
        id
      }
      author {
        id
      }
      customLinks {
        links
        title
      }
      createdAt
      endTime
      externalUrl
      imageUrl
      members {
        id
      }
      participantCount
      spaceId
      startTime
      status
      supportChain
      timezone
      title
      tracks
    }
  }
}
    `) as unknown as TypedDocumentString<GetEventByIdsQuery, GetEventByIdsQueryVariables>;
export const SearchProfileByExactUsernameDocument = new TypedDocumentString(`
    query SearchProfileByExactUsername($username: String!) {
  zucityProfileIndex(
    first: 20
    filters: {where: {username: {equalTo: $username}}}
  ) {
    edges {
      node {
        id
        username
        avatar
        author {
          id
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SearchProfileByExactUsernameQuery, SearchProfileByExactUsernameQueryVariables>;
export const GetProfileByDidDocument = new TypedDocumentString(`
    query GetProfileByDID($did: ID!) {
  node(id: $did) {
    ... on CeramicAccount {
      zucityProfile {
        id
        username
        avatar
        author {
          id
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetProfileByDidQuery, GetProfileByDidQueryVariables>;
export const CreateProfileDocument = new TypedDocumentString(`
    mutation CreateProfile($input: SetZucityProfileInput!) {
  setZucityProfile(input: $input) {
    document {
      id
      username
    }
  }
}
    `) as unknown as TypedDocumentString<CreateProfileMutation, CreateProfileMutationVariables>;
export const GetOwnProfileDocument = new TypedDocumentString(`
    query GetOwnProfile {
  viewer {
    zucityProfile {
      author {
        id
      }
      avatar
      id
      username
    }
  }
}
    `) as unknown as TypedDocumentString<GetOwnProfileQuery, GetOwnProfileQueryVariables>;
export const GetUserOwnSpaceDocument = new TypedDocumentString(`
    query GetUserOwnSpace($did: ID!) {
  node(id: $did) {
    ... on CeramicAccount {
      zucityProfile {
        id
        username
        avatar
        author {
          id
        }
        spaces(first: 100) {
          edges {
            node {
              id
              author {
                id
              }
              avatar
              banner
              name
              description
              category
              color
              profileId
              customAttributes {
                tbd
              }
              customLinks {
                links
                title
              }
              owner {
                id
              }
              socialLinks {
                links
                title
              }
              tagline
              tags {
                tag
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserOwnSpaceQuery, GetUserOwnSpaceQueryVariables>;
export const GetUserOwnEventDocument = new TypedDocumentString(`
    query GetUserOwnEvent($did: ID!) {
  node(id: $did) {
    ... on CeramicAccount {
      zucityProfile {
        id
        username
        avatar
        events(first: 100) {
          edges {
            node {
              id
              admins {
                id
              }
              createdAt
              author {
                id
              }
              customAttributes {
                tbd
              }
              customLinks {
                links
                title
              }
              description
              endTime
              externalUrl
              gated
              imageUrl
              members {
                id
              }
              participantCount
              minParticipant
              profileId
              spaceId
              startTime
              status
              superAdmin {
                id
              }
              supportChain
              tagline
              timezone
              title
              tracks
            }
          }
        }
        author {
          id
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserOwnEventQuery, GetUserOwnEventQueryVariables>;
export const GetMembersDocument = new TypedDocumentString(`
    query GetMembers($source: String, $resourceId: String) {
  zucityUserRolesIndex(
    first: 1000
    filters: {where: {source: {equalTo: $source}, resourceId: {equalTo: $resourceId}}}
  ) {
    edges {
      node {
        roleId
        customAttributes {
          tbd
        }
        userId {
          zucityProfile {
            avatar
            username
            author {
              id
            }
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetMembersQuery, GetMembersQueryVariables>;
export const GetUserRoleDocument = new TypedDocumentString(`
    query GetUserRole($userId: String, $resourceId: String, $resource: String) {
  zucityUserRolesIndex(
    first: 1
    filters: {where: {userId: {equalTo: $userId}, resourceId: {equalTo: $resourceId}, source: {equalTo: $resource}}}
  ) {
    edges {
      node {
        id
        roleId
        userId {
          zucityProfile {
            avatar
            author {
              id
            }
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserRoleQuery, GetUserRoleQueryVariables>;
export const CreateZucityUserRolesDocument = new TypedDocumentString(`
    mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {
  createZucityUserRoles(input: $input) {
    document {
      userId {
        id
      }
      created_at
      updated_at
      resourceId
      source
      roleId
    }
  }
}
    `) as unknown as TypedDocumentString<CreateZucityUserRolesMutation, CreateZucityUserRolesMutationVariables>;
export const EnableIndexingZucityUserRolesDocument = new TypedDocumentString(`
    mutation enableIndexingZucityUserRoles($input: EnableIndexingZucityUserRolesInput!) {
  enableIndexingZucityUserRoles(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<EnableIndexingZucityUserRolesMutation, EnableIndexingZucityUserRolesMutationVariables>;
export const UpdateZucityUserRolesDocument = new TypedDocumentString(`
    mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {
  updateZucityUserRoles(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateZucityUserRolesMutation, UpdateZucityUserRolesMutationVariables>;
export const GetUserRolesDocument = new TypedDocumentString(`
    query GetUserRoles($userId: String) {
  zucityUserRolesIndex(
    first: 1000
    filters: {where: {userId: {equalTo: $userId}}}
  ) {
    edges {
      node {
        id
        roleId
        resourceId
        source
        userId {
          id
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserRolesQuery, GetUserRolesQueryVariables>;
export const GetSpaceDocument = new TypedDocumentString(`
    query GetSpace($id: ID!) {
  node(id: $id) {
    ... on ZucitySpace {
      id
      avatar
      banner
      description
      name
      profileId
      tagline
      category
      color
      createdAt
      updatedAt
      gated
      tags {
        tag
      }
      customAttributes {
        tbd
      }
      socialLinks {
        title
        links
      }
      customLinks {
        title
        links
      }
      owner {
        id
        zucityProfile {
          id
          avatar
          author {
            id
          }
          username
        }
      }
      announcements(first: 100) {
        edges {
          node {
            id
            createdAt
          }
        }
      }
      installedApps(first: 100) {
        edges {
          node {
            id
            sourceId
            spaceId
            nativeAppName
            installedAppId
            createdAt
            updatedAt
            installedApp {
              id
              appName
              appType
              description
              tagline
              bannerUrl
              appUrl
              openSource
              devStatus
              developerName
              categories
              appLogoUrl
            }
          }
        }
      }
      spaceGating(first: 100) {
        edges {
          node {
            id
            poapsId {
              poapId
            }
            zuPassInfo {
              registration
              eventId
              eventName
            }
            gatingStatus
            spaceId
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpaceQuery, GetSpaceQueryVariables>;
export const GetSpaceByIdsDocument = new TypedDocumentString(`
    query GetSpaceByIds($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ZucitySpace {
      id
      avatar
      banner
      description
      name
      profileId
      tagline
      category
      color
      createdAt
      updatedAt
      tags {
        tag
      }
      customAttributes {
        tbd
      }
      socialLinks {
        title
        links
      }
      customLinks {
        title
        links
      }
      owner {
        id
        zucityProfile {
          id
          avatar
          author {
            id
          }
          username
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpaceByIdsQuery, GetSpaceByIdsQueryVariables>;
export const InstallDappToSpaceDocument = new TypedDocumentString(`
    mutation InstallDappToSpace($input: CreateZucityInstalledAppInput!) {
  createZucityInstalledApp(input: $input) {
    document {
      id
      sourceId
      spaceId
      nativeAppName
      installedAppId
      installedApp {
        id
        appName
      }
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<InstallDappToSpaceMutation, InstallDappToSpaceMutationVariables>;
export const GetSpaceInstalledAppsDocument = new TypedDocumentString(`
    query GetSpaceInstalledApps($filters: ZucityInstalledAppFiltersInput, $first: Int, $after: String) {
  zucityInstalledAppIndex(filters: $filters, first: $first, after: $after) {
    edges {
      node {
        id
        sourceId
        spaceId
        nativeAppName
        installedAppId
        createdAt
        updatedAt
        installedApp {
          id
          appName
          appType
          description
          tagline
          bannerUrl
          appUrl
          openSource
          devStatus
          developerName
          categories
          appLogoUrl
        }
        space {
          id
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpaceInstalledAppsQuery, GetSpaceInstalledAppsQueryVariables>;
export const UninstallDappFromSpaceDocument = new TypedDocumentString(`
    mutation UninstallDappFromSpace($input: EnableIndexingZucityInstalledAppInput!) {
  enableIndexingZucityInstalledApp(input: $input) {
    document {
      id
      sourceId
      spaceId
      installedAppId
      installedApp {
        id
        appName
      }
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<UninstallDappFromSpaceMutation, UninstallDappFromSpaceMutationVariables>;
export const CreateZucitySpaceMutationDocument = new TypedDocumentString(`
    mutation createZucitySpaceMutation($input: CreateZucitySpaceInput!) {
  createZucitySpace(input: $input) {
    document {
      id
      name
      description
      profileId
      avatar
      banner
      category
    }
  }
}
    `) as unknown as TypedDocumentString<CreateZucitySpaceMutationMutation, CreateZucitySpaceMutationMutationVariables>;
export const GetSpacesDocument = new TypedDocumentString(`
    query GetSpaces($first: Int) {
  zucitySpaceIndex(first: $first) {
    edges {
      node {
        id
        avatar
        banner
        description
        name
        profileId
        tagline
        category
        color
        createdAt
        updatedAt
        tags {
          tag
        }
        customAttributes {
          tbd
        }
        socialLinks {
          title
          links
        }
        customLinks {
          title
          links
        }
        owner {
          id
          zucityProfile {
            id
            avatar
            author {
              id
            }
            username
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpacesQuery, GetSpacesQueryVariables>;
export const GetSpaceAndEventsDocument = new TypedDocumentString(`
    query GetSpaceAndEvents($id: ID!, $userRolesFirst: Int = 100, $userRolesFilters: ZucityUserRolesFiltersInput) {
  node(id: $id) {
    ... on ZucitySpace {
      id
      avatar
      banner
      description
      name
      profileId
      tagline
      category
      color
      createdAt
      updatedAt
      gated
      tags {
        tag
      }
      customAttributes {
        tbd
      }
      socialLinks {
        title
        links
      }
      customLinks {
        title
        links
      }
      owner {
        id
        zucityProfile {
          id
          avatar
          author {
            id
          }
          username
        }
      }
      events(first: 100) {
        edges {
          node {
            createdAt
            description
            endTime
            externalUrl
            gated
            id
            imageUrl
            maxParticipant
            meetingUrl
            minParticipant
            participantCount
            profileId
            spaceId
            startTime
            status
            tagline
            timezone
            title
            space {
              name
              avatar
            }
          }
        }
      }
      userRoles(filters: $userRolesFilters, first: $userRolesFirst) {
        edges {
          node {
            roleId
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpaceAndEventsQuery, GetSpaceAndEventsQueryVariables>;
export const GetSpacesAndMembersDocument = new TypedDocumentString(`
    query GetSpacesAndMembers($first: Int, $userRolesFirst: Int = 100, $userRolesFilters: ZucityUserRolesFiltersInput) {
  zucitySpaceIndex(first: $first) {
    edges {
      node {
        id
        avatar
        banner
        description
        name
        profileId
        tagline
        category
        color
        createdAt
        updatedAt
        tags {
          tag
        }
        customAttributes {
          tbd
        }
        socialLinks {
          title
          links
        }
        customLinks {
          title
          links
        }
        owner {
          id
          zucityProfile {
            id
            avatar
            author {
              id
            }
            username
          }
        }
        userRoles(filters: $userRolesFilters, first: $userRolesFirst) {
          edges {
            node {
              roleId
            }
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetSpacesAndMembersQuery, GetSpacesAndMembersQueryVariables>;
export const UpdateZucitySpaceDocument = new TypedDocumentString(`
    mutation UpdateZucitySpace($input: UpdateZucitySpaceInput!) {
  updateZucitySpace(input: $input) {
    document {
      id
      name
      description
      avatar
      banner
      category
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateZucitySpaceMutation, UpdateZucitySpaceMutationVariables>;
export const CreateSpaceGatingRuleDocument = new TypedDocumentString(`
    mutation CreateSpaceGatingRule($input: CreateZucitySpaceGatingInput!) {
  createZucitySpaceGating(input: $input) {
    document {
      id
      spaceId
      poapsId {
        poapId
      }
      zuPassInfo {
        registration
        eventId
        eventName
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CreateSpaceGatingRuleMutation, CreateSpaceGatingRuleMutationVariables>;
export const UpdateSpaceGatingRuleDocument = new TypedDocumentString(`
    mutation UpdateSpaceGatingRule($input: UpdateZucitySpaceGatingInput!) {
  updateZucitySpaceGating(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateSpaceGatingRuleMutation, UpdateSpaceGatingRuleMutationVariables>;
export const DeleteSpaceGatingRuleDocument = new TypedDocumentString(`
    mutation DeleteSpaceGatingRule($input: EnableIndexingZucitySpaceGatingInput!) {
  enableIndexingZucitySpaceGating(input: $input) {
    document {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<DeleteSpaceGatingRuleMutation, DeleteSpaceGatingRuleMutationVariables>;