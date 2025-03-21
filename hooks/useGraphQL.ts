import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useCeramicContext } from '@/context/CeramicContext';

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables, options]: TVariables extends Record<string, never>
    ? [Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>?]
    : [TVariables, Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>?]
): UseQueryResult<TResult> {
  const { composeClient } = useCeramicContext();

  const queryKey = [(document as any).definitions?.[0]?.name?.value, variables];

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey }) =>
      composeClient.executeQuery(
        document,
        queryKey[1] ? (queryKey[1] as Record<string, unknown>) : undefined,
      ),
    ...options,
  });
}
