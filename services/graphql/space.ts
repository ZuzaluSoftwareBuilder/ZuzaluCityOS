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
        nativeAppName
        installedAppId
        installedApp {
          id
          appName
        }
        createdAt
        updatedAt
      }
    }
  }
`);

export const GET_SPACE_INSTALLED_APPS = graphql(`
  query GetSpaceInstalledApps(
    $filters: ZucityInstalledAppFiltersInput
    $first: Int
    $after: String
  ) {
    zucityInstalledAppIndex(filters: $filters, first: $first, after: $after) {
      edges {
        node {
          id
          sourceId
          spaceId
          nativeAppName
          installedAppId
          createdAt
          updatedAt
          installedApp {
            id
            appName
            appType
            description
            tagline
            bannerUrl
            appUrl
            openSource
            devStatus
            developerName
            categories
          }
          space {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export const UNINSTALL_DAPP_FROM_SPACE = graphql(`
  mutation UninstallDappFromSpace($input: EnableIndexingZucityInstalledAppInput!) {
    enableIndexingZucityInstalledApp(input: $input) {
      document {
        id
        sourceId
        spaceId
        installedAppId
        installedApp {
          id
          appName
        }
        createdAt
        updatedAt
      }
    }
  }
`);
