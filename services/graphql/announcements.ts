import { graphql } from '@/graphql/gql';

export const CREATE_ANNOUNCEMENT_MUTATION = graphql(`
  mutation CreateZucityAnnouncementMutation(
    $input: CreateZucityAnnouncementInput!
  ) {
    createZucityAnnouncement(input: $input) {
      document {
        id
        title
        description
        createdAt
        updatedAt
        sourceId
        spaceId
        eventId
        space {
          id
          name
        }
        event {
          id
          title
        }
      }
    }
  }
`);

export const UPDATE_ANNOUNCEMENT_MUTATION = graphql(`
  mutation UpdateZucityAnnouncementMutation(
    $input: UpdateZucityAnnouncementInput!
  ) {
    updateZucityAnnouncement(input: $input) {
      document {
        id
        title
        description
        updatedAt
      }
    }
  }
`);

export const ENABLE_ANNOUNCEMENT_INDEXING_MUTATION = graphql(`
  mutation EnableIndexingZucityAnnouncement(
    $input: EnableIndexingZucityAnnouncementInput!
  ) {
    enableIndexingZucityAnnouncement(input: $input) {
      document {
        id
      }
    }
  }
`);

export const GET_SPACE_ANNOUNCEMENTS_QUERY = graphql(`
  query GetSpaceAnnouncements($id: ID!, $first: Int = 100) {
    node(id: $id) {
      ... on ZucitySpace {
        announcements(first: $first) {
          edges {
            node {
              id
              title
              tags {
                tag
              }
              description
              createdAt
              updatedAt
              sourceId
              author {
                id
                zucityProfile {
                  avatar
                  username
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`);

export const GET_EVENT_ANNOUNCEMENTS_QUERY = graphql(`
  query GetEventAnnouncements($id: ID!, $first: Int = 100) {
    node(id: $id) {
      ... on ZucityEvent {
        announcements(first: $first) {
          edges {
            node {
              id
              title
              tags {
                tag
              }
              description
              createdAt
              updatedAt
              sourceId
              author {
                id
                zucityProfile {
                  avatar
                  username
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`);
