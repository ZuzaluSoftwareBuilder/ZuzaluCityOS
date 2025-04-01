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

export const GET_USER_OWN_SPACE = graphql(`
  query GetUserOwnSpace($did: ID!) {
    node(id: $did) {
      ... on CeramicAccount {
        zucityProfile {
          id
          username
          avatar
          author {
            id
          }
          spaces(first: 100) {
            edges {
              node {
                id
                author {
                  id
                }
                avatar
                banner
                name
                description
                category
                color
                profileId
                customAttributes {
                  tbd
                }
                customLinks {
                  links
                  title
                }
                owner {
                  id
                }
                socialLinks {
                  links
                  title
                }
                tagline
                tags {
                  tag
                }
                createdAt
                updatedAt
              }
            }
          }
        }
      }
    }
  }
`);

export const GET_USER_OWN_EVENT = graphql(`
  query GetUserOwnEvent($did: ID!) {
    node(id: $did) {
      ... on CeramicAccount {
        zucityProfile {
          id
          username
          avatar
          events(first: 100) {
            edges {
              node {
                id
                admins {
                  id
                }
                createdAt
                author {
                  id
                }
                customAttributes {
                  tbd
                }
                customLinks {
                  links
                  title
                }
                description
                endTime
                externalUrl
                gated
                imageUrl
                members {
                  id
                }
                participantCount
                minParticipant
                profileId
                spaceId
                startTime
                status
                superAdmin {
                  id
                }
                supportChain
                tagline
                timezone
                title
                tracks
              }
            }
          }
          author {
            id
          }
        }
      }
    }
  }
`);
