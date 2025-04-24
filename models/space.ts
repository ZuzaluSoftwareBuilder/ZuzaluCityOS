import { Announcement } from './announcement';
import { UserRole } from './author';
import { Edge, Link, Tag } from './base';
import { InstalledApp } from './dapp';
import { Event } from './event';
import { Profile } from './profile';
import { SpaceGating } from './spaceGating';

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
  tags?: Tag[];
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
  spaceGating?: Edge<SpaceGating[]>;
  userRoles?: UserRole[];
  isLegacy?: boolean;
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
