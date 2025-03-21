import { graphql } from '@/graphql/gql';

export const GET_PROFILE_BY_NAME_QUERY = graphql(`
    query SearchProfileByExactUsername($username: String!) {
        zucityProfileIndex(
            first: 1,
            filters: { where: { username: { equalTo: $username } } }
        ) {
            edges {
                node {
                    id
                    username
                    avatar
                    author {
                        id
                    }
                }
            }
        }
    }
`).toString();

export const GET_PROFILE_BY_DID_QUERY = graphql(`
  query GetProfileByDID($did: ID!) {
    node(id: $did) {
      ...on CeramicAccount {
        zucityProfile {
          id
          username
          avatar
          author {
            id
          }
        }
      }
    }
  }
`).toString();
