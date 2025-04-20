import { PipelineEdDSATicketZuAuthConfig } from '@pcd/passport-interface';
import { Announcement } from './announcement';
import { UserRole } from './author';
import { Link, SpaceTag, TBD } from './base';
import { InstalledApp } from './dapp';
import { Event } from './event';
import { Profile } from './profile';
/**
 * 空间属性接口
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
  profileId?: string;
  tags?: SpaceTag[];
  socialLinks?: Link[];
  customLinks?: Link[];
  customAttributes?: TBD[];
  gated?: string;
  createdAt: string;
  updatedAt: string;
  // 匹配ZucitySpace
  owner: {
    id: string;
    zucityProfile: Profile;
  };
  // 关联数据 这里要修改
  announcements?: Announcement;
  events?: Event;
  installedApps?: InstalledApp;
  spaceGating?: SpaceGating;
  userRoles?: UserRole;
}

/**
 * ZuPassInfo接口
 * @todo 考虑是否把链的信息去除
 */
export interface ZuPassInfo extends PipelineEdDSATicketZuAuthConfig {
  access?: string;
  eventId: string;
  eventName: string;
  registration: string;
}

/**
 * PoapsId接口
 */
export interface PoapsId {
  poapId: number;
}

/**
 * 空间访问控制接口
 */
export interface SpaceGating {
  id: string;
  spaceId: string;
  gatingStatus: string;
  poapsId?: { poapId: number }[];
  zuPassInfo?: ZuPassInfo;
}

/**
 * 创建空间的输入类型
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
 * 更新空间的输入类型
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
