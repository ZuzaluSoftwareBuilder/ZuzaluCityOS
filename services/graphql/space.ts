import { graphql } from '@/graphql/gql';

export const GET_SPACE_QUERY_BY_ID = graphql(`
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
        category
        color
        createdAt
        updatedAt
        tags {
          tag
        }
        customAttributes {
          tbd
        }
        socialLinks {
          title
          links
        }
        customLinks {
          title
          links
        }
        owner {
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
  mutation UninstallDappFromSpace(
    $input: EnableIndexingZucityInstalledAppInput!
  ) {
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

export const CREATE_SPACE_MUTATION = graphql(`
  mutation createZucitySpaceMutation($input: CreateZucitySpaceInput!) {
    createZucitySpace(input: $input) {
      document {
        id
        name
        description
        profileId
        avatar
        banner
        category
      }
    }
  }
`);

export const GET_SPACE_QUERY = graphql(`
  query GetSpaces($first: Int) {
    zucitySpaceIndex(first: $first) {
      edges {
        node {
          id
          avatar
          banner
          description
          name
          profileId
          tagline
          category
          color
          createdAt
          updatedAt
          tags {
            tag
          }
          customAttributes {
            tbd
          }
          socialLinks {
            title
            links
          }
          customLinks {
            title
            links
          }
          owner {
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
  }
`);

export const GET_SPACE_AND_EVENTS_QUERY_BY_ID = graphql(`
  query GetSpaceAndEvents($id: ID!) {
    node(id: $id) {
      ... on ZucitySpace {
        id
        avatar
        banner
        description
        name
        profileId
        tagline
        category
        color
        createdAt
        updatedAt
        tags {
          tag
        }
        customAttributes {
          tbd
        }
        socialLinks {
          title
          links
        }
        customLinks {
          title
          links
        }
        owner {
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
        events(first: 100) {
          edges {
            node {
              createdAt
              description
              endTime
              externalUrl
              gated
              id
              imageUrl
              maxParticipant
              meetingUrl
              minParticipant
              participantCount
              profileId
              spaceId
              startTime
              status
              tagline
              timezone
              title
              space {
                name
                avatar
              }
            }
          }
        }
      }
    }
  }
`);
