import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
  type QueryKey,
} from '@tanstack/react-query';
import { useCeramicContext } from '@/context/CeramicContext';

type GraphQLResponse<TData> = {
  data: TData;
  errors: any;
};

export function useGraphQL<
  TResult,
  TVariables,
  TReturn = GraphQLResponse<TResult>,
>(
  queryKey: QueryKey,
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables, options]: TVariables extends Record<string, never>
    ? [
        Omit<
          UseQueryOptions<GraphQLResponse<TResult>, Error, TReturn>,
          'queryKey' | 'queryFn'
        >?,
      ]
    : [
        TVariables,
        Omit<
          UseQueryOptions<GraphQLResponse<TResult>, Error, TReturn>,
          'queryKey' | 'queryFn'
        >?,
      ]
): UseQueryResult<TReturn, Error> {
  const { composeClient } = useCeramicContext();

  return useQuery<GraphQLResponse<TResult>, Error, TReturn>({
    queryKey,
    queryFn: () =>
      composeClient.executeQuery(
        document.toString(),
        variables ? variables : undefined,
      ),
    ...options,
  });
}
