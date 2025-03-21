import { graphql } from '@/graphql/gql';

export const GET_PROFILE_BY_NAME_QUERY = graphql(`
    query SearchByExactUsername($username: String!) {
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
