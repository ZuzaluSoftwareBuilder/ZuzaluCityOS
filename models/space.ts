import { CeramicAccount } from './ceramicAccount';
import { Profile } from './profile';
/**
 * 空间链接接口
 */
export interface SpaceLink {
  title: string;
  links: string;
}

/**
 * 空间标签接口
 */
export interface SpaceTag {
  tag: string;
}

/**
 * TBD类型
 */
export interface TBD {
  tbd: string;
}

/**
 * 连接边接口
 */
export interface ConnectionEdge<T> {
  node: T;
}

/**
 * 连接接口
 */
export interface Connection<T> {
  edges: ConnectionEdge<T>[];
}

/**
 * 公告接口
 */
export interface Announcement {
  id: string;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 事件接口
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  spaceId: string;
  imageUrl?: string;
  status?: string;
  gated?: string;
}

/**
 * 已安装的应用接口
 */
export interface InstalledApp {
  id: string;
  sourceId?: string;
  spaceId?: string;
  nativeAppName?: string;
  installedAppId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ZuPassInfo接口
 */
export interface ZuPassInfo {
  access?: string;
  eventId?: string;
  eventName?: string;
  registration?: string;
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
  zuPassInfo?: ZuPassInfo;
  poapsId?: PoapsId[];

  // 添加新字段，匹配ZucitySpaceGating
  ERC20ContractAddress?: string;
  ERC721ContractAddress?: string;
  ERC1155ContractAddress?: string;
  author?: CeramicAccount;
  customAttributes?: TBD[];
  gatingCondition?: string;
  roleId?: string;
  space?: Space;
}

/**
 * 用户角色接口
 */
export interface UserRole {
  id: string;
  roleId: string;
}

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
  profileId: string;
  tags?: SpaceTag[];
  socialLinks?: SpaceLink[];
  customLinks?: SpaceLink[];
  customAttributes?: TBD[];
  gated?: string;
  createdAt: string;
  updatedAt: string;

  // 新增字段，匹配ZucitySpace
  author?: CeramicAccount;
  owner?: CeramicAccount;
  ownerId?: string;
  profile?: Profile;

  // 关联数据 这里要修改
  announcements?: Connection<Announcement>;
  events?: Connection<Event>;
  installedApps?: Connection<InstalledApp>;
  spaceGating?: Connection<SpaceGating>;
  userRoles?: Connection<UserRole>;
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

/**
 * 空间查询过滤条件
 */
export interface SpaceFilters {
  category?: string;
  name?: string;
  tags?: string[];
  ownerId?: string;
}
