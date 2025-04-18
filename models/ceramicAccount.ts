import { Profile } from './profile';

/**
 * 通用连接边接口
 */
export interface ConnectionEdge<T> {
  node: T;
}

/**
 * 通用连接接口
 */
export interface Connection<T> {
  edges: ConnectionEdge<T>[];
}

/**
 * 筛选条件输入类型
 */
export interface FiltersInput {
  [key: string]: any;
}

/**
 * 排序输入类型
 */
export interface SortingInput {
  [key: string]: 'ASC' | 'DESC';
}

/**
 * Ceramic账户接口
 * 对应GraphQL schema中的CeramicAccount类型
 */
export interface CeramicAccount {
  /**
   * 账户的全局唯一标识符(DID字符串)
   */
  id: string;

  /**
   * 表示Ceramic实例是否使用该账户进行身份验证
   */
  isViewer: boolean;

  /**
   * 关联的用户资料
   */
  zucityProfile?: Profile;

  /**
   * 公告列表
   */
  zucityAnnouncementList?: Connection<any>;

  /**
   * 公告总数
   */
  zucityAnnouncementListCount?: number;

  /**
   * 应用表单列表
   */
  zucityApplicationFormList?: Connection<any>;

  /**
   * 应用表单总数
   */
  zucityApplicationFormListCount?: number;

  /**
   * Dapp信息列表
   */
  zucityDappInfoList?: Connection<any>;

  /**
   * Dapp信息总数
   */
  zucityDappInfoListCount?: number;

  /**
   * 事件列表
   */
  zucityEventList?: Connection<any>;

  /**
   * 事件总数
   */
  zucityEventListCount?: number;

  /**
   * 事件帖子列表
   */
  zucityEventPostList?: Connection<any>;

  /**
   * 事件帖子总数
   */
  zucityEventPostListCount?: number;

  /**
   * 事件注册和访问列表
   */
  zucityEventRegistrationAndAccessList?: Connection<any>;

  /**
   * 事件注册和访问总数
   */
  zucityEventRegistrationAndAccessListCount?: number;

  /**
   * 已安装应用列表
   */
  zucityInstalledAppList?: Connection<any>;

  /**
   * 已安装应用总数
   */
  zucityInstalledAppListCount?: number;

  /**
   * 邀请列表
   */
  zucityInvitationList?: Connection<any>;

  /**
   * 邀请总数
   */
  zucityInvitationListCount?: number;

  /**
   * 权限列表
   */
  zucityPermissionList?: Connection<any>;

  /**
   * 权限总数
   */
  zucityPermissionListCount?: number;

  /**
   * 角色列表
   */
  zucityRoleList?: Connection<any>;

  /**
   * 角色总数
   */
  zucityRoleListCount?: number;

  /**
   * 角色权限列表
   */
  zucityRolePermissionList?: Connection<any>;

  /**
   * 角色权限总数
   */
  zucityRolePermissionListCount?: number;

  /**
   * 会话列表
   */
  zucitySessionList?: Connection<any>;

  /**
   * 会话总数
   */
  zucitySessionListCount?: number;

  /**
   * 空间访问控制列表
   */
  zucitySpaceGatingList?: Connection<any>;

  /**
   * 空间访问控制总数
   */
  zucitySpaceGatingListCount?: number;

  /**
   * 空间列表
   */
  zucitySpaceList?: Connection<any>;

  /**
   * 空间总数
   */
  zucitySpaceListCount?: number;

  /**
   * 用户角色列表
   */
  zucityUserRolesList?: Connection<any>;

  /**
   * 用户角色总数
   */
  zucityUserRolesListCount?: number;
}

/**
 * 简化版Ceramic账户接口
 * 用于引用账户而无需完整账户信息
 */
export interface CeramicAccountRef {
  id: string;
}
