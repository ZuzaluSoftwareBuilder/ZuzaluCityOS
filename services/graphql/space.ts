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

export const INSTALL_DAPP_TO_SPACE = graphql(`
  mutation InstallDappToSpace($input: CreateZucityInstalledAppInput!) {
    createZucityInstalledApp(input: $input) {
      document {
        id
        sourceId
        spaceId
        installedAppId
        createdAt
        updatedAt
        installedApp {
          id
          appName
        }
      }
    }
  }
`);
