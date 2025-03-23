import { graphql } from '@/graphql/gql';

export const GET_SPACE_QUERY = graphql(`
  query GetSpace($id: ID!) {
    node(id: $id) {
      ... on ZucitySpace {
        id
        avatar
        banner
        description
        name
        profileId
        tagline
        website
        twitter
        telegram
        nostr
        lens
        github
        discord
        ens
        customAttributes {
          tbd
        }
        admins {
          id
        }
        superAdmin {
          id
          zucityProfile {
            id
            avatar
            author {
              id
            }
            username
          }
        }
      }
    }
  }
`);



export const GET_SPACE_INSTALLED_DAPPS = graphql(`
  query GetDappDetail($id: ID!) {
    node(id: $id) {
      ... on ZucityDappInfo {
        id
        installedSpaces
      }
    }
  }
`);

export const UPDATE_SPACE_INSTALLED_DAPPS = graphql(`
  mutation UpdateDappSpaces($input: UpdateZucityDappInfoInput!) {
    updateZucityDappInfo(input: $input) {
      document {
        id
        installedSpaces
      }
    }
  }
`);
