import { graphql } from '@/graphql';

export const GET_ALL_EVENT_QUERY = graphql(`
  query GetAllEvents($first: Int) {
    zucityEventIndex(first: $first) {
      edges {
        node {
          id
          description
          profileId
          tagline
          customAttributes {
            tbd
          }
          gated
          superAdmin {
            id
          }
          admins {
            id
          }
          author {
            id
          }
          customLinks {
            links
            title
          }
          createdAt
          endTime
          externalUrl
          imageUrl
          members {
            id
          }
          participantCount
          spaceId
          startTime
          status
          supportChain
          timezone
          title
          tracks
        }
      }
    }
  }
`);

export const GET_EVENT_QUERY_BY_IDS = graphql(`
  query GetEventByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ZucityEvent {
        id
        description
        profileId
        tagline
        customAttributes {
          tbd
        }
        gated
        superAdmin {
          id
        }
        admins {
          id
        }
        author {
          id
        }
        customLinks {
          links
          title
        }
        createdAt
        endTime
        externalUrl
        imageUrl
        members {
          id
        }
        participantCount
        spaceId
        startTime
        status
        supportChain
        timezone
        title
        tracks
      }
    }
  }
`);
