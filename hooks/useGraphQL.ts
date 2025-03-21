import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useCeramicContext } from '@/context/CeramicContext';

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<TResult> {
  const { composeClient } = useCeramicContext();
  return useQuery({
    queryKey: [(document as any).definitions?.[0]?.name?.value, variables],
    queryFn: async ({ queryKey }) =>
      composeClient.executeQuery(
        document,
        queryKey[1] ? queryKey[1] : undefined,
      ),
  });
}
