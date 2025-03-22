import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { useCeramicContext } from '@/context/CeramicContext';

export function useGraphQL<TResult, TVariables>(
  queryKey: QueryKey,
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables, options]: TVariables extends Record<string, never>
    ? [Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>?]
    : [TVariables, Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>?]
): UseQueryResult<{ data: TResult; errors: any }> {
  const { composeClient } = useCeramicContext();

  return useQuery({
    queryKey,
    queryFn: () =>
      composeClient.executeQuery(
        document.toString(),
        variables ? variables : undefined,
      ),
    ...options,
  }) as UseQueryResult<{ data: TResult; errors: any }>;
}
