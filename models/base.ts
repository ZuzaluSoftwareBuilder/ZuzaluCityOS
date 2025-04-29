/**
 * Space link interface
 */
export interface Link {
  title: string;
  links: string;
}

/**
 * Space tag interface
 */
export interface Tag {
  tag: string;
}

/**
 * TBD type
 */
export interface TBD {
  tbd: string;
}

/**
 * Edge node interface
 * @template T - Node type
 */
export type Edge<T> = {
  edges: Array<{
    node: T;
  }>;
};

/**
 * Unified return type
 */
export type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

/**
 * Success result
 */
export interface SuccessResult<T> {
  data: T;
  error: null;
}

/**
 * Error result
 */
export interface ErrorResult<E = Error> {
  data: null;
  error: E;
}

/**
 * Create success result
 */
export function createSuccessResult<T>(data: T): SuccessResult<T> {
  return { data, error: null };
}

/**
 * Create error result
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
