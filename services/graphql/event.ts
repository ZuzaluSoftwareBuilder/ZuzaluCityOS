import { graphql } from '@/graphql';

export const GET_ALL_EVENT_QUERY = graphql(`
  query GetAllEvents {
    zucityEventIndex(first: 1000) {
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
