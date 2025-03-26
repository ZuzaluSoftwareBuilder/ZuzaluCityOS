import { graphql } from '@/graphql/gql';

export const GET_PROFILE_BY_NAME_QUERY = graphql(`
  query SearchProfileByExactUsername($username: String!) {
    zucityProfileIndex(
      first: 20
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
      ... on CeramicAccount {
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

export const GET_USER_SPACE_AND_EVENT = graphql(`
query GetUserSpaceAndEvent($did: ID!) {
  node(id: $did) {
    ... on CeramicAccount {
      zucityProfile {
        id
        username
        author {
          id
        }
        events(first: 100) {
          edges {
            node {
              id
              imageUrl
              title
              createdAt
              description
              endTime
              externalUrl
              gated
              profileId
              spaceId
              startTime
              status
              tagline
              supportChain
              timezone
              tracks
            }
          }
        }
        spaces(first: 100) {
          edges {
            node {
              id
              name
              avatar
              banner
              category
              customAttributes {
                tbd
              }
              description
              discord
              ens
              gated
              github
              nostr
              tagline
              telegram
              twitter
              website
            }
          }
        }
      }
    }
  }
}
`);

export const CREATE_PROFILE_MUTATION = graphql(`
  mutation CreateProfile($input: SetZucityProfileInput!) {
    setZucityProfile(input: $input) {
      document {
        id
        username
      }
    }
  }
`);

export const GET_OWN_PROFILE_QUERY = graphql(`
  query GetOwnProfile {
    viewer {
      zucityProfile {
        author {
          id
        }
        avatar
        id
        username
      }
    }
  }
`);
