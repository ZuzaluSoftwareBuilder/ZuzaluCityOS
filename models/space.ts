import { PipelineEdDSATicketZuAuthConfig } from '@pcd/passport-interface';
import { Announcement } from './announcement';
import { UserRole } from './author';
import { Edge, Link, SpaceTag } from './base';
import { InstalledApp } from './dapp';
import { Event } from './event';
import { Profile } from './profile';

/**
 * Space properties interface
 */
export interface Space {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  tagline?: string;
  category?: string;
  color?: string;
  tags?: SpaceTag[];
  socialLinks?: Link[];
  customLinks?: Link[];
  gated?: string;
  createdAt: string;
  updatedAt: string;
  // Match ZucitySpace
  owner: Profile;
  author: Profile;
  // Related data using edges.node pattern
  announcements?: Edge<Announcement>;
  events?: Edge<Event>;
  installedApps?: Edge<InstalledApp>;
  spaceGating?: Edge<SpaceGating>;
  userRoles?: Edge<UserRole>;
}

/**
 * ZuPassInfo interface
 * @todo Consider whether to remove chain information
 */
export interface ZuPassInfo extends PipelineEdDSATicketZuAuthConfig {
  access?: string;
  eventId: string;
  eventName: string;
  registration: string;
}

/**
 * PoapsId interface
 */
export interface PoapsId {
  poapId: number;
}

/**
 * Space access control interface
 */
export interface SpaceGating {
  id: string;
  spaceId: string;
  gatingStatus: string;
  poapsId?: { poapId: number }[];
  zuPassInfo?: ZuPassInfo;
}

/**
 * Input type for creating a space
 */
export type CreateSpaceInput = Omit<
  Space,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'announcements'
  | 'events'
  | 'installedApps'
  | 'spaceGating'
  | 'userRoles'
>;

/**
 * Input type for updating a space
 */
export type UpdateSpaceInput = Partial<
  Omit<
    Space,
    | 'id'
    | 'profileId'
    | 'createdAt'
    | 'updatedAt'
    | 'announcements'
    | 'events'
    | 'installedApps'
    | 'spaceGating'
    | 'userRoles'
  >
>;
