/**
 * 空间链接接口
 */
export interface Link {
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
 * Edge节点接口
 * @template T - 节点类型
 */
export type Edge<T> = {
  edges: Array<{
    node: T;
  }>;
};

/**
 * 统一的返回值类型
 */
export type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

/**
 * 成功结果
 */
export interface SuccessResult<T> {
  data: T;
  error: null;
}

/**
 * 错误结果
 */
export interface ErrorResult<E = Error> {
  data: null;
  error: E;
}

/**
 * 创建成功结果
 */
export function createSuccessResult<T>(data: T): SuccessResult<T> {
  return { data, error: null };
}

/**
 * 创建错误结果
 */
export function createErrorResult<E extends Error = Error>(
  error: E | string | any,
): ErrorResult<E> {
  const err =
    error instanceof Error
      ? (error as E)
      : (new Error(typeof error === 'string' ? error : String(error)) as E);
  return { data: null, error: err };
}
